/* eslint-disable */
export const monitor = {
    data () {
        return {
            videoWidth: 190,
            videoHeight: 110,
            screenWidth: document.documentElement.clientWidth,//屏幕宽度
            screenHeight: document.documentElement.clientHeight,//屏幕高度
            oWebControl: null,   //插件对象
            layout: '1x1',
            playMode: 0,
            // refMonitor: "", // 放监控容器
        }
    },
    watch: {
        screenWidth(n,o){
            if (!this.oWebControl) return
            this.videoWidth = this.$refs[this.refMonitor].offsetWidth;
            this.videoHeight = this.$refs[this.refMonitor].offsetHeight;
            this.oWebControl.JS_Resize(this.videoWidth, this.videoHeight);
            this.resizewindow(n,this.screenHeight);
            this.setWndCover();
        }, 
        screenHeight(n,o){
            if (!this.oWebControl) return
            this.videoWidth = this.$refs[this.refMonitor].offsetWidth;
            this.videoHeight = this.$refs[this.refMonitor].offsetHeight;
            this.oWebControl.JS_Resize(this.videoWidth, this.videoHeight);
            this.resizewindow(this.screenWidth,n);
            this.setWndCover();
        },
    },
    created () {
        //插件初始化
		this.$nextTick(()=>{
			this.videoWidth = this.$refs[this.refMonitor].offsetWidth;
			this.videoHeight = this.$refs[this.refMonitor].offsetHeight;
		})
        
        //this.initPlugin()
    },
    mounted () {
        window.handleDownLoadPlugin = this.handleDownLoadPlugin;
    },
    beforeDestroy () {
        // 解除监听
        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('scroll', this.handleScroll)
        // this.oWebControl && this.oWebControl.JS_HideWnd();
        if (this.oWebControl && this.oWebControl != null){
            this.oWebControl.JS_HideWnd();
            this.oWebControl.JS_Disconnect().then(function(){}, function() {});
        }
    },
    methods: {
        //   插件初始化
        initPlugin () {
            let _this = this
            this.oWebControl = new WebControl({
                szPluginContainer: _this.refMonitor,
                iServicePortStart: 15900,
                iServicePortEnd: 15900,
                cbConnectSuccess: (e) => {
                    // _this.setCallbacks();
                    if(_this.oWebControl){
                        _this.oWebControl.JS_StartService('window', {
                            dllPath: './VideoPluginConnect.dll' 
                        //dllPath: "./DllForTest-Win32.dll"
                        }).then( (res) => {
                            // 生成背景图，防止闪烁
                            _this.oWebControl.JS_SetWindowControlCallback({   // 设置消息回调
                                cbIntegrationCallBack: _this.callBack // oData 是封装的视频 web 插件回调消息的消息体
                            });
                            _this.oWebControl.JS_CreateWnd(_this.refMonitor ,_this.videoWidth,_this.videoHeight, {bEmbed: true}).then(() => {
                            // console.log("JS_CreateWnd success");
                                _this.initVideo();

                                // 监听窗口变化
                                window.addEventListener('resize', this.handleResize)
                                window.addEventListener('scroll', this.handleScroll)
                            }).catch(err => {
                                _this.oWebControl = null;
                            })
                        }, function () {
                        });
                    }
                },
                cbConnectError: () => {
                    _this.oWebControl = null;
                    $(`#${this.refMonitor}`).html('&nbsp;&nbsp;插件未启动，正在尝试启动，请稍候...');
                    WebControl.JS_WakeUp('VideoWebPlugin://');
                    _this.initCount ++;
                    if (_this.initCount < 3) {
                        setTimeout(() => {
                            _this.initPlugin();
                        }, 3000)
                    } else {
                        $(`#${this.refMonitor}`).html('<span >&nbsp;&nbsp;未安装插件，请<span style="color: blue; text-decoration:underline" class=" el-icon-download" onclick="handleDownLoadPlugin()">下载插件</span>，安装完成之后请重启浏览器。</span>')
                    }
                },
                cbConnectClose: (bNormalClose) => {
                    //this.oWebControl.JS_Disconnect().then(function(){}, function() {});
                    this.oWebControl = null;
                    if (!bNormalClose) {
                        // 异常断开
                        $(`#${this.refMonitor}`).html('&nbsp;&nbsp;插件未启动，正在尝试启动，请稍候...');
                        WebControl.JS_WakeUp('VideoWebPlugin://');
                        _this.initCount ++;
                        if (_this.initCount < 3) {
                            setTimeout(() => {
                                _this.initPlugin();
                            }, 3000)
                        } else {
                            $(`#${this.refMonitor}`).html('<span >&nbsp;&nbsp;未安装插件，请<span class="pluginStyle el-icon-download" onclick="handleDownLoadPlugin()">下载</span>插件，安装完成之后请重启浏览器。</span>')
                            this.plugin=false;
                        }
                    }
                }
            });
        },
        // 初始化参数
        initVideo () {
        // console.log(this.getPubKey)
            let that = this
            this.getPubKey(() =>{
                let appkey = this.list[0].appkey;
                let secret = this.setEncrypt(this.list[0].secret);
                let ip = this.list[0].ip;
                let szPort= this.list[0].port;
                let port = parseInt(szPort);
                let playMode = this.playMode // 0-预览, 1-回放

                let snapDir = 'D:\\SnapDir';
                let videoDir = 'D:\\VideoDir' ;
                let layout = this.layout;
                let encryptedFields = ['secret'];
                let enableHttps = 1;                       
                encryptedFields = encryptedFields.join(',');
                this.oWebControl.JS_RequestInterface({
                    funcName: 'init',
                    argument: JSON.stringify({
                        appkey: appkey,
                        secret: secret,
                        ip: ip, 
                        playMode: playMode, 
                        port: port,
                        snapDir: snapDir,
                        videoDir: videoDir,
                        layout: layout,
                        enableHTTPS: enableHttps,
                        encryptedFields: encryptedFields,
                        showToolbar: 0
                    })
                }).then((oData) => {
                    that.oWebControl.JS_Resize(that.videoWidth, that.videoHeight);
                    this.startRealPlay()
                });
            })
        },
        // 获取公钥
        getPubKey (callback) {
        // console.log(this.oWebControl,'oWebControloWebControl')
            this.oWebControl.JS_RequestInterface({
                funcName: 'getRSAPubKey',
                argument: JSON.stringify({
                    keyLength: 1024
                })
            }).then((oData) => {
            // console.log(oData)
                if (oData.responseMsg.data) {
                    this.pubKey = oData.responseMsg.data
                    callback()
                }
            })
        },
        // RSA加密
        setEncrypt (value) {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(this.pubKey);
            return encrypt.encrypt(value);
        },
        // 视频预览
        startRealPlay () {
        // console.log('------开始播放-------')
            let cameraIndexCode = this.list.map(item => item.code)
            let streamMode = 0;
            let transMode = 1;
            let gpuMode = 0;
            let wndId = -1;  //默认为空闲窗口回放
            //循环出所有视频并播放
            for(let i = 0; i <cameraIndexCode.length;i++){
                this.oWebControl.JS_RequestInterface({
                    funcName: 'startPreview',
                    argument: JSON.stringify({
                        cameraIndexCode: cameraIndexCode[i],
                        streamMode: streamMode,
                        transMode: transMode,
                        gpuMode: gpuMode,
                        wndId: i+1
                    })
                }).then((oData) => {
                // console.log('err:',oData)
                })
            }
        },
 
        //根据窗口变化设置视频插件大小
        resizewindow(w,h){
            w = (w<1423)?1423:w
            h = (h<754)?754:h
            window.resizeTo(w ,h);
        },
        //设置窗口遮挡
        setWndCover() {
            if (!this.oWebControl) return
            let iWidth = document.body.clientWidth;
            let iHeight = document.body.clientHeight;
            let oDivRect = document.getElementById(this.refMonitor).getBoundingClientRect();
            let iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left): 0;
            let iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top): 0;
            let iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
            let iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;
            iCoverLeft = (iCoverLeft > 700) ? 700 : iCoverLeft;
            iCoverTop = (iCoverTop > 400) ? 400 : iCoverTop;
            iCoverRight = (iCoverRight > 700) ? 700 : iCoverRight;
            iCoverBottom = (iCoverBottom > 400) ? 400 : iCoverBottom;
            if (this.iLastCoverLeft != iCoverLeft) {
            //console.log("iCoverLeft: " + iCoverLeft);
                this.iLastCoverLeft = iCoverLeft;
                this.oWebControl.JS_SetWndCover('left', iCoverLeft);
            }
            if (this.iLastCoverTop != iCoverTop) {
            //console.log("iCoverTop: " + iCoverTop);
                this.iLastCoverTop = iCoverTop;
                this.oWebControl.JS_SetWndCover('top', iCoverTop);
            }
            if (this.iLastCoverRight != iCoverRight) {
            //console.log("iCoverRight: " + iCoverRight);
                this.iLastCoverRight = iCoverRight;
                this.oWebControl.JS_SetWndCover('right', iCoverRight);
            }
            if (this.iLastCoverBottom != iCoverBottom) {
            //console.log("iCoverBottom: " + iCoverBottom);
                this.iLastCoverBottom = iCoverBottom;
                this.oWebControl.JS_SetWndCover('bottom', iCoverBottom);
            }
        },
        handleScroll () {
            if (this.oWebControl && this.oWebControl != null) {
                this.oWebControl.JS_Resize(this.videoWidth, this.videoHeight);
                this.setWndCover();
            }
        },
        handleResize () { // 定义窗口大小变更通知事件
            this.screenWidth = document.documentElement.clientWidth; //窗口宽度
            this.screenHeight = document.documentElement.clientHeight; //窗口高度
        },
        addVideo(code) {
            var cameraIndexCode  = code     //获取输入的监控点编号值，必填
            var streamMode = 0;                                     //主子码流标识：0-主码流，1-子码流
            var transMode = 1;                                      //传输协议：0-UDP，1-TCP
            var gpuMode = 0;                                        //是否启用GPU硬解，0-不启用，1-启用
            var wndId = -1;                                         //播放窗口序号（在2x2以上布局下可指定播放窗口）
            // 历史回放用到的参数， 回看时间戳是21天前。（可修改）
            var startTimeStamp = new Date(new Date().toLocaleDateString()).getTime() / 1000 - 24 * 60 * 60 * 21;    //回放开始时间戳，必填
            var endTimeStamp = new Date(new Date().toLocaleDateString()).getTime() / 1000 + 24 * 60 * 60         //回放结束时间戳，必填
            cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, "");
            cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, "");

            this.oWebControl.JS_RequestInterface({
              funcName: this.playMode === 0 ? "startPreview" : 'startPlayback',
              argument: JSON.stringify({
                cameraIndexCode:cameraIndexCode,                //监控点编号
                streamMode: streamMode,                         //主子码流标识
                transMode: transMode,                           //传输协议
                gpuMode: gpuMode,                               //是否开启GPU硬解
                wndId:wndId,                                     //可指定播放窗口
                startTimeStamp: startTimeStamp.toString(),
                endTimeStamp: endTimeStamp.toString(),
                recordLocation: 1,
              })
            })
        },
        handleDownLoadPlugin () {
            window.location.href = process.env.VUE_APP_VIDEO_WEB_PLUGIN
        },
        closeMonitor () {
            if (this.oWebControl && this.oWebControl != null){
				this.oWebControl.JS_HideWnd();
			}
        },
    }
}