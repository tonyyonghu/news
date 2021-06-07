<template>
	<view class="chuizhi">
		<form @submit="formSubmit" style="width: 100%;">
			<view class="pages">
				<!-- <view class="page_title">注册</view> -->
				<view class="frame" style="border-top: 20upx solid #eee;margin-top:0;">
					<text class="name">姓名</text>
					<input class="name_input" placeholder="请输入姓名" type="text" name="nickname" :value="nickname" />
				</view>
				<view class="frame">
					<text class="name">性别</text>
					<picker class="picker-item" mode="selector" :range="sexList" @change="sexChange" :value="input_sex_value">
						<input class="name_input" placeholder="请选择性别" type="text" name="sex" :value="sexList[input_sex_value]" disabled="true" />
					</picker>
				</view>
				<view class="frame">
					<text class="name">民族</text>
					<picker class="picker-item" mode="selector" :range="NationList" @change="NationChange" :value="input_nation_value_index">
						<input class="name_input" placeholder="请选择民族" type="text" name="nation" disabled="true" :value="input_nation_value" />
					</picker>
				</view>
				<view class="frame">
					<text class="name">籍贯</text>
					<picker class="picker-item" mode="selector" :range="jiguanList" @change="jiguanChange" :value="input_jiguan_value_index">
						<input class="name_input" placeholder="请选择籍贯" type="text" name="jiguan" disabled="true" :value="input_jiguan_value" />
					</picker>
				</view>
				<view class="frame">
					<text class="name">学历</text>
					<picker class="picker-item" mode="selector" :range="educationList" @change="educationChange" :value="input_education_value_index">
						<input class="name_input" placeholder="请选择学历" type="text" name="xueli" disabled="true" :value="input_education_value" />
					</picker>
				</view>
				<view class="frame">
					<text class="name">出生日期</text>
					<picker class="picker-item" mode="date" @change="BirthdayChange" :value="input_Birthday_value">
						<input class="name_input" placeholder="请选择出生日期" type="text" name="birthday" :value="input_Birthday_value"
						 disabled="true" />
					</picker>
				</view>
				<view class="frame">
					<text class="name">手机号码</text>
					<input class="name_input" placeholder="请输入手机号" type="mobile" name="mobile" :value="mobile" />
				</view>
				<button form-type="submit" class="sub">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
	const server = require("../../utils/server");
	export default {
		data() {
			return {
				NationList: [],
				jiguanList: [],
				educationList: [],
				userinfo:[],
				sexList:['保密','男','女'],
				nickname: '',
				mobile: '',
				input_sex_value: '',
				input_nation_value :'',
				input_nation_value_index :'',
				input_jiguan_value : '',
				input_jiguan_value_index : '',
				input_education_value : '',
				input_education_value_index : '',
				input_Birthday_value : '',
			};
		},
		onLoad: function () {
			this.getUserInfo();
		},
		methods:{
			getUserInfo: function(){
				let that = this;
				let userinfo = this.globalData.userInfo
				server.getJSON('/user/regInfo', function (res) {
					if (res.data.status == 1) {
						that.NationList = res.data.result.nationList;//民族
						that.jiguanList = res.data.result.jiguan; //籍贯
						that.educationList = res.data.result.xueli; //学历
						that.input_nation_value_index = that.NationList.indexOf(userinfo.nation.trim());
						that.input_jiguan_value_index = that.jiguanList.indexOf(userinfo.jiguan);
						that.input_education_value_index = that.educationList.indexOf(userinfo.xueli);
						let time = new Date(userinfo.birthday * 1000);
						let str = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate();
						that.input_Birthday_value = str;
						that.nickname =  userinfo.nickname
						that.input_sex_value = userinfo.sex;
						that.input_sex_value_index = userinfo.sex;
						that.input_nation_value = userinfo.nation;
						that.input_jiguan_value = userinfo.jiguan;
						that.input_education_value = userinfo.xueli;
						that.mobile = userinfo.mobile;
					}
				});
			},
			sexChange: function(e){
				let index=e.detail.value;
				this.input_sex_value=index;
			},
			NationChange:function(e){
				let index=e.detail.value;
				this.input_nation_value=this.NationList[index];
			},
			jiguanChange: function (e) {
				let index=e.detail.value;
				this.input_jiguan_value=this.jiguanList[index];
			},
			educationChange: function (e) {
				let index=e.detail.value;
				this.input_education_value=this.educationList[index];
			},
			BirthdayChange:function(e){
				let index=e.detail.value;
				this.input_Birthday_value=index;
			},
			formSubmit: function(e) {
				uni.showLoading({
					title: '保存中',
					mask: true
				});
				e.detail.value.sex = this.sexList.indexOf(e.detail.value.sex);
				e.detail.value.token = this.globalData.token;
				let data = e.detail.value
				server.postJSON('/user/editUserInfo', data,function (res) {
					uni.hideLoading();
					if (res.data.status == 1) {
						uni.showToast({title: "修改成功"})
					}
				},function(){
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style>
	page{
		background: url('../../static/my_background.png');
		background-size: 100%;
	}
	.frame {
		padding-bottom: 30upx;
		flex-direction: row;
		margin: 20upx auto 0;
	}
	.name {
		width: 200upx;
		font-size: 30upx;
		height: 80upx;
		line-height: 80upx;
		text-align: justify;
		text-justify:inter-ideograph;
		margin-right:20upx;
		font-weight:bold;
	}
	.name:after {
		display: inline-block;
		width: 100%;
		content: '';
	}
	
	.name_input {
		min-height:80upx;
		width:350upx;
		border:1px solid #ccc;
		border-radius:15upx;
		padding:0upx 30upx;
		background:white;
	}
	.sub {
		width: 500upx;
		height: 100upx;
		margin: 80upx auto 50upx;
		/* margin-top: 80upx; */
		/* margin-left: 20upx; */
		/* margin-right: 20upx; */
		/* margin-bottom: 50upx; */
		line-height: 100upx;
		background: #DD5147;
		color: #FFFFFF;
	}

</style>
