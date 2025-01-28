import { INestMicroservice, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Neo4jContainer, StartedNeo4jContainer } from '@testcontainers/neo4j';

import {
  Neo4jDriverModule,
  Neo4jDriverToken,
  Neo4jMigrationList,
} from '../src';

export class TestCase {
  static defaultTimeout = 30000;
  app!: INestMicroservice;
  container!: StartedNeo4jContainer;
  constructor(readonly migrations: Neo4jMigrationList) {}

  async beforeAll() {
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
      console.error(err);
      return;
    }
  }

  async afterAll() {
    const module = this.app.get(Neo4jDriverToken);
    await this.app.close();
    await this.container.stop();
    await module.close();
  }
}
