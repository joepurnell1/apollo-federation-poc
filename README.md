# Apollo Federation mess around

Repo for trying out [apollo federation](https://www.apollographql.com/docs/federation/). Currently this repo has three hard coded subgraphs all supporting a movie service.

It currently uses rover cli to manage and generate the super schema.

## Prerequisits
```bash
yarn
```

## Running
To get started, first run the three subgraphs:
```bash
yarn start:movies
yarn start:actors
yarn start:reviews
```

Generate a new super schema:
```bash
yarn compose:super-schema
```

Start the gateway:
```bash
yarn start:gateway
```

