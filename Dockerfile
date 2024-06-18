FROM node:18.20-alpine

ENV NODE_ENV development

# https://github.com/vercel/turbo/issues/2198
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# add turborepo
RUN npm install -g turbo

# Set working directory
WORKDIR /app

# Install app dependencies
COPY  ["package-lock.json", "package.json", "./"] 

# Install app dependencies
RUN npm install

# Copy source files
COPY . .

EXPOSE 5173 8787

CMD ["npm","run", "dev"]