<template>
	<view class="uni-padding-wrap dj">
		<form @submit="formSubmit">
			<view>
				<view class="uni-form-item uni-column"><input class="uni-input" placeholder="请输入姓名" type="text" name="nickname" /></view>
			</view>
			<view>
				<view class="uni-form-item uni-column dj-dx">
					<radio-group name="radio">
						<label>
							<radio value="nan" checked="true" color="#dc514c" />
							男
						</label>
						<label>
							<radio value="nv" color="#dc514c" />
							女
						</label>
					</radio-group>
				</view>
			</view>
			<view>
				<view class="uni-form-item uni-column">
					<view class="uni-list dj-xe">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">选择民族</view>
							<view class="uni-list-cell-db">
								<picker @change="NationChange" :value="index" :range="NationList">
									<input class="uni-input dj-radius" placeholder="请选择民族" type="text" name="nation" disabled="true" :value="input_nation_value" />
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<view class="uni-form-item uni-column">
					<view class="uni-list dj-xe">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">选择籍贯</view>
							<view class="uni-list-cell-db">
								<picker @change="jiguanChange" :value="index" :range="jiguanList">
									<input class="uni-input dj-radius" placeholder="请选择籍贯" type="text" name="jiguan" disabled="true" :value="input_jiguan_value" />
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<view class="uni-form-item uni-column">
					<view class="uni-list dj-xe">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">选择学历</view>
							<view class="uni-list-cell-db">
								<picker @change="educationChange" :value="index" :range="educationList">
									<input class="uni-input dj-radius" placeholder="请选择学历" type="text" name="xueli" disabled="true" :value="input_education_value" />
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<view class="uni-form-item uni-column">
					<view class="uni-list dj-xe">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">出生日期</view>
							<view class="uni-list-cell-db">
								<picker class="picker-item" mode="date" @change="BirthdayChange">
									<input class="uni-input dj-radius" placeholder="请选择出生日期" type="text" name="birthday" :value="input_Birthday_value" disabled="true" />
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<view class="uni-form-item uni-column">
					<view class="uni-list dj-xe">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">选择部门</view>
							<view class="uni-list-cell-db" @click="cascadePopup"><view class="uni-input dj-radius">请选择部门</view></view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<view class="uni-form-item uni-column">
					<view class="uni-list dj-xe">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">党员状态</view>
							<view class="uni-list-cell-db">
								<picker class="picker-item" mode="selector" :range="Party_member_statusList" @change="Party_member_statusChange">
									<input
										class="uni-input dj-radius"
										placeholder="请选择党员状态"
										type="mobile"
										name="party_status"
										:value="input_Party_member_status_value"
										disabled="true"
									/>
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<view class="uni-form-item uni-column"><input class="uni-input" mobile placeholder="请输入手机号" type="mobile" name="mobile" /></view>
			</view>
			<view>
				<view class="uni-form-item uni-column"><input class="uni-input" password placeholder="请输入密码" type="password" password="true" name="new_password" /></view>
			</view>
			<view>
				<view class="uni-form-item uni-column">
					<input class="uni-input" password placeholder="请重复输入密码" type="password" password="true" name="confirm_password" />
				</view>
			</view>
			<view>
				<view class="uni-form-item uni-column"><button type="warn" form-type="submit">注册</button></view>
			</view>
		</form>
		<view class="modal">
			<view class="modal-mask" :class="maskVisual" @click="cascadeDismiss" @touchmove.stop=""></view>
			<view :animation="animationData" class="modal-content">
				<view class="modal-header">
					<text class="modal-confirm" @click="cascadeConfirm">确认</text>
					<text class="modal-title">所在部门</text>
					<text class="modal-close" @click="cascadeDismiss">X</text>
				</view>
				<view class="modal-body">
					<view class="navigation">
						<text class="viewpager-title" :class="[current == 0 ? 'area-selected' : '']" @click="changeCurrent" data-current="0">{{ oneName }}</text>
						<text class="viewpager-title" :class="[current == 1 ? 'area-selected' : '']" @click="changeCurrent" data-current="1">{{ twoName }}</text>
						<text class="viewpager-title" :class="[current == 2 ? 'area-selected' : '']" @click="changeCurrent" data-current="2">{{ threeName }}</text>
					</view>
					<view class="viewpager-divider"></view>
					<swiper class="swiper-area" :current="current" @change="currentChanged">
						<block v-if="oneList.length > 0">
							<swiper-item>
								<scroll-view scroll-y="true" class="viewpager-listview">
									<view v-for="(item, index) in oneList" :key="index" :data-index="index" @click="provinceTapped">
										<text v-if="index == oneIndex" class="area-selected">{{ item.name }}</text>
										<text v-else>{{ item.name }}</text>
									</view>
								</scroll-view>
							</swiper-item>
						</block>
						<block v-if="twoList.length > 0">
							<swiper-item>
								<scroll-view scroll-y="true" class="viewpager-listview">
									<view v-for="(item, index) in twoList" :key="index" :data-index="index" @click="cityTapped">
										<text v-if="index == twoIndex" class="area-selected">{{ item.name }}</text>
										<text v-else>{{ item.name }}</text>
									</view>
								</scroll-view>
							</swiper-item>
						</block>
						<block v-if="threeList.length > 0">
							<swiper-item>
								<scroll-view scroll-y="true" class="viewpager-listview">
									<view v-for="(item, index) in threeList" :key="index" :data-index="index" @click="regionTapped">
										<text v-if="index == threeIndex" class="area-selected">{{ item.name }}</text>
										<text v-else>{{ item.name }}</text>
									</view>
								</scroll-view>
							</swiper-item>
						</block>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const server = require('../../utils/server');

export default {
	data() {
		return {
			NationList: [
				'汉族',
				'壮族',
				'满族',
				'回族',
				'苗族',
				'维吾尔族',
				'土家族',
				'彝族',
				'蒙古族',
				'藏族',
				'布依族',
				'侗族',
				'瑶族',
				'朝鲜族',
				'白族',
				'哈尼族',
				'哈萨克族',
				'黎族',
				'傣族',
				'畲族',
				'傈僳族',
				'仡佬族',
				'东乡族',
				'高山族',
				'拉祜族',
				'水族',
				'佤族',
				'纳西族',
				'羌族',
				'土族',
				'仫佬族',
				'锡伯族',
				'柯尔克孜族',
				'达斡尔族',
				'景颇族',
				'毛南族',
				'撒拉族',
				'布朗族',
				'塔吉克族',
				'阿昌族',
				'普米族',
				'鄂温克族',
				'怒族',
				'京族',
				'基诺族',
				'德昂族',
				'保安族',
				'俄罗斯族',
				'裕固族',
				'乌孜别克族',
				'门巴族',
				'鄂伦春族',
				'独龙族',
				'塔塔尔族',
				'赫哲族',
				'珞巴族'
			],
			input_nation_value: '',
			input_jiguan_value: '',
			input_education_value: '',
			input_Party_member_status_value: '',
			Party_member_statusList: ['正式党员', '预备党员', '入党积极分子'],
			jiguanList: [],
			educationList: [],
			input_Birthday_value: '',
			input_Join_the_party_value: '',
			input_sex_value: '',
			sexList: ['男', '女'],
			// 申请入党时间状态
			apply_time_status: 0,
			input_join_apply_time_value: '',
			departmentList: [],
			maskVisual: 'hidden',
			current: 0,
			oneList: [],
			oneIndex: -1,
			oneName: '请选着',
			twoList: [],
			twoIndex: -1,
			threeList: [],
			twoName: '',
			threeIndex: -1,
			threeName: '',
			animationData: '',
			department: '',
			department_id: 0
		};
	},

	onLoad: function() {
		let that = this;
		this.getRegInfo();
		this.getDepartment(0, function(result) {
			that.oneList = result;
		});
	},

	methods: {
		formSubmit: function(e) {
			console.log('formsubmit');
			console.log(e);
			console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
			let nickname = e.detail.value.nickname;
			let sex = e.detail.value.sex;
			let nation = e.detail.value.nation;
			let jiguan = e.detail.value.jiguan;
			let education = e.detail.value.xueli;
			let birthday = e.detail.value.birthday;
			let join_time = e.detail.value.join_time;
			// let work_unit = e.detail.value.work_unit;
			let department_id = this.department_id;
			let mobile = e.detail.value.mobile;
			let party_status = e.detail.value.party_status;
			let details = e.detail.value.details;
			let new_password = e.detail.value.new_password;
			let confirm_password = e.detail.value.confirm_password;
			let apply_time = e.detail.value.apply_time;
			if (
				nickname == '' ||
				sex == '' ||
				nation == '' ||
				jiguan == '' ||
				education == '' ||
				birthday == '' ||
				(join_time == '' && party_status == '正式党员') ||
				department_id == 0 ||
				mobile == '' ||
				party_status == '' ||
				// details == '' ||
				new_password == '' ||
				confirm_password == '' ||
				(apply_time == '' && party_status != '正式党员')
			) {
				if (nickname == '') {
					var content = '请输入姓名';
				} else if (sex == '') {
					var content = '请输入性别';
				} else if (nation == '') {
					var content = '请输入民族';
				} else if (jiguan == '') {
					var content = '请输入籍贯';
				} else if (education == '') {
					var content = '请输入学历';
				} else if (birthday == '') {
					var content = '请输入出生日期';
				} else if (join_time == '' && party_status == '正式党员') {
					var content = '请输入入党时间';
				} else if (department_id == '') {
					var content = '请选择部门';
				} else if (mobile == '') {
					var content = '请输入手机号码';
				} else if (party_status == '') {
					var content = '请选择党员状态';
				} else if (apply_time == '' && party_status != '正式党员') {
					var content = '请填写申请入党时间';
					// } else if (details == '') {
					// 	var content = '请输入详细资料';
				} else if (new_password == '') {
					var content = '请输入密码';
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
					title: '提交中',
					mask: true
				});
				if (sex == '男') {
					sex = 1;
				} else {
					sex = 2;
				}
				if (party_status == '正式党员') {
					party_status = 1;
				} else if (party_status == '预备党员') {
					party_status = 2;
				} else {
					party_status = 3;
				}
				let that = this;
				let data = {
					nickname,
					sex,
					nation,
					jiguan,
					xueli: education,
					birthday,
					join_time,
					department_id,
					mobile,
					party_status,
					// details,
					new_password,
					confirm_password,
					apply_time
				};
				server.postJSON(
					'/User/reg',
					data,
					function(res) {
						console.log(JSON.stringify(res));
						uni.hideLoading();
						if (res.data.status == 1) {
							uni.clearStorage();
							uni.showToast({
								title: '注册成功',
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
		// 判断选择民族那一项
		NationChange: function(e) {
			console.log(e);
			let index = e.detail.value;
			console.log(this.NationList[index]);
			this.input_nation_value = this.NationList[index];
		},

		// 记录选中的籍贯
		jiguanChange: function(e) {
			let index = e.detail.value;
			this.input_jiguan_value = this.jiguanList[index];
		},

		// 记录选中的学历
		educationChange: function(e) {
			let index = e.detail.value;
			this.input_education_value = this.educationList[index];
		},

		// 党员状态
		Party_member_statusChange: function(e) {
			console.log(e);
			let index = e.detail.value;
			// 非正式党员 选项,就显示申请入党时间选项.
			if (index == 0) {
				this.apply_time_status = 1;
			} else {
				this.apply_time_status = 2;
			}
			// 清空党员状态时间和申请入党时间
			this.input_Join_the_party_value = '';
			this.input_join_apply_time_value = '';
			console.log(this.Party_member_statusList[index]);
			this.input_Party_member_status_value = this.Party_member_statusList[index];
		},
		// 选择出生日期
		BirthdayChange: function(e) {
			console.log(e);
			let index = e.detail.value;
			console.log(index);
			this.input_Birthday_value = index;
		},
		// 选择入党时间
		Join_the_partyChange: function(e) {
			console.log(e);
			let index = e.detail.value;
			console.log(index);
			this.input_Join_the_party_value = index;
		},
		// 选择性别
		sexChange: function(e) {
			console.log(e);
			let index = e.detail.value;
			console.log(index);
			this.input_sex_value = this.sexList[index];
		},
		// 申请入党时间
		join_apply_time: function(e) {
			console.log(e);
			let index = e.detail.value;
			console.log(index);
			this.input_join_apply_time_value = index;
		},

		getRegInfo: function() {
			let that = this;
			server.getJSON('/user/regInfo', function(res) {
				if (res.data.status == 1) {
					that.jiguanList = res.data.result.jiguan;
					that.educationList = res.data.result.xueli;
				}
			});
		},

		getDepartment: function(pid, cb) {
			server.getJSON('/user/getDepartmentList', { parent_id: pid }, function(res) {
				if (res.data.status == 1) {
					cb(res.data.result);
				}
			});
		},

		cascadePopup: function() {
			console.log('cascadePopup');
			var animation = uni.createAnimation({
				duration: 500,
				timingFunction: 'ease-in-out'
			});
			this.animation = animation;
			animation.translateY(-285).step();
			this.animationData = this.animation.export();
			this.maskVisual = 'show';
		},

		provinceTapped: function(e) {
			console.log('provinceTapped');
			var index = e.currentTarget.dataset.index;
			this.oneName = this.oneList[index].name;
			this.threeName = '';
			this.oneIndex = index;
			(this.twoIndex = -1), (this.threeIndex = -1), (this.threeList = []);
			var that = this;
			// getDepartment方法是访问网络请求数据，网络访问正常则一个回调function(area){}
			this.getDepartment(this.oneList[index].id, function(result) {
				that.twoName = '请选择';
				that.twoList = result;
				// 确保生成了数组数据再移动swiper
				that.current = 1;
			});
		},

		cityTapped: function(e) {
			console.log('cityTapped');
			var index = e.currentTarget.dataset.index;
			this.twoIndex = index;
			this.twoName = this.twoList[index].name;
			this.threeIndex = -1;
			this.threeName = '';
			var that = this;
			// getDepartment方法是访问网络请求数据，网络访问正常则一个回调function(area){}
			this.getDepartment(this.twoList[index].id, function(result) {
				var array = [];
				that.threeName = '请选着';
				that.threeList = result;
				// 确保生成了数组数据再移动swiper
				that.current = 2;
			});
		},

		regionTapped: function(e) {
			console.log('regionTapped');
			var index = e.currentTarget.dataset.index;
			this.threeIndex = index;
			this.threeName = this.threeList[index].name;
			let that = this;
			var areaSelectedStr = that.oneName + '/' + that.twoName + '/' + that.threeName;
			this.department_id = this.threeList[index].id;
			that.department = areaSelectedStr;
			that.cascadeDismiss();
		},

		cascadeDismiss: function() {
			console.log('cascadeDismiss');
			this.animation.translateY(285).step();
			(this.animationData = this.animation.export()), (this.maskVisual = 'hidden');
		},

		currentChanged: function(e) {
			console.log('currentChanged');
			// swiper滚动使得current值被动变化，用于高亮标记
			var current = e.detail.current;
			this.current = current;
		},

		changeCurrent: function(e) {
			console.log('changeCurrent');
			// 记录点击的标题所在的区级级别
			var current = e.currentTarget.dataset.current;
			this.current = current;
		},

		cascadeConfirm: function(e) {
			let that = this;
			var areaSelectedStr = '';
			let department_id = 0;
			if (that.oneIndex > -1) {
				areaSelectedStr = that.oneName;
				department_id = this.oneList[this.oneIndex].id;
			}
			if (that.oneIndex > -1 && that.twoIndex > -1) {
				areaSelectedStr = areaSelectedStr + '/' + that.twoName;
				department_id = this.twoList[this.twoIndex].id;
			}
			if (that.oneIndex > -1 && that.twoIndex > -1 && that.threeIndex > -1) {
				areaSelectedStr = areaSelectedStr + '/' + that.threeName;
				department_id = this.threeList[this.threeIndex].id;
			}
			that.department_id = department_id;
			that.department = areaSelectedStr;
			that.cascadeDismiss();
		}
	}
};
</script>

<style>
	page{
		position: relative;
	}
/*弹窗主体*/
.modal-content {
	position: fixed;
	bottom: -285px;
	left: 0;
	width: 100%;
	height: 285px;
	margin-top: 5px;
	background: #fff;
	z-index: 999;
	flex-direction: column;
}

/*遮罩层*/

.modal-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #000;
	opacity: 0.8;
	z-index: 99;
}

/*弹窗头部*/

.modal-header {
	margin: 2px 0;
	font-size: 16px;
	color: #666;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	line-height: 30px;
}

/*所在地区字样*/

.modal-title {
	text-align: center;
	/* width: 100%; */
}

/*关闭按钮*/

.modal-close {
	padding-right: 30upx;
}

/* 确认按钮 */
.modal-confirm {
	/* width: 50upx; */
	padding-left: 30upx;
}

.modal-body {
	font-size: 14px;
	flex-direction: column;
}

/*每级地区标题*/

.viewpager-title {
	padding: 0 10px;
	line-height: 30px;
}

/*分隔线*/

.viewpager-divider {
	width: 100%;
	height: 1px;
	background: #ccc;
}

/*左右滑动控件*/

.swiper-area {
	height: 220px;
}

/*地址列表ListView容器*/

.viewpager-listview {
	padding-top: 5px;
	height: 100%;
}

/*每行地址item项*/

.viewpager-listview view {
	line-height: 30px;
	padding: 0 10px;
}

/*高亮当前所选地区*/

.area-selected {
	color: red;
}

/*初始隐藏*/

.hidden {
	display: none;
}

/*运行时显示*/

.show {
	display: block;
}

.navigation {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	word-wrap: break-word;
	word-break: normal;
}

.name_input_text {
	display: flex;
	align-items: center;
}

/* 纯净样式 */
.dj .uni-form-item > input,
.dj .dj-xe {
	border-radius: 20upx;
	border: 1upx solid #e0e0e0;
}
.dj .uni-flex.uni-row {
	justify-content: flex-end;
}

.dj .uni-flex.uni-row .flex-item {
	margin-left: 20upx;
	color: #007aff;
}
.dj .uni-input.dj-radius {
}
.dj .uni-form-item .submit {
	width: 100%;
	font-size: 40upx;
	line-height: 85upx;
}
.dj .uni-textarea,
.dj-xe,
.dj-radius {
	border-radius: 20upx;
}
.dj .uni-form-item textarea {
	border: none;
}
.dj .dj-xe {
	position: static !important;
}
.dj .uni-input.dj-radius {
	color: #808080;
}
.dj .uni-form-item.uni-column button {
	width: 100%;
	font-size: 40upx;
	line-height: 85upx;
	border-radius: 20upx;
}
.dj .dj-dx {
	flex-wrap: wrap;
}
.dj .dj-dx label {
	overflow: hidden;
	display: inline-block;
}
.dj .dj-dx label radio {
	transform: scale(0.7);
}
</style>
