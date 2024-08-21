import { Neo4jSession } from './neo4j-driver';

export interface Neo4jMigration {
  key: number;
  up(session: Neo4jSession): Promise<void>;
  down(session: Neo4jSession): Promise<void>;
}

export type Neo4jMigrationList = (new () => Neo4jMigration)[];
