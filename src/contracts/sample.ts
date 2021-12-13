import {
  createContract,
  snip20Def,
  Snip20Contract,
  Snip721Contract,
  snip721Def,
  extendContract,
  Context
} from '@stakeordie/griptape.js';

const sampleDef = {
  queries: {
    getNftDossier({ permit }: Context, token_id: string, include_expired: boolean) {
      const query = { nft_dossier: { token_id, include_expired } };
      return { with_permit: { query, permit } };
    }
  }
};

const def = extendContract(snip721Def, sampleDef);

export const sample = createContract<Snip721Contract>({
  id: 'sample',
  at: 'secret1ddjxsu53yq756gsnu89a6p5537qkysux7r0m54',
  definition: def
});

const sscrtAddr = 'secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg';

export const sscrt = createContract<Snip20Contract>({
  id: 'sscrt',
  at: sscrtAddr,
  definition: snip20Def
});
