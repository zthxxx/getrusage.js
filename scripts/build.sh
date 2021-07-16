#!/usr/bin/env bash

# Usage: ./scripts/build.sh
# note: cwd is project root

arch=${1:-x64}

set -euox pipefail

npm run clean

# use node-gyp v7 to compatible with python2 in owr ci env
node-gyp -C getrusage rebuild --arch=${arch}

build_target="$(node -p process.platform)-${arch}"
target_bin="getrusage-${build_target}.node"

# GitHub Actions - setting an output parameter
# https://docs.github.com/en/actions/learn-github-actions/workflow-commands-for-github-actions#setting-an-output-parameter
echo "::set-output name=target_bin::${target_bin}"

mkdir -p build
mv -f getrusage/build/Release/getrusage.node "build/${target_bin}"

npm run clean:gyp

tsc
