import { RxJsonSchema } from 'rxdb';

export interface Person {
  personId: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  job: string;
  updatedAt: number;
  _deleted: boolean;
}

export const personSchema: RxJsonSchema<Person>;
