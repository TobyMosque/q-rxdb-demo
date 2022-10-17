import { RxJsonSchema } from 'rxdb';

export interface Company {
  companyId: string;
  name: string;
  updatedAt: number;
  _deleted: boolean;
}

export const companySchema: RxJsonSchema<Company>;
