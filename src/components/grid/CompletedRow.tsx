import { diffToStatus, getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'

type Props = {
  solution: string
  guess: string
  isRevealing?: boolean
}

export const CompletedRow = ({ solution, guess, isRevealing }: Props) => {
  const statuses = getGuessStatuses(solution, guess)
  const splitGuess = unicodeSplit(guess)

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={statuses[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  )
}

type VerifyProps = {
  solution: string
  diff: number[][]
  isRevealing?: boolean
}

export const CompletedVerifyRow = ({ diff, isRevealing }: VerifyProps) => {
  const statuses = diffToStatus(diff)
  const splitSolution = unicodeSplit('fluff')

  return (
    <div className="flex justify-center mb-1">
      {splitSolution.map((letter, i) => (
        <Cell
          key={i}
          value={''}
          status={statuses[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  )
}
