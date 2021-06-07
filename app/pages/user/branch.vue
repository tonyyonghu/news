<template>
	<block v-if="list != '' && title != ''">
		<view class="page">
			<view class="uni-title" style="align-items: center;">{{title}}</view>
			<view class="uni-list">
				<block v-for="(value,key) in list" :key="key" >
						<view class="uni-media-list msg_list">
							<view class="uni-media-list-logo">
								<image v-if="showImg" :src="value.head_pic" mode="aspectFill"></image>
							</view>
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top">
									<view class="uni-flex uni-row">
										<view class="text msg_title">{{value.nickname}}</view>
										<view class="text msg_time">
											<text>{{value.level.name}}</text>
										</view>
									</view>
								</view>
								<view class="uni-media-list-text-bottom uni-ellipsis">{{value.mobile}}</view>
							</view>
						</view>
				</block>
			</view>
			<view class="uni-padding-wrap uni-common-mt message_loading">
				<uni-load-more :status="status" ></uni-load-more>
			</view>
		</view>
	</block>
	<block v-else>
		<view class="no_branch">您不在任何一个支部里</view>
	</block>
</template>

<script>
	const server = require('../../utils/server');
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: { uniLoadMore },
		data() {
			return {
				title: '',
				page: 1,
				showImg: false,
				list: [],
				status: 'more',
			};
		},
		onLoad() {
			
			this.initData();
		},
		onReachBottom() {
			let aciton = 1;
			this.initData(aciton);
		},
		methods:{
			initData(aciton = 0) {
				if (this.status == 'noMore') return;
				this.status = 'loading';
				let that = this;
				let data = {
					page: this.page,
					token: this.globalData.token,
					size: 10,
				};
				server.postJSON(
					'/user/myBranch',
					data,
					function(res) {
						that.showLoadMore = 'more';
						if (res.data.status == 1) {
							let result = res.data.result;
							if (result != '' && result != null && result != undefined) {
								that.title = result.department.name;
								that.list = result.userList;
								if (result.userList.length < 10){
									that.status = 'noMore';
								}
								if(aciton == 1){
									that.list = that.list.concat(result.userList);
								}
								that.page++;
							}
						}
					},
					function(res) {
						that.showLoadMore = 'more';
					}
				);
				setTimeout(() => {
					this.showImg = true;
				}, 400);
			},
		}
	}
</script>

<style>
	.uni-list{
		background-color: #f2f2f2;
	}
	.msg_list:first-child{
		margin: 0;
	}
	.msg_list{
		margin-top: 10upx;
		background-color: #FFFFFF;
	}
	.msg_list image {
		border-radius: 50%;
	}
	.msg_list .msg_title {
		flex: 1;
	}
	.msg_list .msg_time {
		overflow: hidden;
	}
	.msg_list .msg_time text {
		text-align: right;
	}
	.message_loading {
		margin-bottom: 30upx;
	}
	.message_loading button {
		border: none;
		background-color: #f2f2f2;
		font-size: 20upx;
		color: #007aff;
	}
	.no_branch {
		font-size: 30upx;
		align-items:center;
		margin-top: 50upx;
	}
</style>
