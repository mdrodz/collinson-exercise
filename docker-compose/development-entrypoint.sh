#!/bin/sh

set -e

corepack enable
yarn install

exec yarn run start:dev
