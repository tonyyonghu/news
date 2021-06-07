<template>
	<view class="chuizhi">
		<view class="pages" v-if="plateList.length > 1">
			<view class="topPlateView" id="topPlateView">
				<view class="topPlate">
					<block v-for="(item, index) in plateList" v-bind:key="item.cat_id">
						<view class="plate_view" :class="{ 'plate_view_select':item.checked }" :data-id="item.cat_id" :data-index="index"
						 @click='clickPlate' :id="'topPlate'+index">
							<text class="plate_name">{{item.cat_name}}</text>
							<view class="select"></view>
						</view>
					</block>
				</view>
			</view>
			<swiper :style="{height: height + 'px'}" @change="swiperChange" :current="swiperCurrent" class='scroll-view'
			 duration="300">
				<block v-for="(itemName, idx) in plateList" :key="idx">
					<swiper-item>
						<scroll-view scroll-y :style="{height: height + 'px'}" @scrolltoupper="upper" upper-threshold="-0" @scrolltolower="lower"
						 lower-threshold="0" enable-back-to-top="true" :data-idx="idx" scroll-with-animation="true">
							<button v-if="position=='top'" loading="true" class="Loading" :style="{display: loading}">加载中</button>
							<block v-for="(item, index) in postList[idx]" v-bind:key="index">
								<view class="on1 juzhong" @click="dianji" :data-id="item.article_id">
									<view class="on1_hezi chuizhi">
										<view class="fensan">
											<image class="tupian" :src="item.thumb" mode="aspectFill"></image>
											<view class="on1_hezi_right">
												<view class="chuizhi">
													<text class="ziti1">{{item.title}}</text>
													<text class="ziti2">{{item.description}}</text>
												</view>
											</view>
										</view>
										<view class="on2 fensan">
											<view class="on2_left">
												<image class="tupian2" :src="item.touxiang" mode=""></image>
												<text class="ziti3">{{item.xingming}}</text>
											</view>
											<view class="on2_right">
												
												<text class="ziti4">{{item.click}}</text>
												
												<text class="ziti4">{{item.add_time}}</text>
											</view>
										</view>
									</view>
								</view>
							</block>
							<button v-if="position=='bottom'" loading="true" class="Loading" :style="{display: loading}">加载中</button>
						</scroll-view>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<block v-if="plateList.length == 1">
			<view class="on1 juzhong" v-for="(item, index) in list" :key="index" @click="dianji" :data-id="item.article_id">
				<view class="on1_hezi chuizhi">
					<view class="fensan">
						<image class="tupian" :src="item.thumb" mode="aspectFill"></image>
						<view class="on1_hezi_right">
							<view class="chuizhi">
								<text class="ziti1">{{item.title}}</text>
								<text class="ziti2">{{item.description}}</text>
							</view>
						</view>
					</view>
					<view class="on2 fensan">
						<view class="on2_left">
							<image class="tupian2" :src="item.touxiang" mode=""></image>
							<text class="ziti3">{{item.xingming}}</text>
						</view>
						<view class="on2_right">
							
							<text class="ziti4">{{item.click}}</text>
							
							<text class="ziti4">{{item.add_time}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="jiazai_zhuangtai==1">
				<button class="jiazai juzhong ziti5" :loading="loading" plain="true">{{jiazai_biaoti}}</button>
			</view>
		</block>
	</view>
</template>

<script>
	const server = require('../../utils/server');
	var windowWidth;
	var Slide = 0;
	export default {
		data() {
			return {
				plateList: [{}],
				postList: {},
				loading: 'none',
				sc: 0,
				swiperCurrent: 0,
				DAH: '',
				height: 0,
				position: '',
				// 是否加载完成 默认为undefined true:加载完成显示帖子详情， false:为加载完成显示从新加载界面
				load: undefined,
				// 点击刷新样式
				loading2: '',
				plateInfo: [],
				find_title: '',
				plateRole: false,
				releaseRole: false,
				list: [],
				jiazai_zhuangtai: 0,
				jiazai_biaoti: '加载中',
				page: 1
			}
		},
		onLoad: function(o) {
			let that = this;
			that.cat_id = o.cat_id;
			that.getPlate(o.cat_id);
			if (o.cat_name != '' && o.cat_name != undefined) {
				uni.setNavigationBarTitle({
					title: o.cat_name
				});
			}
			uni.getSystemInfo({
				success: function(res) {
					windowWidth = res.windowWidth;
					var topPlateView = 100 * (res.windowWidth / 750);
					that.height = res.windowHeight - topPlateView - 1;
				}
			});
		},
		onShow: function() {
			let that = this;
			if (this.globalData.refresh.cat_id > 0) {
				//获取index
				let swiperCurrent = false;
				for (var i in this.plateList) {
					if (this.plateList[i].cat_id == this.globalData.refresh.cat_id) {
						swiperCurrent = i;
						break;
					}
				}
				this.postList[swiperCurrent] = [];
				let plateInfo = this.plateList[swiperCurrent];
				plateInfo.isLoaded = false;
				plateInfo.page = 1;
				this.getPost(plateInfo.cat_id, swiperCurrent, plateInfo.page, 'top');
				this.globalData.refresh.cat_id = 0;
			}
		},
		onPullDownRefresh: function() {
			console.log('onPullDownRefresh');
			if (this.plateList > 1) {
				let swiperCurrent = this.swiperCurrent;
				this.postList[swiperCurrent] = [];
				let plateInfo = this.plateList[swiperCurrent];
				plateInfo.isLoaded = false;
				plateInfo.page = 1;
				this.getPost(plateInfo.cat_id, swiperCurrent, plateInfo.page, 'top');
			} else {
				this.page = 1;
				this.getList(1);
			}
		},
		// 页面上拉触底事件的处理函数
		onReachBottom: function() {
			console.log('onReachBottom');
			if (this.isLoaded) {
				return;
			}
			this.getList(++this.page);
			this.jiazai_zhuangtai = 1;
		},
		onShareAppMessage: function() {},
		onUnload: function() {
			this.plateList = [];
			this.postList = {};
		},
		methods: {
			// 获取列表
			getList: function(p) {
				let that = this;
				let token = this.globalData.token;
				let cat_id = this.cat_id;
				let key = this.key;
				let data = {
					p,
					token
				};
				if (cat_id != undefined) {
					data.cat_id = cat_id;
				}
				if (key != undefined) {
					data.keywords = key;
				}
				server.getJSON(
					'/Article/articleList',
					data,
					function(res) {
						console.log(JSON.stringify(res));
						uni.hideLoading();
						uni.stopPullDownRefresh();
						if (res.data.status == 1) {
							let result = res.data.result;
							let ms = that.list;
							for (var i in result) {
								ms.push(result[i]);
							}
							that.list = ms;
							that.load = true;
							if (result.length < 10) {
								that.isLoaded = true;
								console.log('加载完毕');
								that.jiazai_biaoti = '加载完毕';
								that.jiazai_zhuangtai = 1;
								that.loading = false;
							} else {
								that.jiazai_zhuangtai = 0;
							}
						}
					},
					function(res) {
						console.log(res);
						console.log(JSON.stringify(res));
						uni.hideLoading();
						uni.stopPullDownRefresh();
						if (res.errMsg.indexOf('timeout') != -1 && p == 1) {
							console.log('timeout');
							that.load = false;
							that.loading2 = false;
						}
					}
				);
			},
			/**
			 * 点击头部的版块名
			 */
			clickPlate: function(e) {
				console.log('clickPlate');
				var that = this;
				var idx = e.currentTarget.dataset.index;
				that.swiperCurrent = idx;
				console.log('clickPlateEnd');
			},

			/**
			 * 滚动列表部分
			 */
			swiperChange: function(e) {
				console.log('swiperChange');
				console.log(e);
				if (Slide == 1) {
					console.log('Slide retrun');
					console.log(e.detail.current);
					console.log(this.swiperCurrent);
					this.swiperCurrent = this.swiperCurrent;
					return;
				} else {
					console.log('Slide ok');
					Slide = 1;
					setTimeout(function() {
						Slide = 0;
					}, 200);
				}
				var that = this;
				var index = e.detail.current;
				console.log('swiperChange: ' + index);
				this.swiperCurrent = index;
				this.choosePlate(index);
				//加载列表
				var plateList = this.plateList;
				if (typeof that.postList[index] == 'object' && that.postList[index].length < 1) {
					plateList[index].page = 0;
				}
				if (plateList[index].page == 0) {
					plateList[index].page = plateList[index].page + 1;
					that.postList[index] = [];
					this.getPost(plateList[index].cat_id, index, plateList[index].page, 'top');
				}
				console.log('swiperChangeEng');
			},

			/**
			 * 下拉
			 */
			upper: function(e) {
				return;
				console.log(e);
				uni.startPullDownRefresh();

				let swiperCurrent = this.swiperCurrent;
				this.postList[swiperCurrent] = [];
				let plateInfo = this.plateList[swiperCurrent];
				plateInfo.isLoaded = false;
				plateInfo.page = 1;
				this.getPost(plateInfo.cat_id, swiperCurrent, plateInfo.page, 'top');

				return;
				//某个版块列表滚到底部了
				var index = e.currentTarget.dataset.idx;
				var plateList = this.data.plateList;
				plateList[index].page = 0;
				this.getPost(plateList[index].cat_id, index, plateList[index].page);
			},
			/**
			 * 列表滚动到底部
			 */
			lower: function(e) {
				console.log('lower');
				//某个版块列表滚到底部了
				var index = e.currentTarget.dataset.idx;
				var plateList = this.plateList;
				//如果数据已经全部加载完成将不会再执行代码
				if (plateList[index].isLoaded || !this.isCanPull) {
					console.log('加载中或已经加载完了');
					return;
				}
				//节流阀
				this.isCanPull = false;
				//添加一秒的定时器，防止用户频繁操作
				// setTimeout(() => {
				//   this.setData({
				//     isCanPull: true
				//   });
				// }, 2000);

				plateList[index].page = plateList[index].page + 1;
				this.getPost(plateList[index].cat_id, index, plateList[index].page, 'bottom');
			},
			/**
			 * 选择样式
			 */
			choosePlate: function(index) {
				console.log('choosePlate');
				var that = this;
				var plateList = this.plateList;
				var left_id = '';
				that.plateInfo = plateList[index];
				for (var i in plateList) {
					plateList[i].checked = i == index;
					this.$set(plateList, i, plateList[i]);
					//获取之前全部的 然后计算总宽度
					if (i <= index) {
						left_id += '#topPlate' + i + ',';
					}
				}
				left_id =
					left_id.substring(left_id.length - 1) == ',' ?
					left_id.substring(0, left_id.length - 1) :
					left_id;

				console.log(left_id);

				if (left_id) {
					uni.createSelectorQuery()
						.selectAll(left_id)
						.boundingClientRect(function(rects) {
							console.log('boundingClientRect');
							console.log(rects);
							if (rects.length > 0) {
								var lWidth = 0;
								rects.forEach(function(rect) {
									console.log('rect');
									console.log(rect);
									console.log(JSON.stringify(rect));
									//左边总宽度
									lWidth += rect.width;
								});
								var paddingLeft = 30 * (windowWidth / 750);
								var sc =
									lWidth -
									windowWidth / 2 -
									rects[rects.length - 1].width / 2 +
									paddingLeft;

								console.log(sc);

								sc = sc > 0 ? sc : 0;
								that.sc = sc;
							}
						})
						.exec();
				}
				console.log('choosePlateEnd');
			},
			// 获取帖子列表
			getPost: function(cat_id, index, pageIndex, position) {
				let that = this;
				position = position || 'top';
				that.loading = '';
				that.position = position;
				pageIndex = pageIndex || 1;
				index = index || 0;
				cat_id = cat_id || 1;
				let url = '/Article/articleList';
				let token = that.globalData.token;
				server.getJSON(
					url, {
						p: pageIndex,
						cat_id: cat_id,
						token: token
					},
					function(res) {
						console.log(res);
						var newPostList = res.data.result;
						var plateList = that.plateList;
						plateList[index].load = true;
						if (newPostList != '') {
							if (pageIndex == 0) {
								var ms = (that.postList[index] = []);
							} else {
								var ms =
									typeof that.postList[index] == 'undefined' ?
									[] :
									that.postList[index];
							}
							console.log(typeof ms);
							for (var i in newPostList) {
								newPostList[i].id = 'video' + i;
								ms.push(newPostList[i]);
							}
							uni.stopPullDownRefresh();
							setTimeout(function() {
								that.loading = 'none';
								that.postList[index] = ms;
								that.isCanPull = true;
								if (newPostList.length < 10) {
									plateList[index].isLoaded = true;
									that.plateList = plateList;
									// that.setData(param);
								}
							}, 300);
						} else {
							plateList[index].isLoaded = true;
							setTimeout(function() {
								that.loading = 'none';
								that.isCanPull = true;
								that.plateList = plateList;
							}, 300);
						}
						that.position = '';
					},
					function(res) {
						console.log(res);
						uni.hideLoading();
						uni.stopPullDownRefresh();
						console.log(pageIndex);
						if (res.errMsg.indexOf('timeout') != -1 && pageIndex == 0) {
							console.log('timeout');
							that.plateList[index].load = false;
							that.plateList[index].loading = false;
						}
					}
				);
			},
			/**
			 * 获取论坛版块
			 */

			getPlate: function(id) {
				console.log('getPlate1');
				var that = this;
				let token = this.globalData.token;
				let data = {
					token: token,
					id: id
				};
				server.getJSON(
					'/Article/categoryList',
					data,
					function(res) {
						console.log('categoryList res')
						var plateList = res.data.result;
						console.log('plateList', plateList)
						if (plateList.length > 0) {
							for (var i in plateList) {
								plateList[i].page = 0;
								plateList[i].isLoaded = false;
								plateList[i].load = true;
								plateList[i].loading = '';
							}
							uni.hideLoading();
							that.plateList = plateList;
							that.load = true;
							console.log('a');
							//加载第一个
							that.choosePlate(0);
							that.plateList[0].page++;
							that.swiperCurrent = 0;
							that.getPost(that.plateList[0].cat_id, 0, that.plateList[0].page, 'top');
						} else {
							that.getList(that.page);
						}
					},
					function(res) {
						console.log('res2', res);
						uni.hideLoading();
						// uni.stopPullDownRefresh();
						if (res.errMsg.indexOf('timeout') != -1) {
							console.log('timeout');
							that.load = false;
							that.loading2 = false;
						}
					}
				);
			},
			// 跳转详情
			dianji: function(e) {
				console.log(e);
				// let index = e.currentTarget.id;
				let id = e.currentTarget.dataset.id;
				uni.navigateTo({
					url: "/pages/xinwenxiangqing/xinwenxiangqing?article_id=" + id
				});
			},
		}
	};
</script>

<style>
	page {
		background: #eeeeee;
	}

	.fensan {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.pages {
		width: 100%;
		flex-direction: column;
	}

	.topPlateView {
		width: 100%;
		height: 100upx;
		background: white;
		border-bottom: 1px solid #eee;
	}

	.topPlate {
		white-space: nowrap;
		padding: 0upx 30upx 0upx 30upx;
		width: 100%;
		justify-content:space-around;
	}

	.plate_view {
		display: inline-block;
		padding: 0 29upx;
		font-size: 30upx;
		line-height: 96upx;
		height: 96upx;
		color: #999;
		transition-property: all;
		transition-duration: 0.3s;
		transition-timing-function: ease;
		margin-bottom: -1px;
	}

	.plate_veiw .plate_name {
		transition-property: all;
		transition-duration: 0.3s;
		transition-timing-function: ease;
		margin-bottom: -1px;
	}

	.plate_view .select {
		height: 4upx;
		width: 10%;
		background-color: #ffffff;
		margin-left: auto;
		margin-right: auto;
		transition-property: all;
		transition-duration: 0.3s;
		transition-timing-function: ease;
	}

	.plate_view_select {
		font-size: 31upx;
		color: #000;
	}

	.plate_view_select .select {
		background: #cb0000;
		width: 80%;
		height: 4upx;
		margin-left: auto;
		margin-right: auto;
	}

	.topPlate_right {
		/* position: absolute; */
		right: 60upx;
		top: 12upx;
		text-align: center;
		width: 46upx;
		background: white;
		border: 0px solid white;
		margin-top: 30upx;
	}

	.topPlate_right_image {
		width: 13upx;
		height: 22upx;
	}

	.on1 {
		width: 750upx;
		padding-bottom: 30upx;
		border-bottom: 1upx solid #cccccc;
		background: #ffffff;
	}

	.on1_hezi {
		width: 710upx;
	}

	.on1_hezi_right {
		margin-top: 30upx;
		width: 400upx;
		height: 200upx;
	}

	.ziti1 {
		font-size: 30upx;
		line-height: 36upx;
		color: #000000;
		width: 387upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-wrap: break-word;
		word-break: normal;
	}

	.ziti2 {
		padding-bottom: 5upx;
		font-size: 30upx;
		line-height: 36upx;
		margin-top: 40upx;
		font-size: 26upx;
		color: #999999;
		width: 398upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: normal;
	}

	.ziti3 {
		font-size: 26upx;
		line-height: 26upx;
		color: #999999;
		margin-left: 10upx;
		width: 245upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.on2_right text:nth-child(2) {
		max-width: 80upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.ziti4 {
		font-size: 24upx;
		line-height: 24upx;
		color: #999999;
		margin-left: 10upx;
		max-width: 180upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tupian {
		margin-top: 30upx;
		height: 200upx;
		width: 280upx;
	}

	.tupian2 {
		height: 60upx;
		width: 60upx;
		border-radius: 50%;
	}

	.tupian3 {
		height: 22upx;
		width: 31upx;
	}

	.tupian4 {
		height: 25upx;
		width: 25upx;
		margin-left: 20upx;
	}

	.fensan {
		display: flex;
		justify-content: space-between;
	}

	.on2_left {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.on2_right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.on2 {
		margin-top: 30upx;
	}

	.ziti5 {
		font-size: 30upx;
		line-height: 80upx;
		color: #000000;
	}

	.jiazai {
		width: 710upx;
		background: #eeeeee;
		margin-left: 20upx;
		margin-right: 20upx;
		margin-top: 20upx;
		margin-bottom: 20upx;
		border: 0upx;
	}

	.jiazai[plain] {
		border: 0upx;
	}
</style>
