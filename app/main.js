import Vue from 'vue'
import App from './App'
import server from './utils/server';

Vue.prototype.$server = server
// Vue.prototype.server = server

Vue.prototype.globalData = {
	token: '',
	userInfo: '',
	loginState: false,
	refresh: {}
}
Vue.prototype.log
Vue.prototype.qiniu = 'http://file.orangelite.cn/'
// Vue.prototype.site = 'http://192.168.1.18:9091';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()