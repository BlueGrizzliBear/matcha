#!/bin/sh
# wait-for-mysql.sh

set -e
  
host="$1"
shift

until mysql --host="$host" --user='root' --password='root'; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 30
done
  
>&2 echo "MySQL is up - executing command"
exec "$@"