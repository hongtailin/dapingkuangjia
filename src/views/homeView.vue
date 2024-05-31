<template>
	<div class="home">
        <mainMap></mainMap>
		<div class="main columnFlex">
            <topHead></topHead>
            <div class="content fullHeight">
                <div class="side left columnFlex fullHeight">
                </div>
                <div class="center">
                </div>
                <div class="side right">
                </div>
            </div>
        </div>
	</div>
</template>

<script>
import topHead from '@/components/top/topHead.vue'
import mainMap from '@/components/map/mainMap.vue'


export default {
    name: "homeView",
    components: {
        mainMap,
        topHead
    },
    watch: {
    },
};
</script>

<style lang="scss" scoped>
.home {
	height: 100%;
    width: 100%;
    color: #fff;
    .main {
        width: 100%;
        height: 100%;
        position: absolute;
        pointer-events: none;
        
        .content {
            padding: 0 20px;
            margin-bottom: 20px;
            display: flex;
            .side {
                width: 550px;
                flex-shrink: 0;
            }
            .center {
                flex: 1;
                margin: 20px 30px;
            }
        }
    }
}

</style>
