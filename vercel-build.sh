#!/bin/bash

# Run migrations
npx prisma migrate deploy

# Build the Next.js app
npm run build

