import { fakerES as faker } from "@faker-js/faker";

export const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    Title: faker.commerce.product(),
    Description: faker.commerce.productDescription(),
    Price: faker.commerce.price(),
    Thumbnail: faker.image.abstract(),
  };
};

export const generateNewUser = () => {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.random.number({ min: 18, max: 99 }),
  };
};
