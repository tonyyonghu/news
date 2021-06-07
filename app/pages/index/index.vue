<template>
	<view class="wrap">
		<!--搜索-->
		<!-- <view class="search-wrap">
			<input
				type="text"
				value=""
				class="search-inp"
				placeholder="搜索文章/用户"
				placeholder-class="inp-plc"
			/>
			<image class="search-img" src="../../static/search.png" mode=""></image>
		</view> -->
		<!--banner-->
		<swiper
			class="banner-wrap"
			:indicator-dots="false"
			:autoplay="true"
			:circular="true"
			indicator-color="#fff"
			indicator-active-color="#ca0000"
		>
			<swiper-item
				v-for="(item, index) in ad"
				v-bind:key="item.id"
				@click="clickAd(item.id)"
			>
				<view class="banner_view">
					<text class="banner_view_title">{{item.title}}</text>
					<text>{{(index+1)}}/{{ad.length}}</text>
				</view>
				<image
					class="banner-img"
					v-bind:src="item.thumb"
					mode="aspectFill"
				></image>
			</swiper-item>
		</swiper>
		<!--菜单-->
		<view class="menu-wrap">
			<view class="menu-item" v-for="(item, index) in cate" v-bind:key="index" @tap="gotoUrl" :data-url="item.app_link" :data-name="item.name">
				<image
					:src="item.icon"
					class="menu-img"
					mode="aspectFit"
				></image>
				<text class="title">{{item.name}}</text>
			</view>
			<view v-if="cate.length > 3" class="menu-item" @tap="showAllMenuView">
				<image src="/static/all-menu.jpg" class="menu-img" mode="aspectFit"></image>
				<text class="title">全部</text>
			</view>
		</view>
		<view class="uni-padding-wrap article-wrap">
		<!-- <view class="article-wrap"> -->
			<view class="head">
				<view class="v-line"></view>
				<text>热点关注</text>
			</view>
			<view class="article-itme" v-for="(item, index) in list" v-bind:key="index" @click="clickAd(item.id)">
				<view class="body">
					<view class="title">
						{{item.title}}
					</view>
					<image class="img" :src="item.thumb" mode="aspectFill"></image>
				</view>
				<view class="footer">
					<view class="left">
					</view>
					<view class="right">
						<view class="hits">
							<image class="hits-img" src="../../static/eye.png" mode=""></image>
							{{item.click}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-padding-wrap uni-common-mt message_loading"><uni-load-more :status="status"></uni-load-more></view>
		<view
			:class="allMenuView == true ? 'mask active' : 'mask'"
			@tap.stop="hideAllMenuView" @touchmove.stop="hideAllMenuView"
		></view>
		<view :class="allMenuView == true ? 'all-menu active' : 'all-menu'" @touchmove.stop="touchmovestop">
			<view class="menu-wrap">
				<view
					class="menu-item"
					v-for="(item, index) in cateList"
					v-bind:key="index"
					@click="gotoUrl"
					:data-url="item.app_link"
					:data-name="item.name"
				>
					<image
						:src="item.icon"
						class="menu-img"
						mode="aspectFit"
					></image>
					<text class="title">{{item.name}}</text>
				</view>
			</view>
			<image
				@tap.stop="hideAllMenuView"
				src="../../static/hideAllMenuView.png"
				class="hideAllMenuView-img"
				mode=""
			></image>
		</view>
	</view>
</template>

<script>
const server = require('../../utils/server');
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
	components: { uniLoadMore},
	data() {
		return {
			status: 'more',//新loadmove
			// isLoadPage: false,
			allMenuView: false,
			isLoadAd: false,
			isLoadCate: false,
			// isLoadList: false,
			// loading: true,
			// loadingList: true,
			// loadingName: '加载中',
			ad: [],
			cate: [],
			cateList: [],
			list: [],
			page: 1,
		};
	},
	onLoad() {
		console.log(this.globalData.loginState);
		if (this.globalData.loginState) {
			
			this.getAdList();
			this.getCate();
			this.getList();

		} else {
			uni.reLaunch({
				url: '/pages/user/login'
			});
		}
	},
	
	onPullDownRefresh: function () {
		this.page = 1,
		this.getAdList(1);
		this.getCate(1);
		this.getList(1);
	},
	
	onReachBottom: function () {
		if (this.status == 'noMore') return;
		this.getList()
	},
	
	methods: {
		gotoUrl: function(e) {
			let url = e.currentTarget.dataset.url;
			let name = e.currentTarget.dataset.name;
			if (url.indexOf('?') != -1) {
				url = url + '&name=' + name;
			} else {
				url = url + '?name=' + name;
			} 
			uni.navigateTo({
				url: url
			});
		},
		showAllMenuView: function() {
			this.allMenuView = true;
		},
		hideAllMenuView: function() {
			this.allMenuView = false;
		},
		touchmovestop: function() {
		},
		
		// 获取热门前5条文章
		getAdList: function (action = 0) {
			console.log('getAdList');
			let that = this;
			let data = {
				token: this.globalData.token
			};
			uni.showLoading({title: '加载中',mask: true})
			server.getJSON('/news/list', data, function (res) {
				if (res.data.status == 1) {
					if(action) that.ad = [];
					that.ad = res.data.result;
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
			});
		},
		
		// 获取栏目列表
		getCate: function (action = 0) {
			console.log('getCate');
			let that = this;
			let data = {
				token: this.globalData.token
			};
			uni.showLoading({title: '加载中',mask: true})
			server.getJSON('/news/list', data, function (res) {
				if (res.data.status == 1) {
					let result = res.data.result;
					that.cateList = result;
					if(action) that.cate = [];
					for (let i = 0; i < 4;i++) {
						if(result[i]) that.cate.push(result[i]);
					}
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
			});
		},
		
		// 获取热门列表
		getList: function (action = 0) {
			console.log('getList');
			let that = this;
			let data = {
				page:that.page,
				token: this.globalData.token
			};
			uni.showLoading({title: '加载中',mask: true})
			server.getJSON('/index/getHotArticleList', data, function (res) {
				if (res.data.status == 1) {
					let result = res.data.result;
					if(action) that.list = [];
					for (let i in result) {
						that.list.push(result[i]);
					}
					if (result.length < 10) that.status = 'noMore';
					uni.hideLoading();
					uni.stopPullDownRefresh();
					that.page++;
				}
			});
		},
		
		clickAd: function (article_id) {
			if (article_id <= 0 && article_id == '') {
				return false;
			}
			console.log(article_id);
			uni.navigateTo({
				url: '/pages/article/details?article_id='+article_id
			})
		}
	}
};
</script>

<style>
/**搜索**/
.search-wrap {
	padding: 0 15upx 20upx;
	position: relative;
}
.search-inp {
	border: 1px solid #cccccc;
	border-radius: 10upx;
	line-height: 62upx;
	height: 62upx;
	text-align: center;
	background-color: #ffffff;
	font-size: 26upx;
}
.search-inp .inp-plc {
	color: #e93129;
	font-size: 26upx;
	line-height: 1;
}
.search-img {
	width: 26upx;
	height: 26upx;
	display: block;
	position: absolute;
	left: 255upx;
	top: 20upx;
}
/**banner**/
.banner-wrap {
	width: 750upx;
	height: 400upx;
}
.banner-img {
	width: 750upx;
	height: 400upx;
}
/**菜单**/
.menu-wrap {
	background-color: #ffffff;
	flex-direction: row;
	flex-wrap: wrap;
	padding-top: 20upx;
	align-content: flex-start;
}
.menu-item {
	width: 150upx;
	font-size: 26upx;
	line-height: 1.5;
	margin-bottom: 25upx;
	text-align: center;
	font-weight: bold;
	flex: 1;
}
.menu-img {
	width: 103upx;
	height: 103upx;
	display: block;
	margin: 0 auto 15upx;
	border-radius: 50%;
}
/**提醒**/
.remind-wrap {
	justify-content: space-around;
	background-color: #ffffff;
	margin-top: 15upx;
}
.remind-wrap .head {
	border-bottom: 1px solid #cccccc;
	text-align: center;
	line-height: 74upx;
	font-size: 34upx;
	font-weight: bold;
	margin: 0 15upx;
}
.remind-wrap .body {
	flex-direction: row;
	justify-content: space-around;
}
.remind-item {
	width: 100upx;
	position: relative;
	margin: 25upx;
}
.remind-img {
	width: 54upx;
	height: 54upx;
	display: block;
	margin: 20upx auto;
}
.remind-wrap .title {
	text-align: center;
	color: #b0b0b0;
}
.remind-wrap .active .title {
	text-align: center;
	color: #e93129;
}
.remind-wrap .badge {
	display: block;
	width: 26upx;
	height: 26upx;
	text-align: center;
	font-size: 20upx;
	line-height: 26upx;
	color: #ffffff;
	background-color: #e93129;
	border-radius: 50%;
	position: absolute;
	top: 0;
	right: 0;
}

/**文章**/
.article-wrap {
	background-color: #ffffff;
}
.article-wrap .head {
	flex-direction: row;
	font-size: 28upx;
	font-weight: bold;
	line-height: 74upx;
	height: 74upx;
	border-bottom: 1px solid #eee;
}
.article-wrap .v-line {
	background-color: #ffae00;
	border-radius: 5upx;
	width: 10upx;
	height: 30upx;
	margin-right: 16upx;
	display: inline-block;
	align-self: center;
}
.article-itme {
	padding: 20upx 0;
	border-bottom: 1px solid #eee;
}
.article-itme:last-child {
	border-bottom: 0;
}
.article-itme .body {
	flex-direction: row;
}
.article-itme .title {
	flex: 1;
	font-size: 28upx;
	line-height: 46upx;
	font-weight: bold;
}
.article-itme .img {
	width: 260upx;
	height: 180upx;
	display: block;
	margin-left: 30upx;
}
.article-itme .footer {
	flex-direction: row;
	justify-content: space-between;
	line-height: 26upx;
	color: #999999;
	margin-top: 20upx;
}
.article-itme .footer view {
	flex-direction: row;
}
.top-lable {
	color: #e9342b;
	margin-right: 16upx;
}
.lable {
	color: #e9342b;
	margin-right: 16upx;
}
.category-lable {
	margin-right: 16upx;
}
.top-img {
	width: 22upx;
	height: 26upx;
	align-self: center;
	margin-right: 15upx;
}
.hits-img {
	width: 33upx;
	height: 24upx;
	align-self: center;
	margin: 0 15upx 0 0;
}
.comment-img {
	width: 26upx;
	height: 24upx;
	align-self: center;
	margin: 0 15upx 0 35upx;
}

/**load**/
.load-view {
	margin: 20upx 0 40upx;
	border: 0upx;
	color: #999999;
	line-height: 1;
	font-size: 24upx;
}

.load-view[plain] {
	border: 0upx;
	color: #999999;
}

/**全部功能**/
.mask {
	position: fixed;
	left: 0;
	width: 100%;
	height: 0;
}
.mask.active {
	height: 100%;
	background:#9A9A9A;
	opacity:0.5;
}
.all-menu {
	max-height: 960upx;
	border-top-left-radius: 20upx;
	border-top-right-radius: 20upx;
	position: fixed;
	width: 100%;
	left: 0;
	bottom: -960upx;
	transition: all 0.3s;
	background-color: #ffffff;
}
.all-menu .menu-wrap {
	min-height: 600upx;
	height: 100%;
}
.all-menu.active {
	bottom: 0;
}
.all-menu .menu-item {
	width: 187upx;
}
.hideAllMenuView-img {
	width: 126upx;
	height: 69upx;
	margin: 10upx auto 44upx;
}

.banner_view{
	color:white;
	background:#000000;
	height:60upx;
	width:100%;
	position:absolute;
	bottom:0;
	opacity:0.5;
	z-index:99999;
	line-height:60upx;
	flex-direction: row;
}
.banner_view_title {
	margin: 0upx 30upx;
	width: 85%;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	text-overflow: ellipsis;
	overflow: hidden;
}

.message_loading {
	margin-bottom: 30upx;
}

</style>
