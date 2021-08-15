# getrusage.js

POSIX system function [`getrusage()`](https://www.gnu.org/software/libc/manual/html_node/Resource-Usage.html) usually used to examine the resource usage of a process.

[`getrusage.js`](https://www.npmjs.com/package/getrusage.js) is a binding to Node.js via [Node-API](https://nodejs.org/api/n-api.html), and make pre-build binaries for distribution, **0 other dependencies!**

You don't need to compile (`node-gyp`) or download (`node-pre-gyp`) anything by postinstall.

## Support platforms

|                        | node12 | node14 | node16 |
| ---------------------  | ------ | ------ | ------ |
| Linux x64              | ✓      | ✓      | ✓      |
| Linux arm64            | ✓      | ✓      | ✓      |
| Linux arm32            | ✓      | ✓      | ✓      |
| macOS x64              | ✓      | ✓      | ✓      |
| macOS arm64 (M1 chips) | ✓      | ✓      | ✓      |

> Windows? not support yet, due to `getrusage()` is POSIX only.

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

/**
 * `getrusage()` is equivalent to `getrusage(RUSAGE_SELF)`
 * `getrusage(RUSAGE_CHILDREN)` means usage of "All child processes (direct and indirect) that have already terminated"
 */
const usage: RUsage = getrusage()

console.log(usage)

// {
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

interface of `RUsage` and explain fields see:

```ts
/**
 * Resource Usage data struct
 * https://www.gnu.org/software/libc/manual/html_node/Resource-Usage.html#index-struct-rusage
 */
interface RUsage {
  /**
   * time spent in executing user instructions (seconds)
   * sum of tv_sec and tv_usec (unit: seconds)
   */
  utime: number;

  /**
   * time spent in operating system code on behalf of processes (seconds)
   * sum of tv_sec and tv_usec (unit: seconds)
   */
  stime: number;

  /**
   * the maximum of physical memory that processes used simultaneously (kilobytes)
   * always normalized unit in kilobytes on macOS
   */
  maxrss: number;

  /** deprecated fields in gnu: idrss / ixrss / isrss */
  idrss: number;
  ixrss: number;
  isrss: number;

  /** the number of page faults which were serviced without requiring any I/O (count) */
  minflt: number;

  /** the number of page faults which were serviced by doing I/O (count) */
  majflt: number;

  nswap: number;
  inblock: number;
  oublock: number;

  /** number of IPC messages sent (count) */
  msgsnd: number;

  /** number of IPC messages received (count) */
  msgrcv: number;

  /** number of signals received (count) */
  nsignals: number;

  /**
   * the number of times processes voluntarily invoked a context switch (count) 
   * (usually to wait for some service)
   */
  nvcsw: number;

  /**
   * the number of times an involuntary context switch took place (count)
   * because a time slice expired, or another process of higher priority was scheduled
   */
  nivcsw: number;
}
```

## License

MIT
