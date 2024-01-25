# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.18.0
ARG PNPM_VERSION=8.9.2

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

RUN npm install -g pnpm@${PNPM_VERSION}

FROM base as deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

FROM deps as build

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM base as final

ENV NODE_ENV production

USER node

COPY package.json .

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD pnpm start:prod
