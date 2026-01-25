/**
 * Index all Knowledge Base documents with embeddings
 *
 * Usage: npx tsx scripts/index-all-kb.ts
 *
 * This script indexes all KnowledgeDoc entries in the database,
 * creating chunks with OpenAI embeddings for semantic search.
 */

import 'dotenv/config';
import { indexDbDocs, askKB } from '../src/services/kb.js';
import { prisma } from '../src/db/prisma.js';

async function main() {
  console.log('Knowledge Base Indexing Script');
  console.log('==============================\n');

  // Check if OPENAI_API_KEY is set
  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY environment variable is not set');
    process.exit(1);
  }

  // Count existing documents
  const docCount = await prisma.knowledgeDoc.count();
  console.log(`Found ${docCount} KB documents in database`);

  if (docCount === 0) {
    console.log('\nNo documents to index. Run "npm run db:seed" first to populate KB articles.');
    process.exit(0);
  }

  // List documents
  const docs = await prisma.knowledgeDoc.findMany({
    select: { id: true, title: true, slug: true, language: true }
  });
  console.log('\nDocuments to index:');
  docs.forEach(doc => {
    console.log(`  - ${doc.title} (${doc.slug}) [${doc.language}]`);
  });

  // Check existing chunks
  const chunkCount = await prisma.knowledgeChunk.count();
  console.log(`\nExisting chunks: ${chunkCount}`);

  // Index all documents
  console.log('\nIndexing documents with OpenAI embeddings...\n');

  const startTime = Date.now();
  const result = await indexDbDocs();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\nIndexed ${result.indexed} documents in ${elapsed}s`);

  // Verify by counting chunks
  const newChunkCount = await prisma.knowledgeChunk.count();
  console.log(`Total chunks created: ${newChunkCount}`);

  // Test the KB with a sample query
  console.log('\n--- Testing KB Search ---\n');
  const testQueries = [
    'What coffee do you have?',
    'What are your store hours?',
    'Do you support any charities?'
  ];

  for (const query of testQueries) {
    console.log(`Q: "${query}"`);
    const result = await askKB(query, 'en', 2);
    if (result.sources.length > 0) {
      console.log(`  Top source: ${result.sources[0].title} (confidence: ${(result.sources[0].confidence * 100).toFixed(1)}%)`);
    } else {
      console.log('  No results found');
    }
    console.log('');
  }

  console.log('KB indexing complete!');
}

main()
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
