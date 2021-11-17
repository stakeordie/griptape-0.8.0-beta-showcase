import {
  BaseContract,
  ContractDefinition,
  ContractQueryRequest,
  createContract
} from '@stakeordie/griptape.js';

interface TokensListResponse {
  token_list: { tokens: string [] };
}

interface SampleContract extends BaseContract {
  getTokens(): Promise<TokensListResponse>;
}

const sampleDef: ContractDefinition = {
  queries: {
    getTokens({ address: owner, permit }): ContractQueryRequest {
      const query = { tokens: { owner } };
      return { with_permit: { query, permit } };
    }
  }
};

export const sample = createContract<SampleContract>({
  id: 'sample',
  at: 'secret1lev289955yj8qh0fz5fqf4gt33j7vg5x0hhe4x',
  definition: sampleDef
});
