import {
  type Session,
  type Driver,
  type ManagedTransaction,
} from 'neo4j-driver';

export type Neo4jSession = Session;
export type Neo4jTransaction = ManagedTransaction;
export type Neo4jDriver = Driver;
export const Neo4jDriverToken = Symbol('Neo4jDriver');
