export const jobSchema = {
  title: 'job schema',
  description: 'describes a job',
  version: 0,
  primaryKey: 'jobId',
  type: 'object',
  properties: {
    jobId: {
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
  required: ['jobId', 'name', 'updatedAt', '_deleted'],
  indexes: ['name', '_deleted', 'updatedAt'],
};
