import { createScheme } from './factory';

export const companySchema = createScheme('company', {
  title: 'company schema',
  description: 'describes a company',
  primaryKey: 'companyId',
  type: 'object',
  properties: {
    companyId: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    updatedAt: {
      type: 'integer',
    },
    _deleted: {
      type: 'boolean',
    },
  },
  required: ['companyId', 'name', 'updatedAt', '_deleted'],
  indexes: ['_deleted', 'updatedAt'],
});
