FROM node:12

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "ts-node", "./examples/qmit/index.ts" ]
