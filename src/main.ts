import { createApp } from 'vue'
import App from './App.vue'
import {
  gripApp,
  getKeplrAccountProvider,
  Config,
  BroadcastMode
} from '@stakeordie/griptape.js';

const config: Config = {
  restUrl: 'https://api.pulsar.stakeordie.com',
  broadcastMode: BroadcastMode.Block
};
const provider = getKeplrAccountProvider();
function runApp() {
  createApp(App)
    .mount('#app');
}

// It still supports `restUrl` as the first parameter
gripApp(config, provider, runApp);
