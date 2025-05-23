FROM node:22.1.0

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm install

RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; else echo "Skipping prisma generate"; fi

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
