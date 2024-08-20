import { Neo4jTransaction } from './neo4j-driver';

export interface Neo4jMigration {
  key: number;
  up(trx: Neo4jTransaction): Promise<void>;
  down(trx: Neo4jTransaction): Promise<void>;
}

export type Neo4jMigrationList = (new () => Neo4jMigration)[];
