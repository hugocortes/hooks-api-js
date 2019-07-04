######################
# TypeScript copmile #
######################

FROM node:12-slim AS TypeScriptBuilder

RUN mkdir /app
WORKDIR /app

# install deps
COPY package.json .
COPY package-lock.json .
RUN npm install --silent

# copy api files
COPY lib/ lib
COPY index.ts .
COPY tsconfig.json .

RUN npm run tsc

#########################################
# Copy resulting build dir to new image #
#########################################

FROM node:12-slim

RUN mkdir -p /app/build
WORKDIR /app

# install prod deps
COPY package.json .
COPY package-lock.json .
RUN npm install --silent --production

COPY --from=TypeScriptBuilder /app/build /app/build
COPY .env.example .
COPY docker-entrypoint.sh .

USER 1000

ENTRYPOINT [ "bash", "docker-entrypoint.sh" ]
