<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		let that = this;
		//#ifdef APP-PLUS
		/* 5+环境锁定屏幕方向 */
		plus.screen.lockOrientation('portrait-primary'); //锁定
		//#endif

	},
	onShow: function() {
		console.log('App Show');
		let that = this;
		let token = uni.getStorageSync('token');
		console.log(token);
		
		if (token == '') {
			console.log('reLaunch 2 /pages/user/login');
			setTimeout(function() {
			}, 100);
		} else {
			let userInfo = uni.getStorageSync('userInfo');
			console.log(userInfo);
			this.globalData.token = token;
			this.globalData.userInfo = userInfo;
			this.globalData.loginState = true;
		}
		//#ifdef APP-PLUS
		
		setTimeout(function() {
			plus.push.addEventListener('click', function(msg) {
				var payload = msg.payload;
				if (payload.url != '' && payload.url != undefined && payload.url != null) {
					uni.navigateTo({
						url: payload.url
					})
				}
			});
			plus.push.addEventListener('receive', function(msg) {
				console.log('push receive');
				console.log(msg);
			});
		}, 2000);

		//#endif
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
@import './common/uni.css';
page,
view {
	display: flex;
	flex-direction: column;
	font-size: 24upx;
}

page {
	min-height: 100%;
}

page {
	background-color: #f2f2f2;
}
.hide {
	display: none;
}
</style>
