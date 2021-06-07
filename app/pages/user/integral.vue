<template>
	<view class="page">
		<view class="uni-list">
			<block v-for="(value,key) in list" :key="key" >
				    <view class="uni-list-cell" hover-class="uni-list-cell-hover">
				        <view class="uni-triplex-row">
				            <view class="uni-triplex-left">
				                <text class="uni-title uni-ellipsis">+{{value.points}}</text>
				                <text class="uni-text">{{value.desc}}</text>
				                <text class="uni-text-small uni-ellipsis">{{value.create_time}}</text>
				            </view>
				            
				        </view>
				    </view>
			</block>
		</view>
		<view class="uni-padding-wrap uni-common-mt message_loading">
			<uni-load-more :status="status" ></uni-load-more>
		</view>
	</view>
</template>

<script>
const server = require('../../utils/server');
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
components: {
	uniLoadMore;
}
export default {
	data() {
		return {
			list: [],
			status: 'more',
			page: 1,
			contentText: {
				contentdown: '查看更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多'
			}
		};
	},
	onLoad() {
		this.status = 'loading';
		this.initData(this.page);
	},
	onUnload() {
		(this.page = 1), (this.status = 'more');
	},
	onReachBottom() {
		this.setDate(this.page);
	},
	onPullDownRefresh() {
		this.initData(this.page);
	},
	methods: {
		initData(page) {
			if (this.status == 'noMore') {
				return;
			}
			this.status = 'loading';
			let that = this;
			let data = {
				page,
				token: this.globalData.token,
				size: 10
			};
			server.getJSON(
				'/user/integral',
				data,
				function(res) {
					if (res.data.status == 1) {
						that.showLoadMore = 'more';
						that.list = res.data.result;
						if (res.data.result.length < 10) {
							that.status = 'noMore';
						}
						that.page++;
					}
				},
				function(res) {}
			);
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 300);
		},
		setDate(page) {
			if (this.status == 'noMore') {
				return;
			}
			this.status = 'loading';
			let that = this;
			let data = {
				page,
				token: this.globalData.token,
				size: 10
			};
			server.getJSON(
				'/user/integral',
				data,
				function(res) {
					if (res.data.status == 1) {
						that.status = 'more';
						if (res.data.result.length < 10) {
							that.status = 'noMore';
						}
						that.list = that.list.concat(res.data.result);
						that.page++;
					}
				},
				function(res) {}
			);
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 300);
		}
	}
};
</script>

<style>
	page{
		background-color: #FFFFFF;
	}
</style>
