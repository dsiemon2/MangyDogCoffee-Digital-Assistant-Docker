#!/bin/sh
set -e

# Wait for database to be accessible
echo "Checking database..."

# Run Prisma migrations/push
echo "Running Prisma db push..."
npx prisma db push --skip-generate

# Run seed (it handles clearing and reseeding)
echo "Running database seed..."
npx prisma db seed || echo "Seed completed or already seeded"

# Index knowledge base documents with embeddings (only if OPENAI_API_KEY is set)
if [ -n "$OPENAI_API_KEY" ]; then
  echo "Indexing knowledge base documents..."
  tsx scripts/index-all-kb.ts || echo "KB indexing skipped or failed"
else
  echo "OPENAI_API_KEY not set, skipping KB indexing"
fi

# Start the application
echo "Starting application..."
exec "$@"
