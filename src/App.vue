<template>
  <h1>Griptape 0.8.0 showcase</h1>

  <h2>Bootstrap / Shutdown</h2>
  <div v-if="connected">Connected</div>
  <div v-else>No connected</div>
  <br>
  <button @click="bootstrap">Bootstrap</button>
  <button @click="shutdown">Shutdown</button>

  <h2>Balance</h2>
  <span>SCRT Balance: {{ balance }}</span>

  <h2>Sync mode</h2>
  <form @submit.prevent="send">
    <input type="text" v-model="rawAmount">
    <button :disabled="loading">
      <span v-if="loading">Loading...</span>
      <span v-else>Send</span>
    </button>
  </form>

  <h2>Code hash</h2>
  <pre>Response: {{ tokenInfo }}</pre>
  <br>
  <button @click="getTokenInfo">Get Token Info</button>

  <h2>Permits</h2>
  <h3 v-if="sampleHasPermit">Has permit</h3>
  <h3 v-else>Doesn't have permit</h3>
  <button @click="createPermit">Create Permit</button>
  <button @click="getTokens" :disabled="queryLoading">Get Tokens</button>
  <br>
  <pre v-if="tokens">Response: {{ tokens.join(', ') }}</pre>

  <br>
  <br>

  <button @click="suggestChain">Suggest chain</button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  bootstrap,
  shutdown,
  onAccountAvailable,
  onAccountDisconnect,
  getNativeCoinBalance,
  coinConvert,
  enablePermit,
  hasPermit,
  getKeplr
} from '@stakeordie/griptape.js';
import { sscrt } from '@/contracts/sscrt';
import { sample } from '@/contracts/sample';
import { stkd } from '@/contracts/stkd';

export default defineComponent({
  setup() {
    const balance = ref();
    const connected = ref();
    const loading = ref(false);
    const rawAmount = ref<string>();
    const tokenInfo = ref();
    const tokens = ref<string[]>();
    const sampleHasPermit = ref(false);
    const queryLoading = ref(false);

    async function fetchBalance() {
      const res = await getNativeCoinBalance();
      balance.value = coinConvert(res, 6, 'human');
    }

    async function send() {
      if (!rawAmount.value) return;
      loading.value = true;
      const amount = coinConvert(rawAmount.value, 6, 'machine');
      const result = await sscrt.send('secret13wxsre82yf8gd63x6r6hvdncsek7tcrsnaea33', amount);
      if (result.isEmpty()) {
        loading.value = false;
        return;
      }
      const res = result.parse();
      console.log(res);
      rawAmount.value = undefined;
      loading.value = false;
    }

    async function getTokenInfo() {
      const res = await sscrt.getTokenInfo();
      tokenInfo.value = res;
    }

    async function createPermit() {
      await enablePermit(sample, ['owner']);
      sampleHasPermit.value = hasPermit(sample);
    }

    async function getTokens() {
      queryLoading.value = true;
      const res = await sample.getTokens();
      tokens.value = res.token_list.tokens;
      queryLoading.value = false;
    }

    async function suggestChain() {
      const keplr = await getKeplr();
      if (!keplr) throw new Error('No Keplr');
      await keplr.experimentalSuggestChain({
        chainId: 'supernova-2',
        chainName: 'supernova-2',
        rpc: 'http://bootstrap.supernova.enigma.co:26656',
        rest: 'http://bootstrap.supernova.enigma.co:1317',
        bip44: {
          coinType: 529,
        },
        coinType: 529,
        stakeCurrency: {
          coinDenom: 'SCRT',
          coinMinimalDenom: 'uscrt',
          coinDecimals: 6,
        },
        bech32Config: {
          bech32PrefixAccAddr: 'secret',
          bech32PrefixAccPub: 'secretpub',
          bech32PrefixValAddr: 'secretvaloper',
          bech32PrefixValPub: 'secretvaloperpub',
          bech32PrefixConsAddr: 'secretvalcons',
          bech32PrefixConsPub: 'secretvalconspub',
        },
        currencies: [
          {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
          },
        ],
        gasPriceStep: {
          low: 0.1,
          average: 0.25,
          high: 0.4,
        },
        features: ['secretwasm'],
      });
    }

    onMounted(() => {
      onAccountAvailable(() => {
        console.log('On account available');
        connected.value = true;
        sampleHasPermit.value = hasPermit(sample);

        sscrt.getTokenInfo().then(res => console.log(res));
        stkd.getStakingInfo().then(res => console.log(res));

        fetchBalance();
      });

      onAccountDisconnect(() => {
        console.log('On account disconnect');
        connected.value = false;
      });
    });

    return {
      bootstrap,
      shutdown,
      send,
      getTokenInfo,
      createPermit,
      getTokens,
      tokens,
      tokenInfo,
      balance,
      connected,
      rawAmount,
      loading,
      sampleHasPermit,
      queryLoading,
      suggestChain
    };
  }
});
</script>
