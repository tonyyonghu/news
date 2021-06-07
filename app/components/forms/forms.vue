<template>
	<view class="uni-padding-wrap dj">
		<form @submit="formSubmit">
			<block v-for="(item, index) in optionsed" :key="index">
				<view v-if="item.tag == 'search'">
					<view class="uni-form-item uni-column">
						<text>{{item.title}}</text>
						<view class="with-fun row">
							<input class="uni-input" :placeholder="item.placeholder" :value="inputClearValue" @input="clearInput" :name="item.name" />
							<view class="uni-icon uni-icon-clear" v-if="showClearIcon" @click="clearIcon" :style="{ color: color }"></view>
						</view>
					</view>
				</view>
				<view v-if="item.tag == 'input'">
					<view class="uni-form-item uni-column">
						<text>{{item.title}}</text>
						<block v-if="item.type == 'password'">
							<view class="with-fun row">
								<input class="uni-input" :placeholder="item.placeholder" :password="showPassword" :name="item.name" v-model="item.value" />
								<view class="uni-icon uni-icon-eye" :class="[!showPassword ? 'uni-active' : '']" @click="changePassword"></view>
							</view>
						</block>
						<input v-else class="uni-input" :placeholder="item.placeholder" :name="item.name" :type="item.type" v-model="item.value" />
					</view>
				</view>
				<view v-if="item.tag == 'button'">
					<view class="uni-form-item uni-column">
						<button :type="item.type" form-type="submit">{{ item.title }}</button>
					</view>
				</view>
				<view v-if="item.tag == 'datetime'">
					<view class="uni-form-item uni-column">
						<text>{{item.title}}</text>
						<view class="with-fun">
							<ruiDatePicker
							fields="second"
							start="2010-00-00 00:00:00"
							end="2030-12-30 23:59:59"
							:value="item.value"
							@change="bindChange"
							@cancel="bindCancel"
							:form_i="index"
							></ruiDatePicker>
						</view>
						
					</view>
					<input type="hidden" :name="item.name" v-model="item.value" style="display:none;">
				</view>
				
				<view v-if="item.tag == 'radio'">
					<view class="uni-form-item uni-column dj-dx">
						<text>{{item.title}}</text>
						<view class="with-fun2">
							<radio-group :name="item.name" @change="radioChange" :data-index="index">
								<block v-for="(ritem, rindex) in item.list" :key="rindex">
									<label>
										<radio :value="ritem.value" :checked="ritem.checked === true" :color="color" />
										{{ ritem.name }}
									</label>
								</block>
							</radio-group>
						</view>
					</view>
				</view>
				<view v-if="item.tag == 'image'">
					<view class="uni-form-item uni-column" @click="upload(index)">
						<text>{{item.title}}</text>
						<view class="with-fun">
							<text style="margin:10upx auto;">点击上传</text>
							<image style="margin:10upx auto;" :src="path(item.value)" mode="aspectFit"></image>
						</view>
					</view>
					<input type="text" :name="item.name" v-model="item.value" style="display: none;">
				</view>
				<view v-if="item.tag == 'checkbox'">
					<view class="uni-form-item uni-column dj-dx">
						<text>{{item.title}}</text>
						<view class="with-fun2">
							<checkbox-group :name="item.name" @change="checkboxChange" :data-index="index">
								<block v-for="(citem, cindex) in item.list" :key="citem.value">
									<label>
										<checkbox :value="citem.value" :checked="citem.checked === true" :color="color" />
										{{ citem.name }}
									</label>
								</block>
							</checkbox-group>
						</view>
					</view>
				</view>
				<view v-if="item.tag == 'textarea'">
					<view class="uni-form-item uni-column">
						<text>{{item.title}}</text>
						<view class="with-fun uni-textarea"><textarea :placeholder="item.placeholder" v-model="item.value" :name="item.name"/></view>
					</view>
				</view>
				<view v-if="item.tag=='editor'" style="display: none;">
					<view class="uni-form-item uni-column">
						<text>{{item.title}}</text>
						<view class="with-fun">
							<rich-text :nodes="item.value"></rich-text>
						</view>
					</view>
					<input type="text" :name="item.name" v-model="item.value">
				</view>
				<view v-if="item.tag == 'picker'">
					<view class="uni-form-item uni-column">
						<text>{{item.title}}</text>
						<view class="uni-list dj-xe with-fun">
							<view class="uni-list-cell">
								<!-- <view class="uni-list-cell-left">{{ item.title }}</view> -->
								<view class="uni-list-cell-db">
									<picker @change="bindPickerChange" :mode="item.mode" :value="xindex[index]" :range="item.list" range-key="name" :data-index="index" :fields="item.fields">
										<view v-if="item.mode === 'time'" class="uni-input dj-radius">{{ xindex[index] ? xindex[index] : '00:00' }}</view>
										<view v-else class="uni-input dj-radius">{{ item.list[xindex[index]].name }}</view>
									</picker>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</form>
		
	</view>
</template>
<script>
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
export default {
	components: {ruiDatePicker},
	name: 'forms',
	props: {
		color: {
			type: String,
			default: '#dc514c'
		},
		options: Array
	},
	data() {
		return {
			title: 'input',
			showClearIcon: false,
			inputClearValue: '',
			showPassword: true,
			xindex: [],
			optionsed: [],
			value:''
		};
	},
	onReady: function() {
		this.optionsed = this.load();
	},
	methods: {
		bindChange:function(e,index){
			this.optionsed[index].value = e;
		},
		bindCancel:function(e){
			console.log(e);
		},
		upload:function(index){
			uni.chooseImage({
				success: (chooseImageRes) => {
					const tempFilePaths = chooseImageRes.tempFilePaths;
					const uploadTask = uni.uploadFile({
						url: this.$server.apiUrl+'/base/upload', //仅为示例，非真实的接口地址
						filePath: tempFilePaths[0],
						name: 'file',
						formData: {
							'token':this.globalData.token
						},
						success: (uploadFileRes) => {
							let data = JSON.parse(uploadFileRes.data);
							this.optionsed[index].value = data.result.src;
						}
					});
				}
			});
		},
		load: function() {
			const that = this;
			return this.options.filter(function(options, oindex) {
				switch (options.tag) {
					case 'input':
						options.hasOwnProperty('size') ? '' : (options.size = 'default');
						options.hasOwnProperty('type') ? '' : (options.type = 'text');
						options.hasOwnProperty('disabled') ? '' : (options.disabled = false);
						break;
					case 'picker':
						if (!options.hasOwnProperty('mode')) options.mode = 'selector';
						options.hasOwnProperty('range') ? '' : (options.range = '[]');
						options.hasOwnProperty('disabled') ? '' : (options.disabled = false);
						let p = 0;
						if(options.hasOwnProperty('list')){
							for (let i = 0; i < options.list.length; i++) {
								if(options.list[i].checked){
									that.$set(that.xindex, oindex, i);
									p++;
								}
							}
						}
						p === 0 ? that.$set(that.xindex, oindex, 0) : '';
						if(options.mode == 'time'){
							options.hasOwnProperty('fields') ? '' : options.fields = 'day'
						}
						break;
					case 'button':
						break;
					case 'radio':
						break;
					case 'checkbox':
						break;
					case 'textarea':
						break;
					case 'image':
						break;
					default:
				}
				return options.tag;
			});
		},
		reckon:function(){
			
		},
		getEvent: function(e) {
			const list = this.optionsed[e.currentTarget.dataset.index].list;
			let  value = e.target.value, type = this.getType(value);
			type === 'number' ? value = parseInt(value) : '';
			return value;
		},
		getType: function(j) {
			let str = j;
			let type = Object.prototype.toString.call(str),ret;
			switch (type) {
				case '[object Function]':
					ret = 'function';
					break;
				case '[object String]':
					ret = 'string';
					let reg = '0[0-9]:[0-5][0-9]|1[0-9]:[0-5][0-9]|2[0-3]:[0-5][0-9]';
					if (str.match(reg)) {
						ret = 'time'
						break;
					}else if(Number(str) >= 0){
						ret = 'number';
					}

					break;
				case '[object Number]':
					ret = 'number';
					break;
				case '[object Object]':
					ret = 'object';
					break;
				case '[object Array]':
					ret = 'array';
					break;
				default:
					ret = false;
			}
			return ret;
		},
		clearInput: function(event) {
			this.inputClearValue = event.target.value;
			if (event.target.value.length > 0) {
				this.showClearIcon = true;
			} else {
				this.showClearIcon = false;
			}
		},
		clearIcon: function() {
			this.inputClearValue = '';
			this.showClearIcon = false;
		},
		changePassword: function() {
			this.showPassword = !this.showPassword;
		},
		bindPickerChange: function(e) {
			let value = this.getEvent(e);
			this.$set(this.xindex, e.target.dataset.index, value);
		},
		radioChange: function(e) {
			let value = this.getEvent(e);
		},
		checkboxChange: function(e) {
			let value = this.getEvent(e);
		},
		path:function(path){
			if(path){
				return this.$server.apiUrl.substring(0,this.$server.apiUrl.length-4)+path;
			}else{
				return '';
			}
		},
		formSubmit: function(e) {
			let data = e.detail.value;
			if(this.xindex.length > 0){
				for(let i in this.xindex){
					let pv;
					this.optionsed[i].mode != 'time' ? pv = this.optionsed[i].list[this.xindex[i]].value : pv = this.xindex[i];
					this.optionsed[i].name ? this.$set(data, this.optionsed[i].name, pv) : '';
				}
			}
			this.$emit('formSubmit',data);
		}
	}
};
</script>
<style lang="scss">
.uni-icon {
	color: #dc514c;
}
.uni-form-item{
	display: flex;
	flex-direction: row;
	align-items: center;
	text{
		width:100upx;
		text-align: right;
		margin-right:20upx;
	}
	.with-fun{
		width:570upx;
		border-radius: 20upx;
	}
}
.dj .uni-form-item > input,
.dj .uni-form-item .row,
.dj .dj-xe,
.uni-textarea {
	border-radius: 20upx;
	border: 1upx solid #e0e0e0;
}
.dj .uni-form-item .row > input {
	border-radius: 20rpx;
}

.dj .uni-flex.uni-row {
	justify-content: flex-end;
}
.dj .row {
	flex-direction: row;
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
	/* position: static !important; */
}
.dj .uni-input.dj-radius,
.uni-list-cell-left {
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

.dj radio,
.dj checkbox {
	transform: scale(0.7);
}
</style>
