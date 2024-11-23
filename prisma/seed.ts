import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert provinces and cities
  const provinces = [
    {
      name: 'Alberta',
      abbreviation: 'AB',
      cities: ['Calgary', 'Edmonton', 'Red Deer'],
    },
    {
      name: 'British Columbia',
      abbreviation: 'BC',
      cities: ['Vancouver', 'Victoria', 'Kelowna'],
    },
    {
      name: 'Ontario',
      abbreviation: 'ON',
      cities: ['Toronto', 'Ottawa', 'Mississauga'],
    },
    {
      name: 'Quebec',
      abbreviation: 'QC',
      cities: ['Montreal', 'Quebec City', 'Laval'],
    },
    // Add more provinces and cities as needed
  ];

  for (const province of provinces) {
    const createdProvince = await prisma.province.create({
      data: {
        name: province.name,
        abbreviation: province.abbreviation,
        cities: {
          create: province.cities.map((city) => ({ name: city })),
        },
      },
    });
    console.log(`Inserted province: ${createdProvince.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
