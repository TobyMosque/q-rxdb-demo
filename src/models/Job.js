import { createScheme } from './factory';

export const jobSchema = createScheme('job', {
  title: 'job schema',
  description: 'describes a job',
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
});
