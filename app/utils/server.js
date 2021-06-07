var apiUrl = 'http://huobi.xia666.top/api';
function __args() {
	// console.log(uni);
	// console.log(uni.globalData);
	var setting = {};
	if (arguments.length === 1 && typeof arguments[0] !== 'string') {
		setting = arguments[0];
	} else {
		setting.url = arguments[0];
		if (typeof arguments[1] === 'object') {
			setting.data = arguments[1];
			setting.success = arguments[2];
			setting.fail = arguments[3];
		} else {
			setting.success = arguments[1];
			setting.fail = arguments[2];
		}
	}
	if (setting.url.indexOf('http://') !== 0) {
		setting.url = apiUrl + setting.url;
	}
	if (typeof(setting.data) == "undefined") {
		setting.data = {};
	};

	//PDO 每次请求都带上token
	setting.complete = function(res) {
		if (res.errMsg.indexOf('timeout') != -1) {
			return false;
		}
		if (res.errMsg.indexOf('request:fail') != -1) {
			uni.showModal({
				title: '提示',
				content: '请求失败，请检查您的网络后重试',
				showCancel: false,
			});
			return false;
		}
		let status = res.data.status;
		if (status != 1) {
			uni.hideLoading();
			uni.showModal({
				title: '提示',
				content: res.data.msg,
				showCancel: false,
				success: function(res) {
					if (status == -100 || status == -101 || status == -102 || status == -103) {
						uni.clearStorage();
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				}
			});
			return;
		}
	}
	return setting;
}

function __json(method, setting) {
	setting.method = method;
	if (method == 'GET') {
		setting.header = {
			'content-type': 'application/json'
		};
	} else {
		setting.header = {
			'content-type': 'application/x-www-form-urlencoded'
			// 'content-type': 'multipart/form-data'
		};
	}
	// console.log(setting);
	uni.request(setting);
}

function dateFormat(ns) {
	// 声明变量。
	var d, s;
	// 创建 Date 对象。
	d = new Date(parseInt(ns) * 1000);
	s = d.getFullYear() + "-";
	s += ("0" + (d.getMonth() + 1)).slice(-2) + "-";
	s += ("0" + d.getDate()).slice(-2) + " ";
	s += ("0" + d.getHours()).slice(-2) + ":";
	s += ("0" + d.getMinutes()).slice(-2) + ":";
	s += ("0" + d.getSeconds()).slice(-2);
	return s;
}

function dateFormat2(ns) {
	// 声明变量。
	var d, s;
	// 创建 Date 对象。
	d = new Date(parseInt(ns) * 1000);
	s = d.getFullYear() + "-";
	s += ("0" + (d.getMonth() + 1)).slice(-2) + "-";
	s += ("0" + d.getDate()).slice(-2) + "";
	return s;
}
/**
 * 检查权限 返回true为通过
 */
function checkPriv(arr, key) {
	console.log('checkPrive arr', arr);
	if (arr === true) return true;
	if (arr === false) return false;
	var low = 0,
		high = arr.length - 1;
	while (low <= high) {
		var mid = parseInt((high + low) / 2);
		if (key == arr[mid]) {
			return true;
		} else if (key > arr[mid]) {
			low = mid + 1;
		} else if (key < arr[mid]) {
			high = mid - 1;
		} else {
			return false;
		}
	}
	return false;
};
module.exports = {
	// ...mapMutations(['ceshi']),
	getJSON: function() {
		__json('GET', __args.apply(this, arguments));
	},
	postJSON: function() {
		__json('POST', __args.apply(this, arguments));
	},
	sendTemplate: function(formId, templateData, success, fail) {
		var app = getApp();
		this.getJSON({
			url: '/WxAppApi/sendTemplate',
			data: {
				rd_session: app.rd_session,
				form_id: formId,
				data: templateData,
			},
			success: success, // errorcode==0时发送成功
			fail: fail
		});
	},
	apiUrl: apiUrl,
	dateFormat: dateFormat,
	dateFormat2: dateFormat2,
	checkPriv: checkPriv
}
