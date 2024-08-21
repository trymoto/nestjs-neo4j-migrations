import * as path from 'path';

import { auth, driver } from 'neo4j-driver';
import * as yargs from 'yargs';

import { Logger, Neo4jConfig } from '../interfaces';
import { invariant } from '../utils';

type RevertCommandArgs = {
  config: string;
};

export class RevertCommand
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  implements yargs.CommandModule<{}, RevertCommandArgs>
{
  command = 'revert';
  describe = 'Reverts last executed migration.';

  constructor(private readonly logger: Logger) {
    this.handler = this.handler.bind(this);
  }

  builder(args: yargs.Argv) {
    return args.option('config', {
      alias: 'c',
      describe:
        'Path to the directory that contains index.ts file with exported migrations array, url, username, and password variables.',
      type: 'string',
      demandOption: true,
    });
  }

  async handler(args: yargs.Arguments<RevertCommandArgs>) {
    this.logger?.log('Reverting last executed migration');

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const config: Neo4jConfig = require(
      path.resolve(process.cwd(), args.config),
    );

    if (!config.migrations.length) {
      this.logger?.log('No migrations found');
      return;
    }

    const driverInstance = driver(
      config.uri,
      auth.basic(config.username, config.password),
    );

    const session = driverInstance.session();
    try {
      const { records: lastRecords } = await session.run(
        `
        MATCH (m:migration)
        WHERE NOT (m)-[:FOLLOWS]->()
        RETURN m
        `,
      );
      const lastAppliedMigration = lastRecords[0]?.get('m');
      invariant(lastAppliedMigration, 'Last applied migration not found');

      const lastAppliedKey = Number.parseInt(
        lastAppliedMigration.properties.key,
      );
      this.logger?.log(`Last migration key: ${lastAppliedKey}`);

      if (lastAppliedKey === 0) {
        console?.log('No migrations to revert');
        return;
      }

      const migrationInstances = config.migrations.map(
        (MigrationClass) => new MigrationClass(),
      );

      const migrationToRevert = migrationInstances.find(
        (migration) => migration.key === lastAppliedKey,
      );

      invariant(migrationToRevert, 'Migration to revert not found');

      this.logger?.log(`Reverting migration: ${migrationToRevert.key}`);

      await migrationToRevert.down(session);

      await session.executeWrite(async (trx) => {
        await trx.run(
          `
          MATCH (lastNode:migration {key: $migrationKey})
          MATCH (prevNode:migration)-[:FOLLOWS]->(lastNode)
          DETACH DELETE lastNode
          `,
          {
            migrationKey: migrationToRevert.key.toString(),
          },
        );
      });
      this.logger?.log('Reverted successfully');
    } finally {
      await session.close();
      process.exit(0);
    }
  }
}
