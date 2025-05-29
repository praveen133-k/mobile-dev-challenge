// keystone.ts
import { config } from '@keystone-6/core';
import { lists } from './schema';
import type { Context } from '.keystone/types';
import { seedNoodleData } from './seedNoodles';

export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./keystone.db',
    async onConnect(context) {
      console.log('Connected to DB. Checking for existing seed data...');
      await seedNoodleData(context as unknown as Context);
    },
  },
  lists,
});
