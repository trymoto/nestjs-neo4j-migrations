import { FactoryProvider } from '@nestjs/common';
import { auth, driver } from 'neo4j-driver';

import {
  Logger,
  LoggerToken,
  Neo4jConfig,
  Neo4jConfigToken,
  Neo4jDriver,
  Neo4jDriverToken,
} from './interfaces';
import { Neo4jMigrationService } from './neo4j-migration.service';

export const Neo4jDriverProvider: FactoryProvider<Neo4jDriver | null> = {
  provide: Neo4jDriverToken,
  inject: [Neo4jConfigToken, LoggerToken],
  useFactory: async (
    config: Neo4jConfig,
    logger: Logger,
  ): Promise<Neo4jDriver | null> => {
    const { uri, username, password, migrations } = config;
    if (!uri) return null;

    const driverInstance = driver(
      uri,
      username && password ? auth.basic(username, password) : undefined,
    );

    await Neo4jMigrationService.run(migrations, driverInstance, logger);
    return driverInstance;
  },
};
