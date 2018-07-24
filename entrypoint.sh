#!/bin/sh

set -e

echo "var runtimeGlobalConfig = {
  ENTERPRISE: '$ENTERPRISE',
  IRENE_API_HOST: '$IRENE_API_HOST',
  IRENE_API_SOCKET_PATH: '$IRENE_API_SOCKET_PATH',
  IRENE_DEVICEFARM_URL: '$IRENE_DEVICEFARM_URL',
  WHITELABEL_ENABLED: '$WHITELABEL_ENABLED',
  WHITELABEL_NAME: '$WHITELABEL_NAME',
  WHITELABEL_LOGO: '$WHITELABEL_LOGO',
  WHITELABEL_THEME: '$WHITELABEL_THEME'
}" > dist/runtimeconfig.js

cp -r dist/* /usr/share/nginx/html/

if [ -z "$1" ] || [ "$1" = "server" ]; then
  echo "Starting nginx..."
  nginx -g 'daemon off;'
fi

exec "$@"
