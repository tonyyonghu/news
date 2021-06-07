<template>
	<view class="on0 chuizhi">
		<image class="tupian" src="../../static/logo.png" mode=""></image>
		<form @submit="formSubmit" style="width: 100%;">
			<view class="pages">
				<view class="frame">
					<text class="name">手机号码:</text>
					<input
						class="name_input"
						placeholder="手机号"
						type="number"
						name="phone"
						v-model:value="phone"
					/>
				</view>
				<view class="frame">
					<text class="name">验证码:</text>
					<input
						class="name_input"
						placeholder="短信验证码"
						type="number"
						maxlength="6"
						name="phone_code"
						value=""
					/>
					<text class="btn" @tap="getPhoneCode()">{{ getCodeText }}</text>
				</view>
				<view class="frame">
					<text class="name">新密码:</text>
					<input
						class="name_input"
						placeholder="密码不能低于6位字符"
						type="password"
						password="true"
						name="new_password"
						value=""
					/>
				</view>
				<view class="frame">
					<text class="name">确认密码:</text>
					<input
						class="name_input"
						placeholder="密码不能低于6位字符"
						type="password"
						password="true"
						name="confirm_password"
						value=""
					/>
				</view>
				<button form-type="submit" class="sub" @click="Change_Password">修改密码</button>
			</view>
		</form>
	</view>
</template>

<script>
// const server = require('../../utils/server');

export default {
	data() {
		return {
			phone: '',
			getCodeText: '获取验证码',
			sendTime: 0
		};
	},
	methods: {
		formSubmit: function(e) {
			console.log('formsubmit');
			console.log(e);
			console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
			if (
				e.detail.value.phone == '' ||
				e.detail.value.phone_code == '' ||
				e.detail.value.new_password == '' ||
				e.detail.value.confirm_password == ''
			) {
				if (e.detail.value.phone == '') {
					var content = '请输入手机号码';
				} else if (e.detail.value.phone_code == '') {
					var content = '请输入短信验证码';
				} else if (e.detail.value.new_password == '') {
					var content = '请输入新密码';
				} else {
					var content = '请输入确认密码';
				}
				uni.showModal({
					title: '提示',
					content: content,
					showCancel: false
				});
			} else {
				uni.showLoading({
					title: '修改中',
					mask: true
				});
				// console.log('aa');
				let that = this;
				let phone_code = e.detail.value.phone_code;
				let new_password = e.detail.value.new_password;
				let confirm_password = e.detail.value.confirm_password;
				let data = {
					phone_code,
					new_password,
					confirm_password,
					phone: e.detail.value.phone
				};
				server.postJSON(
					'/User/forgetPassword',
					data,
					function(res) {
						console.log(JSON.stringify(res));
						uni.hideLoading();
						if (res.data.status == 1) {
							uni.clearStorage();
							uni.showToast({
								title: '修改密码成功',
								icon: 'success',
								mask: true,
								success: function(result) {
									setTimeout(function() {
										uni.reLaunch({
											url: '/pages/user/login'
										});
									}, 1500);
								}
							});
						}
					},
					function(res) {
						uni.hideLoading();
						if (res.errMsg.indexOf('timeout') != -1) {
							uni.showModal({
								title: '提示',
								content: '请求超时',
								showCancel: false
							});
						}
					}
				);
			}
		},
		getPhoneCode: function() {
			console.log('getPhoneCode')
			var that = this;
			if (this.sendTime > 0) {
				return false;
			}
			var mobile = this.phone;
			console.log(mobile);
			if (mobile == '') {
				uni.showToast({
					title: '请输入手机号码',
					mask: true,
					duration: 1500
				});
				return;
			}
			uni.showLoading({
				title: '',
				mask: true
			});
			that.sendTime = 60;
			server.getJSON('/User/sendCode', { mobile: mobile }, function(res) {
				uni.hideLoading();
				if (res.data.status == 1) {
					that.sendTime = 60;
					console.log('form sub1');
					uni.showToast({
						title: res.data.msg,
						icon: 'success',
						duration: 3000,
						mask: true
					});
					siv = setInterval(function() {
						that.sendTime--;
						if (that.sendTime == 0) {
							clearInterval(siv);
							that.getCodeText = '获取验证码';
							return;
						}
						that.getCodeText =  '' + that.sendTime + 's';
					}, 1000);
				} else {
					that.sendTime = 0;
					uni.showModal({
						title: '提示',
						content: res.data.msg || res.statusCode + ':' + res.errMsg,
						showCancel: false
					});
				}
			});
		}
	}
};
</script>

<style>
.pages {
	width: 100%;
	min-height: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
}

.frame {
	width: 600upx;
	height: 100upx;
	flex-direction: row;
	border: 1px solid #cccccc;
	border-radius: 15upx;
	margin: 20upx auto;
}

.name {
	width: 150upx;
	font-size: 30upx;
	line-height: 100upx;
	text-align: right;
}

.name_input {
	height: 80upx;
	line-height: 80upx;
	padding: 10upx 10upx 10upx 20upx;
	flex: 1;
	padding-left: 20upx;
}

.sub {
	width: 600upx;
	height: 100upx;
	margin-top: 20upx;
	line-height: 100upx;
}

.fenhao {
	font-size: 30upx;
	line-height: 100upx;
	text-align: center;
}

.tupian {
	width: 750upx;
	margin-bottom: 70upx;
	height: 200upx;
}

.on0 {
	width: 750upx;
}
.frame .btn {
	width: 200upx;
	height: 100upx;
	line-height: 100upx;
	background-color: #f8f8f8;
	color: #000;
	border-left: 1px solid #d8d8d8;
	border-top-right-radius: 15upx;
	border-bottom-right-radius: 15upx;
	text-align: center;
	font-size: 30upx;
}
</style>
