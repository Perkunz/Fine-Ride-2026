const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  console.log('Seeding users...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  const rider = await prisma.user.upsert({
    where: { email: 'rider@example.com' },
    update: {},
    create: {
      email: 'rider@example.com',
      password,
      name: 'Rider One',
      role: 'USER'
    }
  });

  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@example.com' },
    update: {},
    create: {
      email: 'driver@example.com',
      password,
      name: 'Driver One',
      role: 'DRIVER'
    }
  });

  const driver = await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {},
    create: {
      userId: driverUser.id,
      license: 'DRIVER-LICENSE-001',
      status: 'ACTIVE'
    }
  });

  await prisma.vehicle.upsert({
    where: { driverId: driver.id },
    update: {},
    create: {
      driverId: driver.id,
      make: 'Toyota',
      model: 'Prius',
      plate: 'RIDE-001'
    }
  });

  console.log('Seeding example ride...');
  await prisma.ride.create({
    data: {
      riderId: rider.id,
      pickupLat: 37.7749,
      pickupLng: -122.4194,
      dropoffLat: 37.7849,
      dropoffLng: -122.4094,
      status: 'REQUESTED'
    }
  });

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
