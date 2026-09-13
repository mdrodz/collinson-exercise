#!/bin/sh

set -e

corepack enable
yarn install

exec "$@"
