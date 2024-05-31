<template>
	<div class="eventWork fullHeight columnFlex">
		<div class="titleBackground title">老年人信息</div>
		<div class="mainBackground main fullHeight">
			<div class="echart" ref="echart"></div>
		</div>
	</div>
</template>

<script>
const color = [
    "#10D1D3",
    "#9D73F7",
    "#01C2FF",
    "#DCCEA2",
    "#FF3D3D",
    "#F3AE71",
    '#00B67C',
    '#E1E1E1'
];
import { getPie3D, getParametricEquation } from "@/utils/chart.js";
import { getAgedInfo } from "@/api/data";
export default {
    data() {
        return {
            basicData: [],
            list: [],
            echart: null
        };
    },
    created() {
        getAgedInfo().then((res) => {
            this.list = res.data
            this.setLabel();

            this.$nextTick(() => {
                this.initChart();
            });
        });
    },
    mounted() {
        //根据窗口变化自动调节图表大小
        window.addEventListener('resize', () => {
            this.changeSize();
        });
    },
    beforeDestroy () {
        window.removeEventListener('resize', () => {
            this.changeSize();
        });
    },
    methods: {
        // 初始化label样式
        setLabel() {
            this.list.forEach((item, index) => {
                item.value = Number(item.value)
                
                item.itemStyle = {
                    color: color[index],
                };
                item.label = {
                    normal: {
                        show: true,
                        color: color[index],
                        formatter: [
                            "{b|{b}}",
                            "{d|{d}%}",
                        ].join("\n"), // 用\n来换行
                        rich: {
                            b: {
                                color: color[index],
                                fontSize: 16,
                                align: "left",
                                lineHeight: 30
                            },
                            d: {
                                color: '#fff',
                                align: "left",
                                fontSize: 24,
                                lineHeight: 30
                            },
                        },
                        position: 'outer',
                        alignTo: 'labelLine',
                        bleedMargin: 5,
                        distanceToLabelLine: 10,
                    },
                };
                item.labelLine = {
                    normal: {
                        lineStyle: {
                            width: 2,
                            color: color[index],
                            type: 'dotted',
                        },
                        length2: 50
                    },
                };
            });
        },
        // 图表初始化
        initChart () {
            this.initEChart()
        },
        initEChart() {
            this.echart = this.$echarts.init(this.$refs.echart);
            // 传入数据生成 option, 构建3d饼状图, 参数工具文件已经备注的很详细
            let option = getPie3D(this.list, 0.8, 180, 28, 10, 0.5, false, false);
            this.echart.setOption(option);
            // 是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
            option.series.push({
                name: "老年人信息", //自己根据场景修改
                backgroundColor: "transparent",
                type: "pie",
                label: {
                    opacity: 1,
                    fontSize: 13,
                    lineHeight: 20,
                },
                startAngle: -40, // 起始角度，支持范围[0, 360]。
                clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
                radius: ["20%", "50%"],
                center: ["50%", "50%"],
                data: this.list,
                itemStyle: {
                    opacity: 0, //这里必须是0，不然2d的图会覆盖在表面
                },
                labelLine: {
                    showAbove: false,
                    //length: 20, // 视觉引导线第一段的长度
                    length2: 30, // 视觉引导项第二段的长度
                },
            });
            this.echart.setOption(option);
        },
        // 自适应宽高
        changeSize() {
            this.echart.resize()
        },
    },
};
</script>

<style lang="scss" scoped>
.chart {
	height: 100%;
	width: 100%;
}
.title {
	flex-shrink: 0;
	margin-bottom: 2px;
}
.main {
    display: flex;
    .echart {
        width: 100%;
    }
}
</style>