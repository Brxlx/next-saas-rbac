import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const passwordHash = await hash('123456', 1);

  const [user1, user2, user3] = await prisma.user.createManyAndReturn({
    data: [
      {
        name: 'John Doe',
        email: 'john@email.com',
        avatarUrl: 'https://github.com/Brxlx.png',
        passwordHash,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash,
      },
    ],
  });

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      owner: { connect: { id: user1.id } },
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user1.id,
              role: 'ADMIN',
            },
            {
              userId: user2.id,
              role: 'MEMBER',
            },
            {
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  });

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      owner: { connect: { id: user1.id } },
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user1.id,
              role: 'MEMBER',
            },
            {
              userId: user2.id,
              role: 'ADMIN',
            },
            {
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  });

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      owner: { connect: { id: user1.id } },
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user1.id,
              role: 'BILLING',
            },
            {
              userId: user2.id,
              role: 'ADMIN',
            },
            {
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  });
}

seed().then(() => {
  console.log('Database seeded!');
});
