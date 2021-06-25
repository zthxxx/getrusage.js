const assert = require('assert')
const promiseSpawn = require('@npmcli/promise-spawn')
const {
  getrusage,
  RUSAGE_SELF,
  RUSAGE_CHILDREN,
} = require('../lib')


const assertStruct = (usage) => {
  const keys = new Set([
    'utime',
    'stime',
    'maxrss',
    'idrss',
    'ixrss',
    'isrss',
    'minflt',
    'majflt',
    'nswap',
    'inblock',
    'oublock',
    'msgsnd',
    'msgrcv',
    'nsignals',
    'nvcsw',
    'nivcsw',
  ])

  assert(
    Object.keys(usage)
      .filter((key) => !keys.has(key))
      .length === 0,
  )

  assert(
    Object.values(usage)
      .every((value) => (typeof value === 'number' && isFinite(value)))
  )
}

console.info('RUSAGE_SELF:', RUSAGE_SELF)
console.info('RUSAGE_CHILDREN:', RUSAGE_CHILDREN)

const selfUsage = getrusage()
console.info('getrusage self step.0', selfUsage)
assertStruct(selfUsage)
assert(
  selfUsage.utime > 0
  && selfUsage.stime > 0
  && selfUsage.maxrss > 0,
)

const nonChildUsage = getrusage(RUSAGE_CHILDREN)
console.info('getrusage non-child', nonChildUsage)
assertStruct(nonChildUsage)
assert(
  nonChildUsage.utime === 0
  && nonChildUsage.stime === 0
  && nonChildUsage.maxrss === 0,
)

promiseSpawn(
  'npm',
  ['run'],
  {
    stdioString: true,
    stdio: 'inherit',
  },
)
  .then(() => {
    const childUsage = getrusage(RUSAGE_CHILDREN)
    console.info('getrusage child', childUsage)

    assertStruct(childUsage)
    assert(
      childUsage.utime + childUsage.stime > 0
      && childUsage.maxrss > 0,
    )
  })
  .then(() => {
    const selfUsage = getrusage(RUSAGE_SELF)
    console.info('getrusage self step.1', selfUsage)
    assertStruct(selfUsage)
    assert(
      selfUsage.utime > 0
      && selfUsage.stime > 0
      && selfUsage.maxrss > 0,
    )
  })
  .then(() => {
    const now = Date.now()
    while (true) {
      if (Date.now() - now > 1000) {
        break
      }
    }
  })
  .then(() => {
    const selfUsage = getrusage(RUSAGE_SELF)
    console.info('getrusage self step.2', selfUsage)
    assertStruct(selfUsage)
    assert(
      selfUsage.utime > 1
      && selfUsage.stime > 0
      && selfUsage.maxrss > 0,
    )
  })
