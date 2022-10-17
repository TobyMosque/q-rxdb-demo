import { createScheme } from './factory';

export const personSchema = createScheme('person', {
  title: 'person schema',
  description: 'describes a person',
  primaryKey: 'personId',
  type: 'object',
  properties: {
    personId: {
      type: 'string',
    },
    avatar: {
      type: 'string',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    company: {
      ref: 'company',
      type: 'string',
    },
    job: {
      ref: 'job',
      type: 'string',
    },
    updatedAt: {
      type: 'integer',
    },
    _deleted: {
      type: 'boolean',
    },
  },
  required: [
    'personId',
    'avatar',
    'firstName',
    'lastName',
    'email',
    'company',
    'job',
    'updatedAt',
    '_deleted',
  ],
  indexes: ['company', 'job', 'firstName', 'email', '_deleted', 'updatedAt'],
});
