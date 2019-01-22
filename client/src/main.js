import Vue from 'vue';
import Buefy from 'buefy';
import axios from 'axios';
import App from './App.vue';
import 'buefy/dist/buefy.css';

Vue.prototype.$axios = axios;

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
