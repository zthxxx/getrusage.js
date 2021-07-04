import os from 'os'

const platformArch = `${process.platform}-${os.arch()}`

const binding = require(`../build/getrusage-${platformArch}`)


export type RUSAGE_SELF = number
export type RUSAGE_CHILDREN = number
export const RUSAGE_SELF: RUSAGE_SELF = binding.RUSAGE_SELF
export const RUSAGE_CHILDREN: RUSAGE_CHILDREN = binding.RUSAGE_CHILDREN

/**
 * Resource Usage data struct
 * https://www.gnu.org/software/libc/manual/html_node/Resource-Usage.html#index-struct-rusage
 */
export interface RUsage {
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
  idrss: number;
  ixrss: number;
  isrss: number;
  /** the number of page faults which were serviced without requiring any I/O */
  minflt: number;
  /** the number of page faults which were serviced by doing I/O (count) */
  majflt: number;
  nswap: number;
  inblock: number;
  oublock: number;
  /** number of IPC messages sent */
  msgsnd: number;
  /** number of IPC messages received */
  msgrcv: number;
  /** number of signals received */
  nsignals: number;
  /**
   * the number of times processes voluntarily invoked a context switch
   * (usually to wait for some service)
   */
  nvcsw: number;
  /**
   * the number of times an involuntary context switch took place (count)
   * because a time slice expired, or another process of higher priority was scheduled
   */
  nivcsw: number;
}

export const getrusage = (who?: RUSAGE_SELF | RUSAGE_CHILDREN): RUsage => {
  const fields = binding.getrusageArray(who)

  const usage: RUsage = {
    utime: Number(fields[0].toFixed(6)),
    stime: Number(fields[1].toFixed(6)),
    maxrss: fields[2],
    idrss: fields[3],
    ixrss: fields[4],
    isrss: fields[5],
    minflt: fields[6],
    majflt: fields[7],
    nswap: fields[8],
    inblock: fields[9],
    oublock: fields[10],
    msgsnd: fields[11],
    msgrcv: fields[12],
    nsignals: fields[13],
    nvcsw: fields[14],
    nivcsw: fields[15]
  }

  /**
   * due to macOS use BSD getrusage which unit is bytes,
   * while linux use GNU getrusage and the unit is kilobytes
   */
  if (process.platform === 'darwin') {
    usage.maxrss = Math.round(usage.maxrss / 1024)
  }

  return usage
}

