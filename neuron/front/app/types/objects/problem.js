// @flow
import type { LicenseCategory } from 'types/objects/license';
import type { Explanation } from 'types/objects/explanation'
import type { Debate } from 'types/objects/debate'

export type Problem = {
  id: number,
  idx: number,
  category: LicenseCategory,
  description: string,
  choices: Array<ProblemChoice>,
  images: ?Array<ProblemImage>,
  correct: ?boolean,
  explanation: Array<Explanation>,
  debate: Array<Debate>,
};

export type ProblemChoice = {
  id: number,
  content: string,
};

export type ProblemImage = {
  url: string,
};
