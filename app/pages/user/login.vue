<template>
	<view class="on0 chuizhi">
		<!-- <image class="tupian" src="../../static/logo.png" mode=""></image> -->
		<view class="uni-padding-wrap dj">
			<form @submit="formSubmit">
				<view>
					<view class="uni-form-item uni-column">
						<input class="uni-input"  placeholder="请输入账号" name="username" type="text" />
					</view>
				</view>
				<view>
					<view class="uni-form-item uni-column">
						<input class="uni-input" password placeholder="请输入密码" name="password" type="text" />
					</view>
				</view>
				<view>
					<view class="uni-form-item uni-column">
						<input type="hidden" class="hidden_inp" name="igexin_cid" :value="igexin_cid" />
						<button type="warn" form-type="submit" class="submit" style="">登录</button>
					</view>
				</view>
			</form>
			<view class="uni-flex uni-row">
				<view class="flex-item" @click="toReg">注册账号</view>
				<!-- <view class="flex-item">忘记密码</view> -->
			</view>
		</view>
	</view>
</template>
<script>
	const server = require('../../utils/server');
	export default {
		data() {
			return {
				igexin_cid: ''
			}
		},
		onLoad: function() {
			console.log('login onLoad');
			let that = this;
			//获取个推cid
			that.getPush();
		},
		methods: {
			formSubmit: function(e) {
				uni.showLoading({
					title: '登录中',
					mask: true
				});
				console.log('formsubmit');
				console.log(e);
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
				if (e.detail.value.username == '' || e.detail.value.password == '') {
					if (e.detail.value.username == '') {
						var content = '请输入账号';
					} else {
						var content = '请输入密码';
					}
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: content,
						showCancel: false
					});
				} else {
					let that = this;
					console.log(JSON.stringify(e.detail.value));
					server.postJSON('/User/login', e.detail.value, function(res) {
						console.log(JSON.stringify(res));
						uni.hideLoading();
						if (res.data.status == 1) {
							uni.setStorage({
								key: 'token',
								data: res.data.result.token
							});
							uni.setStorage({
								key: 'userInfo',
								data: res.data.result
							});
							that.globalData.token = res.data.result.token;
							that.globalData.userInfo = res.data.result;
							that.globalData.loginState = true;
							uni.switchTab({
								url: '/pages/index/index'
							});
						}
					},
					function (res) {
						uni.hideLoading();
						if (res.errMsg.indexOf('timeout') != -1) {
							uni.showModal({
								title: '提示',
								content: '请求超时',
								showCancel: false,
							});
						}
					});
				}
			},
			getPush: function() {
				let that = this;
				console.log('getPush');
				uni.getProvider({
					service: 'push',
					success: function(res) {
						console.log(res.provider);
						// 个推的名称为 igexin
						if (~res.provider.indexOf('unipush')) {
							that.getCid();
							let s = setInterval(function() {
								console.log('setInterval that.igexin_cid:');
								console.log(that.igexin_cid)
								if (that.igexin_cid == '' || that.igexin_cid == 'null') {
									that.getCid();
								} else {
									clearInterval(s)
								}
							}, 1000);
						}
					}
				});
				console.log('getPush end');
			},
			getCid: function() {
				//获取个推cid
				console.log('getCid');
				let that = this;
				uni.subscribePush({
					provider: 'unipush',
					success: function(res) {
						console.log('unipush success:' + JSON.stringify(res));
						that.igexin_cid = res.clientid;
					},
					fail: function(res) {
						console.log('unipush fail:' + JSON.stringify(res));
					}
				});
				console.log('getCid end');
			},
			toReg: function() {
				console.log('toReg')
				uni.navigateTo({
					url: '/pages/user/reg'
				})
			},
			toForget: function() {
				console.log('toForget')
				uni.navigateTo({
					url: '/pages/forget/forget'
				})
			}
		}
	};
</script>
<style>
	.hidden_inp {
		display: none;
	}
	.tupian {
		width: 750upx;
		margin-bottom: 20upx;
		height: 200upx;
	}

	.dj .uni-form-item > input{
		border-radius: 20upx;
		border: 1upx solid #E0E0E0;
	}
	.dj .uni-flex.uni-row{
		justify-content: flex-end;
	}
	.dj .uni-flex.uni-row .flex-item{
		margin-left: 20upx;
		color: #007AFF;
	}
	.dj .uni-form-item.uni-column button{
		width:100%;
		font-size:40upx;
		line-height: 85upx;
		border-radius: 20upx;
	}
</style>
