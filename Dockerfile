FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY app/web/package.json ./app/web/
COPY packages/domain/package.json ./packages/domain/

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace=app/web"]