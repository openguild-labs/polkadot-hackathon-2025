###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As development

RUN apk add --no-cache python3 make g++ git openssh
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

WORKDIR /usr/src/app

# add credentials on build
ARG SSH_PRIVATE_KEY
RUN mkdir /root/.ssh/
RUN --mount=type=secret,id=root_key \
  cat /run/secrets/root_key > /root/.ssh/id_rsa
# RUN echo "${SSH_PUBLIC_KEY}" > /root/.ssh/id_rsa.pub
RUN chmod -R 400 /root/.ssh

# make sure your domain is accepted
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY prisma ./prisma/ 

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --force; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else yarn install; \
  fi

COPY --chown=node:node . .
RUN rm /root/.ssh/id_rsa

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine As build

RUN apk add --no-cache openssh
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn prisma:generate
RUN yarn build

ENV NODE_ENV production

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine As production

WORKDIR /usr/src/app
ENV CLI_PATH ./dist/src/cli.js

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json

CMD [ "node", "dist/src/main.js" ]
