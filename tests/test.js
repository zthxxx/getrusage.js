const fs = require('fs')
const path = require('path')
const util = require('util')
const assert = require('assert')

const core = require('@actions/core')
const promiseSpawn = require('@npmcli/promise-spawn')
const {
  getrusage,
  RUSAGE_SELF,
  RUSAGE_CHILDREN,
} = require('../lib')

const inspect = (obj) => util.inspect(obj, { colors: true, compact: false })

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

core.startGroup(`RUSAGE flags`)
core.info(`RUSAGE_SELF: ${RUSAGE_SELF}`)
core.info(`RUSAGE_CHILDREN: ${RUSAGE_CHILDREN}`)
core.endGroup()



const stdioConfig = {
  stdioString: true,
  stdio: 'inherit',
}

const selfInitUsage = getrusage()

const pipeline = [
  () => {
    core.startGroup(`[getrusage] - self initial`)
    core.info(`selfInitUsage ${inspect(selfInitUsage)}`)
    core.endGroup()

    assertStruct(selfInitUsage)
    assert.ok(selfInitUsage.utime + selfInitUsage.stime > 0)
    assert.ok(selfInitUsage.maxrss > 0)
  },

  () => {
    const nonChildUsage = getrusage(RUSAGE_CHILDREN)

    core.startGroup(`[getrusage] - child none`)
    core.info(`nonChildUsage ${inspect(nonChildUsage)}`)
    core.endGroup()

    assertStruct(nonChildUsage)
    assert.equal(nonChildUsage.utime, 0)
    assert.equal(nonChildUsage.stime, 0)
    assert.equal(nonChildUsage.maxrss, 0)
  },

  () => promiseSpawn(
    'npm',
    ['run'],
    stdioConfig,
  ),
  
  () => promiseSpawn(
    'du',
    ['-sh', 'node_modules'],
    stdioConfig,
  ),

  () => {
    const childUsage = getrusage(RUSAGE_CHILDREN)

    core.startGroup(`[getrusage] - child done`)
    core.info(`childUsage ${inspect(childUsage)}`)
    core.endGroup()

    assertStruct(childUsage)
    assert.ok(childUsage.utime > 0)
    assert.ok(childUsage.stime > 0)
    assert.ok(childUsage.maxrss > 0)
  },

  () => {
    /**
     * allocate 50M heap
     * each element size of BigInt64Array is 8 bytes
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array
     */
    const data = new BigInt64Array(50 * 1024 * 1024 / 8).fill(128n)

    if (!fs.existsSync('temp')) {
      fs.mkdirSync('temp')
    }
    fs.writeFileSync(path.join('temp', 'data.log'), data, { flag: 'w' })
  },

  () => {
    const selfUsage = getrusage()

    core.startGroup(`[getrusage] - self allocate 50M`)
    core.info(`selfUsage ${inspect(selfUsage)}`)
    core.endGroup()

    assertStruct(selfUsage)
    assert.ok(selfUsage.utime > 0)
    assert.ok(selfUsage.stime > 0)
    assert.ok(selfUsage.maxrss - selfInitUsage.maxrss > 50 * 1024)
  },

  () => {
    let piece = 2500
    while (piece > 0) {
      const now = performance.now()
      while (performance.now() - now < 1) {}
      piece -= 1
    }
  },

  () => {
    const selfUsage = getrusage(RUSAGE_SELF)

    core.startGroup(`[getrusage] - self: loop time`)
    core.info(`selfUsage ${inspect(selfUsage)}`)
    core.endGroup()

    assertStruct(selfUsage)
    assert.ok(selfUsage.utime > 2)
    assert.ok(selfUsage.stime > 0)
    assert.ok(selfUsage.maxrss > 0)
  },
]

const runTest = async () => {
  for(const step of pipeline) {
    await step()
  }
}

runTest()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
