import { Database } from '../store';
import { faker } from '@faker-js/faker';
import { uid } from 'quasar';
import { Company } from 'src/models/Company';
import { Job } from 'src/models/Job';
import { Person } from 'src/models/Person';

const _date = new Date();
const avatars = {
  men: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
    79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
  ],
  women: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
    79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
  ],
  lego: [1, 2, 3, 4, 5, 6, 7, 8],
};

export function comb({ date }: { date?: Date } = {}) {
  if (!date) {
    _date.setTime(_date.getTime() + 1);
    date = _date;
  }
  const uuid = uid();
  let comb = ('00000000000' + date.getTime().toString(16)).substr(-12);
  comb = comb.slice(0, 8) + '-' + comb.slice(8, 12);
  return uuid.replace(uuid.slice(0, 13), comb);
}

export async function seed(db: Database) {
  const companyDocs = await db.company.find({ limit: 1 }).exec();
  if (!companyDocs?.length) {
    const companies: Company[] = [];
    for (let i = 0; i < 50; i++) {
      let name = faker.company.companyName();
      while (companies.some((j) => j.name === name)) {
        name = faker.company.companyName();
      }
      companies.push({
        companyId: comb(),
        name: name,
      });
    }
    await db.company.bulkInsert(companies);
  }

  const jobDocs = await db.job.find({ limit: 1 }).exec();
  if (!jobDocs?.length) {
    const jobs: Job[] = [];
    for (let i = 0; i < 50; i++) {
      let name = faker.name.jobTitle();
      while (jobs.some((j) => j.name === name)) {
        name = faker.name.jobTitle();
      }
      jobs.push({
        jobId: comb(),
        name: name,
      });
    }
    await db.job.bulkInsert(jobs);
  }

  const peopleDocs = await db.person.find({ limit: 1 }).exec();
  if (!peopleDocs?.length) {
    const jobs: Job[] = await db.job.find().exec();
    const companies: Company[] = await db.company.find().exec();

    const people: Person[] = [];
    for (let i = 0; i < 800; i++) {
      const companyIndex = Math.floor(
        Math.random() * Math.floor(companies.length)
      );
      const jobIndex = Math.floor(Math.random() * Math.floor(jobs.length));
      const company = companies[companyIndex];
      const job = jobs[jobIndex];

      const gender: 'male' | 'female' = faker.helpers.arrayElement([
        'male',
        'female',
      ]);

      let firstName = faker.name.firstName(gender);
      let lastName = faker.name.lastName(gender);
      while (
        people.some((j) => j.firstName === firstName && j.lastName === lastName)
      ) {
        firstName = faker.name.firstName(gender);
        lastName = faker.name.lastName(gender);
      }
      const section = gender === 'male' ? 'men' : 'women';
      const index = faker.helpers.arrayElement(avatars[section]);
      const avatar = `https://randomuser.me/api/portraits/${section}/${index}.jpg`;
      const email = faker.internet.email(firstName, lastName).toLowerCase();

      people.push({
        personId: comb(),
        avatar: avatar,
        firstName: firstName,
        lastName: lastName,
        email: email,
        company: company.companyId,
        job: job.jobId,
      });
    }
    await db.person.bulkInsert(people);
  }
}
