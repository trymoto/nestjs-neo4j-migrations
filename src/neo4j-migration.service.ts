import { Logger, Neo4jDriver, Neo4jMigrationList } from './interfaces';
import { invariant } from './utils';

export class Neo4jMigrationService {
  static async run(
    migrations: Neo4jMigrationList,
    driver: Neo4jDriver,
    logger?: Logger,
  ): Promise<void> {
    const session = driver.session();
    try {
      // ensure root node exists
      const { records: rootRecords } = await session.run(
        `
        MERGE (m:migration {key: '0'})
        RETURN m
        `,
      );
      const root = rootRecords[0]?.get('m');
      invariant(root, 'root node not found');

      const { records: lastRecords } = await session.run(
        `
        MATCH (m:migration)
        WHERE NOT (m)-[:FOLLOWS]->()
        RETURN m
        `,
      );
      const lastAppliedMigration = lastRecords[0]?.get('m');
      invariant(lastAppliedMigration, 'lastAppliedMigration not found');

      const lastAppliedKey = Number.parseInt(
        lastAppliedMigration.properties.key,
      );
      logger?.log(`Last migration key: ${lastAppliedKey}`);

      const sortedMigrationsToApply = migrations
        .map((MigrationClass) => new MigrationClass())
        .sort((a, b) => a.key - b.key)
        .filter((migration) => migration.key > lastAppliedKey);

      if (sortedMigrationsToApply.length === 0) {
        logger?.log('No migrations to apply');
      } else {
        for (const migration of sortedMigrationsToApply) {
          logger?.log(`Applying migration: ${migration.key}`);

          await migration.up(session);

          await session.executeWrite(async (trx) => {
            await trx.run(
              `
              MATCH (lastNode:migration)
              WHERE NOT (lastNode)-[:FOLLOWS]->()
              WITH lastNode
              CREATE (newNode:migration {key: $migrationKey})
              CREATE (lastNode)-[:FOLLOWS]->(newNode)
              RETURN newNode
              `,
              {
                migrationKey: migration.key.toString(),
              },
            );
          });
        }
      }
    } finally {
      await session.close();
    }
  }
}
