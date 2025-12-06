#!/bin/sh
set -e

DB_MAIN="${DB_NAME:-miforge}"
DB_SHADOW="${DB_MAIN}_shadow"

echo ">> Creating databases '${DB_MAIN}' and '${DB_SHADOW}' and user '${MARIADB_USER}'..."

mariadb -uroot -p"${MARIADB_ROOT_PASSWORD}" <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_MAIN}\`   DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS \`${DB_SHADOW}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '${MARIADB_USER}'@'%' IDENTIFIED BY '${MARIADB_PASSWORD}';
-- garante/atualiza a senha caso o user já exista
ALTER USER '${MARIADB_USER}'@'%' IDENTIFIED BY '${MARIADB_PASSWORD}';

GRANT ALL PRIVILEGES ON \`${DB_MAIN}\`.*   TO '${MARIADB_USER}'@'%';
GRANT ALL PRIVILEGES ON \`${DB_SHADOW}\`.* TO '${MARIADB_USER}'@'%';
FLUSH PRIVILEGES;
SQL

echo ">> Done."