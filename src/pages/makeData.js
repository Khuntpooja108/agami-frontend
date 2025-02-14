import { faker } from '@faker-js/faker'



const range = (len) => Array.from({ length: len }, (_, i) => i);

const newEmployee = () => {
  return {
    eid: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    dept: faker.helpers.arrayElement(['HR', 'Engineering', 'Marketing', 'Finance', 'Sales']),
  };
};

export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map(() => ({
      ...newEmployee(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}




/* export type Person = {
  firstName: string
  lastName: string
  age
  visits
  progress
  status: 'relationship' | 'complicated' | 'single'
  subRows?[]
} *//* 

const range = (len) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle
  }
}

export function makeData(...lens) {
  const makeDataLevel = (depth = 0)=> {
    const len = lens[depth]
    return range(len).map((d) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
 */