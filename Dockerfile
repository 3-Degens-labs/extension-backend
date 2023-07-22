FROM node:18.10.0-alpine3.15 as development

WORKDIR /app

RUN apk update && \
    apk add --no-cache bash openssh-client git python3

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn build

FROM node:18.10.0-alpine3.15 as production

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk update && \
    apk add --no-cache bash openssh-client git python3

COPY package.json yarn.lock ./
RUN yarn install --prod

COPY --from=development /app/dist ./dist

CMD ["node", "./dist/main.js"]
