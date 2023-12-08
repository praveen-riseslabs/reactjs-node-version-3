import { faker } from "@faker-js/faker";

export const fakeFriends = Array.from({ length: 20 }).map((_, i) => {
  return {
    fullname: faker.person.fullName(),
    work: faker.person.jobTitle(),
    pic: "https://picsum.photos/200",
  };
});
