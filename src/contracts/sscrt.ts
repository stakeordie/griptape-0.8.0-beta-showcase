import {
  snip20Def,
  Snip20Contract,
  createContract,
} from '@stakeordie/griptape.js';

const sscrtAddr = 'secret1s7c6xp9wltthk5r6mmavql4xld5me3g37guhsx';
const sscrtCodeHash = 'cd400fb73f5c99edbc6aab22c2593332b8c9f2ea806bf9b42e3a523f3ad06f62';

export const sscrt = createContract<Snip20Contract>({
  id: 'sscrt',
  at: sscrtAddr,
  definition: snip20Def,
  codeHash: sscrtCodeHash
});
