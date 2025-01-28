import { INestMicroservice, Module } from '@nestjs/common';
import { Neo4jContainer, StartedNeo4jContainer } from '@testcontainers/neo4j';
import {
  Neo4jDriverModule,
  Neo4jDriverToken,
  Neo4jMigrationList,
} from '../src';
import { NestFactory } from '@nestjs/core';

export class TestCase {
  public static defaultTimeout = 30000;
  public app!: INestMicroservice;
  public container!: StartedNeo4jContainer;
  constructor(public readonly migrations: Neo4jMigrationList) {}

  public async beforeAll() {
    this.container = await new Neo4jContainer().start();

    @Module({
      imports: [
        Neo4jDriverModule.forRoot({
          uri: this.container.getBoltUri(),
          username: this.container.getUsername(),
          password: this.container.getPassword(),
          migrations: this.migrations,
        }),
      ],
    })
    class TestModule {}

    this.app = await NestFactory.createMicroservice(TestModule, {
      logger: ['debug', 'verbose'],
    });

    try {
      await this.app.init();
    } catch (err) {
      return;
    }
  }

  public async afterAll() {
    const module = this.app.get(Neo4jDriverToken);
    await this.app.close();
    await this.container.stop();
    await module.close();
  }
}
