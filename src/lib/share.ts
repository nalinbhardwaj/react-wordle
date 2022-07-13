import { getGuessStatuses } from './statuses'
import { solutionIndex, unicodeSplit } from './words'
import { GAME_TITLE } from '../constants/strings'
import { MAX_CHALLENGES } from '../constants/settings'
import { UAParser } from 'ua-parser-js'
import { wrap } from 'comlink'
import { postToIpfs } from './ipfs'

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

export const shareStatus = (
  solution: string,
  guesses: string[],
  lost: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  handleShareToClipboard: () => void
) => {
  const textToShare =
    `${GAME_TITLE} ${solutionIndex} ${
      lost ? 'X' : guesses.length
    }/${MAX_CHALLENGES}${isHardMode ? '*' : ''}\n\n` +
    generateEmojiGrid(
      solution,
      guesses,
      getEmojiTiles(isDarkMode, isHighContrastMode)
    )

  const hash = generateProof(solution, guesses, lost)

  return hash
}

export const shareText = (txt: string) => {
  let shareSuccess = false
  const shareData = { text: txt }
  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData)
      shareSuccess = true
    }
  } catch (error) {
    shareSuccess = false
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(txt)
  }

  console.log('shareSuccess', shareSuccess)
  return shareSuccess
}

export const generateProof = async (
  solution: string,
  guesses: string[],
  lost: boolean
) => {
  solution = solution.toLowerCase()
  guesses = guesses.map((guess) => guess.toLowerCase())
  while (guesses.length < 6) {
    guesses.push(solution)
  }
  console.log(`solution: ${solution}`)
  console.log(`guesses: ${guesses}`)

  if (lost) {
    return undefined
  }

  const worker = new Worker(new URL('./halo-worker', import.meta.url), {
    name: 'halo-worker',
    type: 'module',
  })
  const workerApi = wrap<import('./halo-worker').HaloWorker>(worker)

  const diffs = await workerApi.get_play_diff(solution, guesses)
  console.log('diffs', diffs)

  const proof = await workerApi.prove_play(solution, guesses)
  console.log('proof', proof)

  const storor = {
    solutionIndex,
    proof,
    diffs,
  }
  const ipfsHash = await postToIpfs(JSON.stringify(storor))
  console.log('ipfsHash', ipfsHash)
  return ipfsHash
}

export const verifyProof = async (
  solution: string,
  diffs: number[][][],
  proof: number[]
) => {
  solution = solution.toLowerCase()
  const worker = new Worker(new URL('./halo-worker', import.meta.url), {
    name: 'halo-worker-verify',
    type: 'module',
  })
  const workerApi = wrap<import('./halo-worker').HaloWorker>(worker)

  console.log('solution', solution)
  console.log('diffs', diffs)
  console.log('proof', proof)

  const verify = await workerApi.verify_play(solution, proof, diffs)
  return verify
}

export const generateEmojiGrid = (
  solution: string,
  guesses: string[],
  tiles: string[]
) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(solution, guess)
      const splitGuess = unicodeSplit(guess)

      return splitGuess
        .map((_, i) => {
          switch (status[i]) {
            case 'correct':
              return tiles[0]
            case 'present':
              return tiles[1]
            default:
              return tiles[2]
          }
        })
        .join('')
    })
    .join('\n')
}

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  )
}

const getEmojiTiles = (isDarkMode: boolean, isHighContrastMode: boolean) => {
  let tiles: string[] = []
  tiles.push(isHighContrastMode ? '🟧' : '🟩')
  tiles.push(isHighContrastMode ? '🟦' : '🟨')
  tiles.push(isDarkMode ? '⬛' : '⬜')
  return tiles
}
