# Common build stage
FROM node:18.16.0-alpine

COPY . ./app

WORKDIR /app

RUN npm install

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "run", "start"]
