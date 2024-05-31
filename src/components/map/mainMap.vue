<template>
	<div id="map"></div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { getMapData, getMapRangeData } from "@/api/data";
import { mapMutations } from "vuex";
window.AMapSecurityConfig = {
    securityJsCode: "d8080b6e538307bf655793d8d8e57d0d",
};
export default {
    data() {
        return {
            map: null,
            AMap: null,
            list: {},
            infoWindow: null,
            allMarkers: [],
            range: []
        };
    },
    created() {
        getMapData().then((res) => {
            this.list = res.data;

            this.setMarkers();
        });

        getMapRangeData().then(res => {
            this.range = res.data[0].range.split(';')
            
            this.setPolygon();
        })
    },
    mounted() {
        this.initMap();

        window.handleClick = this.handleClick;
    },
    beforeDestroy () {
        this.map.clearMap();
        this.map.destroy( );
    },
    methods: {
        ...mapMutations("monitor", ["SET_IS_SHOW_MONITOR", "SET_MONITOR_LIST"]),
        initMap() {
            AMapLoader.load({
                key: "4ed5f4145f34c7894a7a8dac84a105bf",
                version: "2.0",
                plugins: [],
            }).then((AMap) => {
                this.AMap = AMap;
                this.map = new this.AMap.Map("map", {
                    viewMode: "2D",
                    resizeEnable: true, //是否监控地图容器尺寸变化
                    mapStyle: "amap://styles/darkblue",
                    zoom: 12, //级别
                    center: [129.503602, 42.955051], //中心点坐标
                });
                this.map.on('complete', () => {
                    // 地图图块加载完成后触发
                    this.setMarkers();
    
                    this.setPolygon();
                });


            });
        },
        setMarkers() {
            if (Object.keys(this.list).length == 0 || !this.map) {
                return
            }
            // 养老服务中心
            this.list["养老服务中心"].forEach((item) => {
                if (item.lnglat) {
                    let marker = new this.AMap.Marker({
                        icon: require("@/assets/service.png"),
                        position: item.lnglat.split(","),
                        offset: new this.AMap.Pixel(0, 0), // 设置点标记偏移量
                        anchor: "bottom-center", // 设置锚点方位
                    });
    
                    marker.data = item;
                    marker.on("click", (e) => {
                        //自定义点击弹窗
                        this.setInfoWindow(e, "养老服务中心");
                    });
                    this.map.add(marker);
                    this.allMarkers.push(marker);
                }
            });
            // 养老机构
            this.list["养老机构"].forEach((item) => {
                if (item.lnglat) {
                    let marker = new this.AMap.Marker({
                        icon: require("@/assets/institution.png"),
                        position: item.lnglat.split(","),
                        offset: new this.AMap.Pixel(0, 0), // 设置点标记偏移量
                        anchor: "bottom-center", // 设置锚点方位
                    });
    
                    marker.data = item;
                    marker.on("click", (e) => {
                        //自定义点击弹窗
                        this.setInfoWindow(e, "养老机构");
                    });
                    this.map.add(marker);
                    this.allMarkers.push(marker);
                }
            });
            // 民膳食堂
            this.list["民膳食堂"].forEach((item) => {
                if (item.lnglat) {
                    let marker = new this.AMap.Marker({
                        icon: require("@/assets/food.png"),
                        position: item.lnglat.split(","),
                        offset: new this.AMap.Pixel(0, 0), // 设置点标记偏移量
                        anchor: "bottom-center", // 设置锚点方位
                    });
    
                    marker.data = item;
                    marker.on("click", (e) => {
                        //自定义点击弹窗
                        this.setInfoWindow(e, "民膳食堂");
                    });
                    this.map.add(marker);
                    this.allMarkers.push(marker);
                }
            });

            // 设置视角
            //this.map.setFitView(this.allMarkers);
        },
        /* eslint-disable */
		setInfoWindow(e, from) {
			let data = e.target.data;
			let tmpContent = "";
			if (from == "养老服务中心") {
				tmpContent = `
                    <div class="columnFlex mainBackground" style="padding: 20px; width: 300px; line-height: 30px;">
                        <div><span style="color: #A8D6FF">服务中心名称：</span> ${
							data.name || ""
						}</div>
                        <div><span style="color: #A8D6FF">中心地址：</span> ${
							data.address || ""
						}</div>
                        <div><span style="color: #A8D6FF">联系电话：</span> ${
							data.phone || ""
						}</div>
                        <div><span style="color: #A8D6FF">星级等级：</span> ${
							data.level || ""
						}</div>
                        <div style="position: relative;">
                            <span style="color: #A8D6FF">摄像头数量：</span> 
                            ${data.equipmentNumber || ""} 
                            <span onclick="handleClick('${from}')" style="cursor: pointer; color: #00FFF3; position: absolute; right: 0;">查看视频</span>
                        </div>
                        <div>
                            <span style="color: #A8D6FF">可提供上门服务：</span> 
                            <div title="${data.homeService || ""}" style="display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 3;
                            overflow: hidden;
                            -webkit-box-orient: vertical;
                            ">${data.homeService || ""}</div>
                        </div>
                        <div>
                            <span style="color: #A8D6FF">门头照片：</span>
                            ${
								data.picture
									? `<img src=\"${
											process.env.VUE_APP_TARGET +
											data.picture
									  }\" style="width: 80px; height: 80px;" alt="暂无图片">`
									: ""
							}
                        </div>
                    </div>
                    `;
			} else if (from == "养老机构") {
				tmpContent = `
                    <div class="columnFlex mainBackground" style="padding: 20px; width: 300px; line-height: 30px;">
                        <div><span style="color: #A8D6FF">养老机构名称：</span> ${
							data.name || ""
						}</div>
                        <div><span style="color: #A8D6FF">中心地址：</span> ${
							data.address || ""
						}</div>
                        <div><span style="color: #A8D6FF">联系电话：</span> ${
							data.phone || ""
						}</div>
                        <div><span style="color: #A8D6FF">星级等级：</span> ${
							data.level || ""
						}</div>
                        <div><span style="color: #A8D6FF">床位数：</span> ${
							data.bedNumber || ""
						}</div>
                        <div><span style="color: #A8D6FF">入住老人数：</span> ${
							data.personNumber || ""
						}</div>
                        <div style="position: relative;">
                            <span style="color: #A8D6FF">摄像头数量：</span> 
                            ${data.equipmentNumber || ""} 
                            <span onclick="handleClick('${from}')" style="cursor: pointer; color: #00FFF3; position: absolute; right: 0;">查看视频</span>
                        </div>
                        <div>
                            <span style="color: #A8D6FF">门头照片：</span>
                            ${
								data.picture
									? `<img src=\"${
											process.env.VUE_APP_TARGET +
											data.picture
									  }\" style="width: 80px; height: 80px;" alt="暂无图片">`
									: ""
							}
                        </div>
                    </div>
                    `;
			} else if (from == "民膳食堂") {
				tmpContent = `
                    <div class="columnFlex mainBackground" style="padding: 20px; width: 300px; line-height: 30px;">
                        <div><span style="color: #A8D6FF">民膳食堂名称：</span> ${
							data.name || ""
						}</div>
                        <div><span style="color: #A8D6FF">中心地址：</span> ${
							data.address || ""
						}</div>
                        <div><span style="color: #A8D6FF">联系电话：</span> ${
							data.phone || ""
						}</div>
                        <div><span style="color: #A8D6FF">星级等级：</span> ${
							data.level || ""
						}</div>
                        <div style="position: relative;">
                            <span style="color: #A8D6FF">摄像头数量：</span> 
                            ${data.equipmentNumber || ""} 
                            <span onclick="handleClick('${from}')" style="cursor: pointer; color: #00FFF3; position: absolute; right: 0;">查看视频</span>
                        </div>
                        <div>
                            <span style="color: #A8D6FF">门头照片：</span>
                            ${
								data.picture
									? `<img src=\"${
											process.env.VUE_APP_TARGET +
											data.picture
									  }\" style="width: 80px; height: 80px;" alt="暂无图片">`
									: ""
							}
                        </div>
                    </div>
                    `;
			}
			this.infoWindow = new this.AMap.InfoWindow({
				//挂载的组件
				content: tmpContent,
				autoMove: true,
				closeWhenClickMap: true,
				anchor: "bottom-center",
				isCustom: true,
				offset: [0, 300],
			});
			this.infoWindow.open(this.map, e.target.getPosition());
		},
		handleClick(from) {
			this.infoWindow.close();
			this.SET_IS_SHOW_MONITOR(true);
			this.SET_MONITOR_LIST(this.list[from]);
		},
		setPolygon() {
            if (!this.map || this.range.length == 0) return
			let polygonPath = [
				//new this.AMap.LngLat(129.520112,42.916459),
				//new this.AMap.LngLat(129.497406,42.886156),
				//new this.AMap.LngLat(129.568646,42.897475),
                //new this.AMap.LngLat(129.520123,42.914243)
			];
            this.range.forEach(item => {
                let tmp = item.split(',')
                polygonPath.push(new this.AMap.LngLat(Number(tmp[0]), Number(tmp[1])))
            })
			let polygon = new this.AMap.Polygon({
				path: polygonPath,
                strokeColor: '#40DFFF',
                fillOpacity: 0
			});
            this.map.add(polygon)
		},
	},
};
</script>

<style lang="scss" scoped>
#map::v-deep {
	width: 100%;
	height: 100%;
	position: absolute;
	.amap-logo {
		display: none !important;
	}
	.amap-copyright {
		opacity: 0;
	}
}
</style>