#!/bin/sh
set -e

echo "Waiting MySQL ($DB_HOST:3306)..."

while ! nc -z $DB_HOST 3306; do
  sleep 1
done

echo "MySQL is ready!"

exec "$@"
