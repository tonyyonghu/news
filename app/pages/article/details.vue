<template>
	<view class="pages">
		<view class="title" v-if="info.id>0">
			<text class="title_text">{{info.title}}</text>
			<text class="time">{{info.cat_name}}&nbsp;&nbsp;&nbsp;&nbsp;{{info.create_time}}</text>
			<!-- <view class="">{{info.content}}</view> -->
			<rich-text :nodes="info.content"></rich-text>
		</view>
		<view class="title" v-else></view>
	</view>
</template>

<script>
const server = require('../../utils/server');
export default {
	data() {
		return {
			isLoadPage: undefined,
			info: {},
			article_id:0,
			timeOut:'',
			time:1,
			interval:''
		}
	},
	
	onLoad: function (e) {
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
		let article_id = e.article_id;
		this.article_id = article_id;
		if (article_id <= 0 || article_id == '' || article_id == undefined) {
			uni.hideLoading();
			uni.showModal({
				title: "错误提示",
				content: "缺少参数",
				showCancel: false,
			});
			return;
		}
		this.article_id = article_id
		this.getInfo();
	},
	onUnload:function(){
		this.addPoint();
		clearTimeout(this.timeOut);
		clearInterval(this.interval)
	},
	methods: {
		getInfo: function () {
			let article_id = this.article_id;
			let data = {
				article_id,
				token: this.globalData.token
			};
			server.getJSON('/article/details', data, (res) => {
				if (res.data.status == 1) {
					this.info = res.data.result;
					uni.hideLoading();
					uni.stopPullDownRefresh();
					if(this.info.read_time>0){
						this.checkTime();
					}
					this.interval_time();
				}
			});
		},
		addPoint(){
			this.$server.postJSON(
				'/article/readArticle',
				{
					article_id:this.article_id,
					token:this.globalData.token,
					read_time:this.time
				},
				(res)=>{
					if(res.data.code==1){
						uni.showModal({
							title:'提醒',
							content:res.data.msg
						});
						this.time = this.time - this.info.read_time
					}
				}
			);
		},
		interval_time(){
			this.interval = setInterval(()=>{
				this.time = this.time+1;
				console.log(this.time);
			},1000);
		},
		checkTime(){
			this.timeOut = setTimeout(()=>{
				this.addPoint();
			},this.info.read_time*1000);
		}
	}
}
</script>

<style>
page {
	background: white;
}
.pages {
	padding: 0upx 30upx;
}
.title_text {
	margin: 25upx 0upx;
	font-size: 39upx;
}
.time {
	font-size: 19upx;
	margin: 25upx 0upx;
}
</style>
