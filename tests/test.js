const assert = require('assert')
const promiseSpawn = require('@npmcli/promise-spawn')
const {
  getrusage,
  RUSAGE_CHILDREN,
} = require('../lib')


const selfUsage = getrusage()
const nonChildUsage = getrusage(RUSAGE_CHILDREN)

console.log('getrusage self', selfUsage)
console.log('getrusage non-child', nonChildUsage)

assert(
  selfUsage.utime > 0
  && selfUsage.stime > 0
  && selfUsage.maxrss > 0
)

assert(
  nonChildUsage.utime === 0
  && nonChildUsage.stime === 0
  && nonChildUsage.maxrss === 0
)

promiseSpawn(
  'echo',
  ['ok'],
  {
    stdioString: true,
    stdio: 'inherit',
  },
).then(() => {
  const childUsage = getrusage(RUSAGE_CHILDREN)
  console.log('getrusage child', childUsage)
  assert(
    childUsage.utime > 0
    && childUsage.stime > 0
    && childUsage.maxrss > 0
  )
})
