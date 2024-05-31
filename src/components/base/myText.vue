<template>
	<div class="scrollText" ref="outer">
		<div class="st-inner" :class="{ 'st-scrolling': needToScroll }">
			<span class="st-section" ref="inner">{{ text }}</span>
			<span class="st-section" v-if="needToScroll">{{ text }}</span>
			<!-- 加两条是为了滚动的时候实现无缝衔接 -->
		</div>
	</div>
</template>
<script>
/* 
    description: 文本超出宽度，实现走马灯效果
    owner： 洪泰林
    update：2023.4.23
*/
export default {
    data() {
        return {
            needToScroll: false,
            text: "",
        };
    },
    mounted() {
        this.check();
    },
    beforeDestroy() {},
    methods: {
        // 检查当前元素是否需要滚动
        check() {
            this.setText();
            this.$nextTick(() => {
                let flag = this.isOverflow();
                this.needToScroll = flag;
            });
        },

        // 判断子元素宽度是否大于父元素宽度，超出则需要滚动，否则不滚动
        isOverflow() {
            let outer = this.$refs.outer;
            let inner = this.$refs.inner;
            let outerWidth = this.getWidth(outer);
            let innerWidth = this.getWidth(inner);
            return innerWidth > outerWidth;
        },

        // 获取元素宽度
        getWidth(el) {
            let { width } = el.getBoundingClientRect();
            return width;
        },

        // 获取到父组件传过来的内容复传给this.text
        setText() {
            this.text =
				(this.$slots.default &&
					this.$slots.default.reduce(
					    (res, it) => res + it.text,
					    ""
					)) ||
				"";
        },
    },
};
</script>
<style scoped>
.scrollText {
	overflow: hidden;
	white-space: nowrap;
}
.st-inner {
	display: inline-block;
}
.st-scrolling .st-section {
	padding: 0 30px;
}

/* 向左匀速滚动动画 */
.st-scrolling {
	animation: scroll 30s linear infinite;
}

@keyframes scroll {
	0% {
		transform: translate3d(0%, 0, 0);
	}
	100% {
		transform: translate3d(-50%, 0, 0);
	}
}
</style>