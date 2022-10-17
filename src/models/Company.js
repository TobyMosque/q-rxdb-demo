export const companySchema = {
  title: 'company schema',
  description: 'describes a company',
  version: 0,
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
  indexes: ['name', '_deleted', 'updatedAt'],
};
