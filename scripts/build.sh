#!/usr/bin/env bash

# Usage: ./scripts/build.sh
# note: cwd is project root

set -euox pipefail

npm run clean

(cd getrusage && node-gyp rebuild)

platform_arch=$(node -e 'console.log(`${process.platform}-${os.arch()}`)')

mkdir -p build
mv -f getrusage/build/Release/getrusage.node build/getrusage-${platform_arch}.node

npm run clean:gyp

tsc
