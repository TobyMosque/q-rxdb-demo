import { RxJsonSchema } from 'rxdb';

export interface Job {
  jobId: string;
  name: string;
  updatedAt: number;
  _deleted: boolean;
}

export const jobSchema: RxJsonSchema<Job>;
