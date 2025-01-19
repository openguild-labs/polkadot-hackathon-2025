# Hakifi Backend

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```


## Commands

#### Seed database

```bash
  yarn seed
```

#### Update pair's precission from Binance
```bash
  yarn ts-node prisma/seed/seedPrecission.ts
```

#### Close Binance Order

```bash
  yarn command binance:close_order --insuranceId=...
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `insuranceId`  | `string` | **Required**. Insurance Id |


#### Sync user stats

```bash
  yarn command user:sync_user_stats
```

#### Sync user daily stats

```bash
  yarn command user:sync_user_daily_stats --userId=...
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `userId`  | `string` | **Required**. User Id |

#### Sync all user daily stats

```bash
  yarn command user:sync_user_daily_stats_all
```

#### Sync P&L of all Insurances

```bash
  yarn command insurance:sync_pnl
```


## Docker
```bash
SSH_PRIVATE_KEY="$(cat ~/.ssh/id_rsa)" docker compose up -d --build
```

## License

Nest is [MIT licensed](LICENSE).