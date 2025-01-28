import {
  Neo4jDriver,
  Neo4jDriverToken,
  Neo4jMigration,
  Neo4jSession,
} from '../src';
import { TestCase } from './test-case';

class SampleMigration implements Neo4jMigration {
  readonly key = 1;

  async up(session: Neo4jSession): Promise<void> {
    await session.executeWrite((trx) =>
      trx.run(`CREATE (n:SampleNode {id: $id})`, { id: 1 }),
    );
  }

  async down(session: Neo4jSession): Promise<void> {
    await session.executeWrite((trx) =>
      trx.run(`MATCH (n:SampleNode {id: $id}) DELETE n`, { id: 1 }),
    );
  }
}

const testCase = new TestCase([SampleMigration]);

describe('Migrations tests', () => {
  beforeAll(async () => await testCase.beforeAll(), TestCase.defaultTimeout);
  afterAll(async () => await testCase.afterAll(), TestCase.defaultTimeout);

  it(
    'should resolve Neo4jModule',
    async () => {
      const module = await testCase.app.resolve(Neo4jDriverToken);
      expect(module).toBeDefined();
    },
    TestCase.defaultTimeout,
  );

  it(
    'should run single migration',
    async () => {
      const driver = await testCase.app.resolve<Neo4jDriver>(Neo4jDriverToken);

      const session = driver.session();
      const result = await session.run(`MATCH (n:SampleNode) RETURN n`);
      expect(result.records).toHaveLength(1);
      expect(result.records[0]?.get('n').properties.id).toBe(1);
    },
    TestCase.defaultTimeout,
  );
});
