/**
 * 绘制3d图
 * @param pieData 总数据
 * @param internalDiameterRatio:透明的空心占比
 */

// 颜色
const color = ['#EAEC00', '#F88C31', '#00B3FF']
export function getPie3D(pieData, internalDiameterRatio) {
    const series = [];
    // 总和
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    const legendData = [];
    const k =
        typeof internalDiameterRatio !== 'undefined'
            ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
            : 1 / 3;

    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i += 1) {
        sumValue += pieData[i].value;

        const seriesItem = {
            name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false,
            },
            pieData: pieData[i],
            pieStatus: {
                selected: false,
                hovered: false,
                k,
            },
            label: {
                show: true
            },

        };
        let itemStyle = {}
        itemStyle.opacity = 0.6
        seriesItem.itemStyle = itemStyle
        series.push(seriesItem);
    }

    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    let sum = series.reduce(function (total, value) {
        return total + value.pieData.value;
    }, 0);
    for (let i = 0; i < series.length; i += 1) {
        endValue = startValue + series[i].pieData.value;

        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = getParametricEquation(
            series[i].pieData.startRatio,
            series[i].pieData.endRatio,
            false,
            false,
            k,
            // 我这里做了一个处理，使除了第一个之外的值都是10
            (series[i].pieData.value / sum * 100).toFixed(0)
        );

        startValue = endValue;

        legendData.push(series[i].name);
    }
    // 准备待返回的配置项，把准备好的 legendData、series 传入。
    const option = {
        labelLine: {
            show: true,
            lineStyle: {
                color: '#fff'
            }
        },
        legend: {
            show: true,
            data: pieData,
            orient: 'vertical',
            right: 10,
            bottom: 'center',
            itemGap: 30,
            textStyle: {
                color: '#A1E2FF'
            },
            type: 'scroll',
            pageIconColor: '#fff',
            pageTextStyle: {
                color: '#fff'
            },
            //icon: 'circle',
            itemWidth: 18,
            itemHeight: 14,
            formatter: (name) => {
                const item = pieData.find((i) => {
                    return i.name === name;
                });
                const p = ((item.value / sum) * 100).toFixed(2);
                return `${item.name}  ${item.value}人  ${p}%`
            }
        },
        // graphic: {
        //     elements: [
        //         {
        //             type: 'image',
        //             z: 10,
        //             style: {
        //                 image: require('@/assets/intelligentMedical/echartsBottom.png'),
        //                 width: 296,
        //                 height: 127,
        //             },
        //             left: 'center',
        //             top: 'center',
        //         },
        //     ],
        // },
        // animation: false,
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(5,28,44,0.9)',
            borderColor: 'rgba(8,145,166,0.7)',
            borderWidth: 1,
            textStyle: {
                color: "#fff",
            },
            formatter: (params) => {
                if (params.seriesName !== 'mouseoutSeries') {
                    return `${
                        params.seriesName
                    }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                        params.color
                    };"></span>${option.series[params.seriesIndex].pieData.value}人
                    <span style="display: inline-block;margin-left: 20px;">${(option.series[params.seriesIndex].pieData.value / sumValue * 100).toFixed(2)}%</span>`;
                }
                return '';
            },
        },
        color: color,
        xAxis3D: {
            min: -1,
            max: 1,
        },
        yAxis3D: {
            min: -1,
            max: 1,
        },
        zAxis3D: {
            min: -1,
            max: 1,
        },
        grid3D: {
            show: false,
            boxHeight: 5,
            top: '-15',
            left: '-100',
            viewControl: {
                // 3d效果可以放大、旋转等，请自己去查看官方配置
                alpha: 30,
                // beta: 30,
                rotateSensitivity: 1,
                zoomSensitivity: 0,
                panSensitivity: 0,
                autoRotate: true,
                distance: 210,
            },
            // 后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果。可以让整个画面更富有质感。
            postEffect: {
                // 配置这项会出现锯齿，请自己去查看官方配置有办法解决
                enable: false,
                bloom: {
                    enable: true,
                    bloomIntensity: 0.1,
                },
                SSAO: {
                    enable: true,
                    quality: 'medium',
                    radius: 2,
                },
                // temporalSuperSampling: {
                //   enable: true,
                // },
            },
        },
        series,
    };
    return option;
}

function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
    // 计算
    const midRatio = (startRatio + endRatio) / 2;

    const startRadian = startRatio * Math.PI * 2;
    const endRadian = endRatio * Math.PI * 2;
    const midRadian = midRatio * Math.PI * 2;

    // 如果只有一个扇形，则不实现选中效果。
    if (startRatio === 0 && endRatio === 1) {
        // eslint-disable-next-line no-param-reassign
        isSelected = false;
    }

    // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    // eslint-disable-next-line no-param-reassign
    k = typeof k !== 'undefined' ? k : 1 / 3;

    // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

    // 计算高亮效果的放大比例（未高亮，则比例为 1）
    const hoverRate = isHovered ? 1.05 : 1;

    // 返回曲面参数方程
    return {
        u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32,
        },

        v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20,
        },

        x(u, v) {
            if (u < startRadian) {
                return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        y(u, v) {
            if (u < startRadian) {
                return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        z(u, v) {
            if (u < -Math.PI * 0.5) {
                return Math.sin(u);
            }
            if (u > Math.PI * 2.5) {
                return Math.sin(u) * h * 0.1;
            }
            // 当前图形的高度是Z根据h（每个value的值决定的）
            return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
        },
    };
}