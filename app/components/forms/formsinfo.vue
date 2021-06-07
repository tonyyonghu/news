<template>
	<view class="uni-padding-wrap dj">
		<block v-for="(item, index) in options" :key="index">
			<view class="uni-form-item uni-column">
				<view class="uni-list dj-xe">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">{{ item.title }}</view>
						<view class="uni-list-cell-db">
							<view style="border-radius: 20upx;">
								<image style="width:450upx;" v-if="item.value.type=='image'" :src="item.value.value" mode="aspectFit"></image>
								<rich-text v-else-if="item.value.type=='editor'" :nodes="item.value.value"></rich-text>
								<text v-else>{{ item.value.value }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>
<script>
export default {
	name: 'formsinfo',
	props: {
		color: {
			type: String,
			default: '#dc514c'
		},
		options: Array
	}
};
</script>
<style>
.dj {
	margin-top: 20upx;
}
.uni-icon {
	color: #dc514c;
}
.dj .uni-form-item > input,
.dj .uni-form-item .row,
.dj .dj-xe,
.uni-textarea {
	border-radius: 20upx;
	border: 1upx solid #e0e0e0;
}

.dj .dj-xe {
	/* position: static !important; */
}

/* formsinfo专有样式 */
.dj .dj-xe {
	color: #808080;
}
.dj .dj-xe .uni-list-cell-left {
	width: 128upx;
	text-align: right;
}
.dj .dj-xe .uni-list-cell-db view {
	/* height: 50upx; */
	min-height:50upx;
	width:450upx;
	padding: 15upx 25upx;
	line-height: 50upx;
	font-size: 28upx;
	background: #fff;
	flex: 1;
}
</style>
