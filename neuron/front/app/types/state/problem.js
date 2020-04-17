// @flow
import type { Problem } from '../objects';

export type ProblemState = {
  loading: false,
  byId: {
    [problemId: number]: Problem,
  },
  current: ?Problem,
  done: boolean,
}
