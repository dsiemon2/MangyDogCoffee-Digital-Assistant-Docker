import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listKb() {
  const docs = await prisma.knowledgeDoc.findMany({
    select: { title: true },
    orderBy: { title: 'asc' }
  });

  console.log(`\nKnowledge Base Documents: ${docs.length} total\n`);
  docs.forEach(doc => console.log('-', doc.title));
}

listKb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
