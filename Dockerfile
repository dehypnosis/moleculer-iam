FROM node:12

WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PATH="${PATH}:./node_modules/.bin"

COPY package.json yarn.lock ./
COPY pkg ./pkg
RUN NODE_ENV=development yarn
RUN yarn workspace moleculer-iam build
RUN yarn workspace moleculer-iam-app-renderer build-server
RUN yarn workspace moleculer-iam-app-renderer build

CMD [ "node", "pkg/moleculer-iam/dist/examples/qmit/"]
