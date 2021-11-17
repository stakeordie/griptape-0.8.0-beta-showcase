import {
  snip20Def,
  Snip20Contract,
  createContract,
  extendContract
} from '@stakeordie/griptape.js';

interface StkdContract extends Snip20Contract {
  getStakingInfo(): Promise<Record<string, unknown>>;
}

const stkdAddr = 'secret18cgnku4dcd8scn56t3ru63ludh3lm0svemul8v';

const stkdDef = {
  queries: {
    getStakingInfo() {
      const time = Math.round(new Date().getTime() / 1000);
      return { staking_info: { time } };
    }
  }
};

const definition = extendContract(snip20Def, stkdDef);

export const stkd = createContract<StkdContract>({
  id: 'stkd',
  at: stkdAddr,
  definition
});
