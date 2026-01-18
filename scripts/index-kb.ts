import { indexDbDocs } from '../src/services/kb.js';

async function main() {
  console.log('Indexing all Knowledge Base documents...');
  console.log('This will generate embeddings using OpenAI. This may take a few minutes.\n');

  const result = await indexDbDocs();

  console.log(`\nIndexing complete! ${result.indexed} documents indexed.`);
}

main()
  .catch(console.error);
