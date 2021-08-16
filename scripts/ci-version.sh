#!/usr/bin/env bash

# bash strict mode 
# https://gist.github.com/mohanpedala/1e2ff5661761d3abd0385e8223e16425
set -euox pipefail

# due to `actions/download-artifact` always create directories when download all
# https://github.com/actions/download-artifact#download-all-artifacts
cp -f .artifacts/**/*.node build

git status

pnpm changeset version
