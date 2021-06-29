#!/usr/bin/env bash

# Usage: ./scripts/build.sh
# note: cwd is project root

set -euox pipefail

npm run clean

# use node-gyp v7 to compatible with python2 in owr ci env
node-gyp -C getrusage rebuild

platform_arch=$(node -p '`${process.platform}-${os.arch()}`')

mkdir -p build
mv -f getrusage/build/Release/getrusage.node build/getrusage-${platform_arch}.node

npm run clean:gyp

tsc
