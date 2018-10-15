// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueCookies from "vue-cookies"
import 'babel-polyfill'


import * as Sentry from '@sentry/browser'

process.env.NODE_ENV === 'production' && Sentry.init({
  dsn: 'https://4e1d487fd4744afd932c4347edb3cfd6@sentry.io/1299841',
  integrations: [new Sentry.Integrations.Vue({Vue})]
})


Vue.use(VueCookies);

Vue.config.productionTip = false

//oauth2(init);
init();

function init() {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
  })
}
