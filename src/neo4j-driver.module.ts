import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';

import {
  Logger,
  LoggerToken,
  Neo4jConfig,
  Neo4jConfigToken,
} from './interfaces';
import { Neo4jDriverProvider } from './neo4j-driver.provider';

export interface Neo4jDriverModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => Promise<Neo4jConfig> | Neo4jConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
}

@Module({})
export class Neo4jDriverModule {
  static forRoot(config: Neo4jConfig, logger?: Logger): DynamicModule {
    const configProvider = {
      provide: Neo4jConfigToken,
      useValue: config,
    };

    const loggerProvider = {
      provide: LoggerToken,
      useValue: logger,
    };

    return {
      module: Neo4jDriverModule,
      global: true,
      providers: [configProvider, loggerProvider, Neo4jDriverProvider],
      exports: [Neo4jDriverProvider],
    };
  }

  static forRootAsync(
    config: Neo4jDriverModuleAsyncOptions,
    logger?: Logger,
  ): DynamicModule {
    const configProvider = {
      provide: Neo4jConfigToken,
      useFactory: config.useFactory,
      inject: config.inject,
    };

    const loggerProvider = {
      provide: LoggerToken,
      useValue: logger,
    };

    return {
      module: Neo4jDriverModule,
      global: true,
      providers: [configProvider, loggerProvider, Neo4jDriverProvider],
      exports: [Neo4jDriverProvider],
    };
  }
}
