FROM node:24-alpine AS base

WORKDIR /usr/src/daybound

COPY ./ ./

RUN corepack enable && \
    yarn install

FROM base AS development

CMD ["yarn", "run", "start:dev"]

FROM base AS production

RUN yarn run build

CMD ["yarn", "run", "start:prod"]
