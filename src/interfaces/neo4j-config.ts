import { Neo4jMigrationList } from './neo4j-migration.interface';

export interface Neo4jConnectionConfig {
  uri: string;
  username: string;
  password: string;
  database?: string;
}

export type Neo4jConfig = Neo4jConnectionConfig & {
  migrations: Neo4jMigrationList;
};
export const Neo4jConfigToken = Symbol('Neo4jConfig');
