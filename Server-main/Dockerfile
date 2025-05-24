FROM node:22

ARG PORT
ENV PORT=$PORT

WORKDIR /service

COPY . .

RUN npm install

COPY src .

RUN npm run build

RUN find . -maxdepth 1 -mindepth 1 ! -name 'dist' -exec rm -rf {} +

CMD ["node", "dist/index.js"]


