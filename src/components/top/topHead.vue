<template>
	<div class="top eventWork">
		{{ title }}
		<div class="icons">
			<el-tooltip
				class="item"
				effect="dark"
				content="跳转管理端"
				placement="bottom"
			>
				<div
					class="icon skip"
					@click="handleSkipToManagementSystem"
				></div>
			</el-tooltip>
			<el-tooltip
				class="item"
				effect="dark"
				content="退出"
				placement="bottom"
			>
				<div class="icon logout" @click="handleLogout"></div>
			</el-tooltip>
		</div>
	</div>
</template>

<script>
import { logout } from '@/api/login';
import { mapState } from 'vuex'
export default {
    data() {
        return {
            title: process.env.VUE_APP_TITLE
        };
    },
    computed: {
        ...mapState('monitor', ['isShowMonitor'])
    },
    methods: {
        handleLogout () {
            logout().then(() => {
                this.$cookies.remove('Admin-Token');
                this.$router.push('/login');
            });
        },
        handleSkipToManagementSystem () {
            let url = process.env.NODE_ENV == 'development' ? 'http://10.10.5.126:81/yanji_manage/' : 'https://project.windaka.com:19197/yanji_manage/#/'
            window.open(url, '_blank')
        }
    },
};
</script>

<style lang="scss" scoped>
.top {
	flex-shrink: 0;
	background-image: url("@/assets/top.png");
	background-size: 100% 100%;
	height: 90px;
	width: 100%;
	font-family: YouSheBiaoTiHei;
	font-size: 44px;
	text-align: center;
	line-height: 62px;
	position: relative;
	.icons {
		position: absolute;
		top: 10px;
		right: 20px;
		display: flex;
		.icon {
			width: 40px;
			height: 40px;
			background-size: 100% 100%;
			cursor: pointer;
			margin-left: 20px;
		}
		.logout {
			background-image: url(@/assets/logout.png);
		}
		.skip {
			background-image: url(@/assets/skip.png);
		}
	}
}
</style>