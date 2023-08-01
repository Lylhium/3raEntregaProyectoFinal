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
