<template>
	<block v-if="load === true">
		<view class="pages">
			<view class="userinfo_view">
				<view class="row_row">
					<view class="name_view">
						<text class="nickname">{{list.nickname}}</text>
						<text class="level_name" v-if="list.level_name">{{list.level_name}}</text>
					</view>
					<image :src="list.head_pic" class="head_pic" @click="chooseImage" mode="aspectFill"></image>
				</view>
				<view class="row_row row_around integral_view">
					<view class="integral">
						<text>{{list.year_points}}</text>
						<text>年度积分</text>
					</view>
					<view class="integral">
						<text>{{list.mon_points}}</text>
						<text>月度积分</text>
					</view>
					<view class="integral">
						<image src="/static/point_icon.png" class="integral_img"></image>
						<text>月度排名</text>
					</view>
				</view>
			</view>
			<view class="info_but_view">
				<view class="row_row info_but" @click="jump_integral()">
					<image class="info_but_img" src="/static/my_point_log.png"></image>
					<text>积分记录</text>
				</view>
				<view class="row_row info_but" @click="jump_wodezhibu()">
					<image class="info_but_img" src="/static/my_department.png"></image>
					<text>我的支部</text>
				</view>
				<view class="row_row info_but" @click="jump_gerenxinxi()">
					<image class="info_but_img" src="/static/my_user_info.png"></image>
					<text>个人信息</text>
				</view>
				<button class="logout" @click="Exit_logon">退出登录</button>
			</view>
		</view>
	</block>
	<block v-else-if="load === false">
		<request-overtime :loading="loading" v-on:refresh="refresh()"></request-overtime>
	</block>
	<block v-else></block>
</template>

<script>
	const server = require("../../utils/server");
	export default {
		data() {
			return {
				list: [],
				// 是否加载完成 默认为undefined true:加载完成显示帖子详情， false:为加载完成显示从新加载界面
				load: undefined,
				// 点击刷新样式
				loading: '',
				version: ''
			}
		},
		onLoad: function(o) {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.load = undefined;
			this.loading = '';
			this.list = [];
			this.isLoaded = false;
			this.cat_id = o.cat_id;
			// #ifdef APP-PLUS
			this.version = plus.runtime.version;
			// #endif
			// this.getList();
		},
		onShow:function(){
			this.getList();
		},
		methods: {
			//读取我的页面接口数据
			getList: function() {
				let that = this;
				let token = this.globalData.token;
				let data = {
					token,
				}
				let ms = that.list;
				server.getJSON('/user/center', data, function(res) {
						console.log(JSON.stringify(res));
						uni.hideLoading();
						if(res.data.status == 1) {
							ms = res.data.result;
							that.list = ms;
							that.globalData.userInfo = res.data.result;
							uni.setStorage({
								key: 'userInfo',
								data: that.globalData.userInfo
							});
						}
						that.load = true;
					},
					function(res) {
						console.log(res)
						uni.hideLoading();
						if (res.errMsg.indexOf('timeout') != -1) {
							console.log('timeout')
							that.load = false;
							that.loading = false;
						}
					});
			},
			jump_gerenxinxi: function(e) {
				uni.navigateTo({
					url: "/pages/user/info"
				})
			},
			jump_wodezhibu: function(e) {
				uni.navigateTo({
					url: "/pages/user/branch"
				})
			},
			jump_xiugaimima: function(e) {
				uni.navigateTo({
					url: "/pages/xiugaimima/xiugaimima"
				})
			},
			jump_wodechengji: function(e) {
				uni.navigateTo({
					url: "/pages/user/grades"
				})
			},
			jump_integral: function(e) {
				uni.navigateTo({
					url: "/pages/user/integral"
				})
			},
			Exit_logon: function(e) {
				let that = this;
				let token = this.globalData.token;
				let data = {
					token,
				}
				server.postJSON('/User/logout', data, function(res) {
					console.log(JSON.stringify(res));
					if (res.data.status == 1) {
						uni.clearStorage();
						uni.showToast({
							title: res.data.msg,
							duration: 2000
						});
						uni.reLaunch({
							url: "/pages/user/login"
						});
					}
				});
			},

			// 跳转到交党费
			navigateToPartyFee: function() {
				uni.navigateTo({
					url: '/pages/jiaodangfei/jiaodangfei'
				})
			},

			// 上传头像
			chooseImage: function() {
				let that = this;
				uni.chooseImage({
					count: 1,
					success: function(res) {
						wx.showModal({
							content: "确认修改头像吗",
							success: result => {
								if (result.confirm) {
									let path = res.tempFilePaths[0];
									that.uploadHead(path);
								}
							}
						});
					}
				});
			},

			uploadHead: function(path) {
				uni.showLoading({
					title: '正在上传中',
					mask: true
				})
				let that = this;
				let token = that.globalData.token;
				// let token = '0cfb202d8bf0b9af0735cdfae25b9bc1';
				let data = [];
				let datas = {
					token
				}
				console.log(path);
				console.log(datas);
				const uploadTask = uni.uploadFile({
					url: server.apiUrl + '/user/headPicUp',
					filePath: path,
					name: 'file',
					formData: datas,
					success: function(res) {
						uni.hideLoading();
						var str = res.data;
						str = str.replace("/(^\s*)|(\s*$)/g", "");
						data = JSON.parse(str);
						if (data.status == 1) {
							console.log(JSON.stringify(data));
							let head_pic = data.result;
							that.globalData.userInfo.head_pic = head_pic;
							that.list.head_pic = head_pic;
							uni.setStorage({
								key: 'userInfo',
								data: that.globalData.userInfo
							});
							uni.hideLoading();
						} else {
							uni.hideLoading();
							uni.showModal({
								title: data.msg,
								content: data.result.state,
								showCancel: false
							});
						}
					},
					fail: function(res) {
						console.log(JSON.stringify(res))
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: "上传失败",
							showCancel: false
						});
					}
				});
			},

			// 问题反馈
			problem: function() {
				console.log('problem');
				uni.navigateTo({
					url: "/pages/yulunshangbao/yulunshangbao?problem=true"
				})
			},

			// 清除缓存
			cleanUpCache: function() {
				uni.removeStorageSync('homeData');
				uni.removeStorageSync('plateData');
				uni.showToast({
					title: '清除成功',
					icon: 'success',
					mask: true
				});
			},
			// 重新请求
			refresh: function() {
				console.log('refresh');
				this.loading = true;
				this.getList();
			},
			
			jump_collection: function () {
				uni.navigateTo({
					url: '/pages/wode/collection/collection'
				})
			},
			jump_Integral_ranking:function(){
				uni.navigateTo({
					url: '/pages/Integral_ranking/Integral_ranking'
				})
			},
			toDfPage: function() {
				uni.navigateTo({
					url: '/pages/jiaodangfei/jiaodangfei'
				})
			}
		},
	}
</script>

<style>
	page {
		background: white;
	}
	.row_row {
		flex-direction: row;
	}
	.row_around {
		flex-direction: row;
		justify-content: space-around;
	}
	.row_between {
		flex-direction: row;
		justify-content: space-between;
	}
	.pages {
		
	}
	.userinfo_view {
		background-image: url('../../static/my_background.png');
		background-size: 100%;
		padding: 0upx 30upx;
	}
	.head_pic {
		width: 120upx;
		height: 120upx;
		border-radius: 100upx;
		background: #fff;
		border: 1px solid #ddd;
		margin: 30upx 16upx 0upx;
	}
	.spot_view {
		padding: 30upx 0upx;
	}
	.spot {
		width: 32upx;
		height: 32upx;
		border-radius: 100upx;
	}
	.spot_red {
		background: #f00;
	}
	.spot_yellow {
		background: #ff0;
	}
	.spot_green {
		background: #0f0;
	}
	.nickname {
		font-size: 40upx;
		margin-bottom: 30upx;
		font-weight: bold;
	}
	.level_name {
		font-size: 35upx;
	}
	.name_view {
		width: 70%;
		padding: 0upx 16upx;
	}
	.integral_view {
		margin: 32upx 0upx 24upx;
		padding: 32upx 0upx;
		background: #DD5147;
		border-radius: 10upx;
	}
	.integral {
		color: white;
		text-align: center;
		font-size: 35upx;
	}
	.integral_img {
		width: 40upx;
		height: 40upx;
		margin:10upx auto;
	}
	.info_but_view {
		background: white;
		padding: 16upx 30upx 24upx;
	}
	.info_but {
		padding: 10upx 0upx;
		line-height: 80upx;
		border-bottom: 1px solid #eee;
		font-size: 35upx;
	}
	.info_but_img {
		width: 80upx;
		height: 80upx;
		margin-right: 3upx;
	}
	.logout {
		background-color: #DD5147;
		color: white;
		font-size: 35upx;
		margin: 30upx auto;
	}
</style>