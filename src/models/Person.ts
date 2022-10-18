import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
} from 'rxdb';

const personSchemaLiteral = {
  title: 'person schema',
  description: 'describes a person',
  version: 0,
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
  ],
  indexes: ['_deleted', 'updatedAt'],
  encrypted: [
    'avatar',
    'firstName',
    'lastName',
    'email',
    'company',
    'job',
  ] as never,
} as const; // <- It is important to set 'as const' to preserve the literal type
const schemaTyped = toTypedRxJsonSchema(personSchemaLiteral);

// aggregate the document type from the schema
export type Person = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;
export const personSchema: RxJsonSchema<Person> = personSchemaLiteral;
