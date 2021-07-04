# getrusage.js

system function [`getrusage()`](https://www.gnu.org/software/libc/manual/html_node/Resource-Usage.html) binding to return process resource usage

precompiled (and only support) for `drawin-x64` / `linux-x64` (via `${process.platform}-${os.arch()}`)

## Install

```bash
npm i getrusage.js
```

## Usage

```ts
import {
  getrusage,
  RUSAGE_SELF,
  RUSAGE_CHILDREN,
} from 'getrusage.js'
import type { RUsage } from 'getrusage.js'

const usage: RUsage = getrusage()
// `getrusage()` is equivalent to `getrusage(RUSAGE_SELF)`
// `getrusage(RUSAGE_CHILDREN)` means usage of "All child processes (direct and indirect) that have already terminated"

console.log(usage)
// => {
//   utime: 0.513607,
//   stime: 0.011146,
//   maxrss: 65421,
//   idrss: 0,
//   ixrss: 0,
//   isrss: 0,
//   minflt: 9753,
//   majflt: 12,
//   nswap: 0,
//   inblock: 0,
//   oublock: 0,
//   msgsnd: 0,
//   msgrcv: 0,
//   nsignals: 0,
//   nvcsw: 1347,
//   nivcsw: 10
// }
```

## Credit

- thanks [andrasq/node-qrusage](https://github.com/andrasq/node-qrusage)
