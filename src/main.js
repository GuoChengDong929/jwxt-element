import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import config from './config'


import VideoPlayer from 'vue-video-player'

import access from '@/utils/has_permission.js'

import elementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview'
import 'iview/dist/styles/iview.css'



//引入自定义element-ui图标
import './assets/myicon/iconfont.css'

import eCharts from 'echarts';
import countTo from 'vue-count-to'



require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.config.productionTip = false;
Vue.prototype.$config = config; //全局注册应用配置
Vue.prototype.$access = access;
Vue.prototype.$echarts = eCharts;



Vue.use(elementUI);
Vue.use(iView);
Vue.use(VideoPlayer);

Vue.component("count-to",countTo);



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
