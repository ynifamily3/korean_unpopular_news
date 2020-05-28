# Undertimes

## Usage

- Initialize database tables

  ```sh
  $ yarn typeorm schema:sync
  ```

- Running the development server

  ```sh
  $ yarn dev
  ```

- Build and running the production server

  ```sh
  $ yarn build && yarn start
  ```

## Using docker compose

- docker-compose.yml

  ```yml
  version: "3"

  services:
    db:
      image: mariadb
      restart: always
      environment:
        - MYSQL_ROOT_PASSWORD=[db password]
        - MYSQL_DATABASE=undertimes
      command:
        [
          "mysqld",
          "--character-set-server=utf8mb4",
          "--collation-server=utf8mb4_unicode_ci",
        ]
      volumes:
        - ./data:/var/lib/mysql

    app:
      build: .
      restart: always
      depends_on:
        - db
      env_file:
        - ./prod.env
      ports:
        - 127.0.0.1:9000:9000

    crawl:
      build: .
      restart: always
      entrypoint: ["crond", "-f"]
      depends_on:
        - db
      env_file:
        - ./prod.env
  ```

- prod.env

  ```ini
  TYPEORM_CONNECTION=mysql
  TYPEORM_HOST=db
  TYPEORM_USERNAME=root
  TYPEORM_PASSWORD=[db password]
  TYPEORM_DATABASE=undertimes
  TYPEORM_ENTITIES=src/database/entity/*.ts
  TYPEORM_SUBSCRIBERS=src/database/subscriber/*.ts
  TYPEORM_MIGRATIONS=src/database/migration/*.ts
  TYPEORM_ENTITIES_DIR=src/database/entity
  TYPEORM_MIGRATIONS_DIR=src/database/migration
  TYPEORM_SUBSCRIBERS_DIR=src/database/subscriber
  TYPEORM_DRIVER_EXTRA={"charset":"utf8mb4"}
  ```
