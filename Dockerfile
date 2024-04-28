FROM node:22 AS angbuilder

WORKDIR /app

COPY client client
COPY common common

WORKDIR /app/client

RUN npm i -g @angular/cli
RUN npm ci && ng build

FROM node:22 AS nestbuilder

WORKDIR /app

COPY deckofcards deckofcards
COPY common common

WORKDIR /app/deckofcards

RUN npm i -g @nestjs/cli
RUN npm ci --force && nest build

FROM node:22 

WORKDIR /app

COPY deckofcards/package*.json .
RUN npm ci --force

COPY --from=nestbuilder /app/deckofcards/dist dist
COPY --from=angbuilder /app/client/dist/client/browser/* /app/static
COPY --from=angbuilder /app/client/dist/client/browser/assets /app/static/assets
COPY deckofcards/static static
COPY assets /app/assets

ENV PORT=3000 MONGODB_URI="mongodb://localhost:27017/deckofcards"
ENV DECKS_DIR="--decksDir /app/assets --drop" STATIC_DIR="--staticDir /app/static"

EXPOSE ${PORT}

ENTRYPOINT node dist/deckofcards/src/main ${STATIC_DIR} ${DECKS_DIR}
