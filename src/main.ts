import { createApp } from 'vue'
import App from './App.vue'
import {
  gripApp,
  getKeplrAccountProvider,
  Config,
  BroadcastMode
} from '@stakeordie/griptape.js';

const config: Config = {
  restUrl: 'http://bootstrap.supernova.enigma.co:1317',
  broadcastMode: BroadcastMode.Sync
};
const provider = getKeplrAccountProvider();
function runApp() {
  createApp(App)
    .mount('#app');
}

// It still supports `restUrl` as the first parameter
gripApp(config, provider, runApp);
