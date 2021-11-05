import {
  createContract,
  ContractDefinition,
  Context,
  ContractQueryRequest,
  BaseContract
} from '@stakeordie/griptape.js';

interface SampleContract extends BaseContract {
  getTokens(): Promise<{ token_list: { tokens: string[] }}>;
}

const sampleDef: ContractDefinition = {
  queries:{
    getTokens({ address: owner, permit }: Context): ContractQueryRequest {
      const query = { tokens: { owner } };
      return { with_permit: { query, permit } };
    },
  }
};

export const sample = createContract<SampleContract>({
  id: 'sample',
  at: 'secret1lev289955yj8qh0fz5fqf4gt33j7vg5x0hhe4x',
  definition: sampleDef
});
