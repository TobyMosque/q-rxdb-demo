import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
} from 'rxdb';

const companySchemaLiteral = {
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
  required: ['companyId', 'name'],
  indexes: ['name', '_deleted', 'updatedAt'],
} as const; // <- It is important to set 'as const' to preserve the literal type
const schemaTyped = toTypedRxJsonSchema(companySchemaLiteral);

// aggregate the document type from the schema
export type Company = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;
export const companySchema: RxJsonSchema<Company> = companySchemaLiteral;
