# Neo4j migrations manager for NestJs

This package is inspired by TypeORM style of migration management. It tracks migrations directly inside neo4j database and runs them in order.

## Disclaimers

- WIP, lacks tests and not ready for production use
- Beware that Neo4j migrations cannot have both schema and data changes in the same migration!
- CLI for reverting is lacking but functional
- No generation of migrations yet

## Installation

```bash
npm i nestjs-neo4j-migrations
```

## Usage

### In static modules

```typescript
import { Global, Module } from '@nestjs/common';
import { Neo4jDriverModule } from 'nestjs-neo4j-migrations';

import { migrations } from './migrations';

@Global()
@Module({
  imports: [
    Neo4jDriverModule.forRoot({
      uri: process.env.NEO4J_URI,
      username: process.env.NEO4J_USERNAME,
      password: process.env.NEO4J_PASSWORD,
      migrations,
    }),
  ],
})
export class Neo4jModule {}
```

### In dynamic modules

```typescript
import { Global, Module } from '@nestjs/common';
import { Neo4jDriverModule } from 'nestjs-neo4j-migrations';

import { Config } from './config';

import { migrations } from './migrations';

@Module({
  imports: [
    Neo4jDriverModule.forRootAsync({
      inject: [Config],
      useFactory: (config: Config) => ({
        uri: config.neo4jUri,
        username: config.neo4jUser,
        password: config.neo4jPassword,
        migrations,
      }),
    }),
  ],
})
export class Neo4jModule {}
```

### Migrations file

This acts as datasource options file, it should export an array of migrations (see example of one below), uri, username and password.

```typescript
// migrations/index.ts

import dotenv from 'dotenv';
import { Neo4jMigrationList } from 'nestjs-neo4j-migrations';

import { InitMigration1234 } from './1234-Init';

dotenv.config();

export const migrations: Neo4jMigrationList = [
  InitMigration1234,
  // ... append more migrations here
];

export const uri = process.env.NEO4J_URI;
export const username = process.env.NEO4J_USERNAME;
export const password = process.env.NEO4J_PASSWORD;
```

### Migration example

Note that key can be any sequential number, but it is recommended to use timestamp for it.

```typescript
import { Neo4jMigration, Neo4jTransaction } from 'nestjs-neo4j-migrations';

export class AddIndex1723704012000 implements Neo4jMigration {
  readonly key = 1723704012000;

  async up(trx: Neo4jTransaction): Promise<void> {
    await trx.run(
      `CREATE INDEX ageId IF NOT EXISTS FOR (e:employees) ON (e.age)`,
    );

    // Beware that if you change schema (indexes, constraints, etc) you cannot have data changes in the same migration, you'll have to split them.
  }

  async down(trx: Neo4jTransaction): Promise<void> {
    await trx.run(`DROP INDEX ageId IF EXISTS`);
  }
}
```

## Reverting

```bash
npx nestjs-neo4j-migrations revert -c ./migrations
```

In this example migrations directory contains `index.ts` file described above.
