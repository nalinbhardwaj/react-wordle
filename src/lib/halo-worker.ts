import { expose } from 'comlink'

async function get_play_diff(solution: string, guesses: string[]) {
  console.log('diffing')
  const multiThread = await import('halowordle')
  await multiThread.default()
  await multiThread.initThreadPool(navigator.hardwareConcurrency)
  multiThread.init_panic_hook()
  const ret = multiThread.get_play_diff(solution, guesses)
  return ret
}

async function fetch_params() {
  const response = await fetch('https://zordle.xyz/params.bin')
  const bytes = await response.arrayBuffer()
  const params = new Uint8Array(bytes)
  return params
}

async function prove_play(solution: string, guesses: string[]) {
  const params = await fetch_params()
  console.log('param length', params.length)
  console.log('params', params)

  console.log('genning proof')
  const multiThread = await import('halowordle')
  await multiThread.default()
  await multiThread.initThreadPool(navigator.hardwareConcurrency)
  console.log('here we go')
  const ret = multiThread.prove_play(solution, guesses, params)
  return ret
}

async function verify_play(solution: string, proof: any, diffs_js: any) {
  const params = await fetch_params()
  console.log('param length', params.length)
  console.log('params', params)

  console.log('verifying proof')
  const multiThread = await import('halowordle')
  await multiThread.default()
  await multiThread.initThreadPool(navigator.hardwareConcurrency)
  console.log('here we go')
  const ret = multiThread.verify_play(solution, proof, diffs_js, params)
  return ret
}

const exports = {
  get_play_diff,
  prove_play,
  verify_play,
}
export type HaloWorker = typeof exports

expose(exports)
