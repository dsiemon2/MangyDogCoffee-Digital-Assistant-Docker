import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateGreeting() {
  const newGreeting = "Thank you for calling Mangy Dog Coffee. Coffee with a bite! 10% of sales goes to AKT Foundation. I can help you with many things. Would you like to know more or you can tell me how I can help you today.";

  let config = await prisma.businessConfig.findFirst();

  if (config) {
    await prisma.businessConfig.update({
      where: { id: config.id },
      data: { greeting: newGreeting }
    });
    console.log('Greeting updated successfully!');
  } else {
    await prisma.businessConfig.create({
      data: { greeting: newGreeting }
    });
    console.log('Business config created with new greeting!');
  }

  console.log('New greeting:', newGreeting);
}

updateGreeting()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
