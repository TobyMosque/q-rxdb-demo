import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
} from 'rxdb';

const jobSchemaLiteral = {
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
  required: ['jobId', 'name'],
  indexes: ['_deleted', 'updatedAt'],
  encrypted: ['name'] as never,
} as const; // <- It is important to set 'as const' to preserve the literal type
const schemaTyped = toTypedRxJsonSchema(jobSchemaLiteral);

// aggregate the document type from the schema
export type Job = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const jobSchema: RxJsonSchema<Job> = jobSchemaLiteral;
