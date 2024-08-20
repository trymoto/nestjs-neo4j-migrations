#!/usr/bin/env node
import 'reflect-metadata';
import * as yargs from 'yargs';

import { RevertCommand } from './commands';
import { LoggerStub } from './utils';

void yargs
  .usage('Usage: $0 <command> [options]')
  .command(new RevertCommand(new LoggerStub('RevertCommand')))
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help').argv;
