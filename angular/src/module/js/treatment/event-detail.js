(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'eventDetail',
			[
				'$localStorage',
				'$scope',
				'$location',
				'$log',
				'$q',
				'$rootScope',
				'$window',
				'routeService',
				'$http',
                '$ajaxhttp',
                'myStorage',
                'wish',
                'esriApiDeps',
                'tiandituFactory',
                'MapUtil',
                'SymbolUtil',
                'GeometryUtil',
				function eventDetail($localStorage, $scope, $location, $log, $q, $rootScope, $window, routeService, $http, $ajaxhttp, myStorage,
                                     wish, esriApiDeps, tiandituFactory, MapUtil, SymbolUtil, GeometryUtil) {


                    $('.app-content-body').css('height','100vh');
                    $scope.detailId = myStorage._getLocal('id');
                    // 分页
                    var reGetProducts = function() {
                        //请求详情数据
                        $ajaxhttp.myhttp({
                            url: $localStorage.serviceUrl_eventMgr + '/v1/event/getDetails?eventId=' + $scope.detailId,
                            method: 'get',
                            callBack: function(res){
                                $scope.detailData = res.data;//详情数据
                                //地图中绘制事件点
                                addMarker($scope.detailData);
                                // $scope.reportRes($scope.detailData.typename);
                                $scope.evLevel($scope.detailData.eventlevel);
                                $scope.statusEvent($scope.detailData.status);
                                $scope.eventResource($scope.detailData.eventresource);
                            }
                        })
                    };

                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage : $location.search().currentPage ? $location
                            .search().currentPage
                            : 1,
                        itemsPerPage : 10,
                        pagesLength : 5,
                        perPageOptions : [ 1, 2, 3, 4, 5, 10 ],
                        onChange : function() {
                            console
                                .log($scope.paginationConf.currentPage);
                            $location
                                .search(
                                    'currentPage',
                                    $scope.paginationConf.currentPage);
                        }
                    };
                    $scope.afterAccessory = [];
                    $scope.beforeAccessory = [];
                    //获取附件
                    $ajaxhttp.myhttp({
                        url: $localStorage.serviceUrl_eventMgr + '/v1/event/findAccessoryList?eventId=' + $scope.detailId,
                        method: 'get',
                        callBack: function(res){
                            $scope.afterAccessory = res.data.afterAccessory;
                            $scope.beforeAccessory = res.data.beforeAccessory;
                            // for(let i = 0; i<afterAccessory.length;i++){
                            //     if(afterAccessory[i].accessorytype == 2){
                            //         $scope.afterAccessory.push(afterAccessory[i])
                            //     };
                            // };
                            // for(let i = 0; i<beforeAccessory.length;i++){
                            //     if(beforeAccessory[i].accessorytype == 2){
                            //         $scope.beforeAccessory.push(beforeAccessory[i])
                            //     };
                            // };
                            // $scope.$apply();
                        }
                        
                    });
                    // 通过$watch currentPage和itemperPage
                    // 当他们一变化的时候，重新获取数据条目
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',reGetProducts);
                    //上报来源处理
                    // $scope.reportRes = function(data){
                    //     switch(data){
                    //         case 'A':
                    //         $scope.recource = '河长APP';
                    //         break;
                    //         case 'B':
                    //         $scope.recource = '电话上报';
                    //         break;
                    //         case 'C':
                    //         $scope.recource = '公众APP';
                    //         break;
                    //         case 'D':
                    //         $scope.recource = '微信';
                    //         break;
                    //         case 'F':
                    //         $scope.recource = '曝光台';
                    //         break;
                    //         case 'G':
                    //         $scope.recource = '钉钉平台';
                    //         break;
                    //     };
                    // };
                    // 问题来源转换
                    $scope.eventResource = function(status){
                        switch(status){
                            case 'A':
                            $scope.recource = '河长APP';
                            break;
                            case 'B':
                            $scope.recource = '电话上报';
                            break;
                            case 'C':
                            $scope.recource = '公众APP';
                            break;
                            case 'D':
                            $scope.recource = '微信';
                            break;
                            case 'F':
                            $scope.recource = '曝光台';
                            break;
                            case 'G':
                            $scope.recource = '钉钉平台';
                            break;
                        };
                    };
                    //问题等级处理函数
                    $scope.evLevel = function(level){
                        switch(level){
                            case '0':
                            $scope.eventLevel = '一般';
                            break;
                            case '1':
                            $scope.eventLevel = '紧急';
                            break;
                            case '2':
                            $scope.eventLevel = '特急';
                            break;
                        };
                    };
                    //问题装太类型
                    $scope.statusEvent = function(val){
                        var statusObj = {
                            A: "问题上报",
                            B1: "省级联络员派单",
                            B2: "市级联络员派单",
                            B3: "区级联络员派单",
                            B4: "镇级联络员派单",
                            B5: "村级联络员派单",
                            E1: "省级河长派单 ",
                            E2: "市级河长派单",
                            E3: "区级河长派单",
                            E4: "镇级河长派单",
                            E5: "村级河长派单",
                            H1: "省级河长确认",
                            H2: "市级河长确认",
                            H3: "区级河长确认",
                            H4: "镇级河长确认",
                            H5: "村级河长确认",
                            G1: "省级联络员反馈求助",
                            G2: "市级联络员反馈求助",
                            G3: "区级联络员反馈求助",
                            G4: "镇级联络员反馈求助",
                            G5: "工作人员反馈求助",
                            K1: "省级河长反馈求助",
                            K2: "市级河长反馈求助",
                            K3: "区级河长反馈求助",
                            K4: "镇级河长反馈求助",
                            K5: "工作人员反馈求助",
                            M1: "省级河长助理结案",
                            M2: "市级河长助理结案",
                            M3: "区级河长助理结案",
                            M4: "镇级河长助理结案",
                            N1: "省级委办局处理",
                            N2: "市级委办局处理",
                            N3: "区级委办局处理",
                            N4: "镇级委办局处理",
                            N5: "村级委办局处理",
                            F: "工作人员处理",
                            Z1: "省级河长确认结案",
                            Z2: "市级河长确认结案",
                            Z3: "区级河长确认结案",
                            Z4: "镇级河长确认结案",
                            Z5: "村级河长确认结案",
                            B: "受理",
                            C: "核实",
                            D: "确认",
                            E: "派单",
                            G: "已处理",
                            H: "审核",
                            I: "结案",
                            Z: "已结案",
                            X: "无效问题",
                            T: "事务锁定",
                            J1: "省级河长办审核",
                            J2: "市级河长办审核",
                            J3: "区级河长办审核",
                            J4: "镇级河长办审核",
                            J5: "村级河长办审核",
                            L1: "省级河长办处理",
                            L2: "市级河长办处理",
                            L3: "区级河长办处理",
                            L4: "镇级河长办处理",
                            L5: "村级河长办处理",
                        };
                        for (let key in statusObj) {
                            if(key == val){
                                $scope.eventStatus = statusObj[key];
                            };
                        };
                    };
                    $scope.eventImgUrl = $localStorage.serviceUrl_fileService;
                    //获取操作类型
                    $ajaxhttp.myhttp({
                        url: $localStorage.serviceUrl_eventMgr + '/v1/event/getModules?eventId=' + $scope.detailId + '&userId=a78fb3f6cd53411dbac9bdeb65897294',
                        method: 'get',
                        callBack: function(res){
                            var arr = [];
                            for(let i = 0;i<res.data.length;i++){
                                if(arr.indexOf(res.data[i])<0){
                                    arr.push(res.data[i])
                                }
                                
                            }
                            $scope.workTypeList = arr;
                            $scope.moudleLength = $scope.workTypeList.length;
                            if($scope.workTypeList.length>0){
                                $scope.typeModule = $scope.workTypeList[0];
                            };
                            switch($scope.workTypeList[0]){
                                case 'sendOrder':
                                $scope.commendName = '派单';
                                break;
                                case 'confirm':
                                $scope.commendName = '确认';
                                break;
                                case 'report':
                                $scope.commendName = '上报';
                                break;
                                case 'close':
                                $scope.commendName = '结案';
                                break;
                                case 'delegate':
                                $scope.commendName = '委办';
                                break;
                                case 'rollback':
                                $scope.commendName = '退回';
                                break;
                            };
                        }
                    });
                    //获取处理环节
                    $ajaxhttp.myhttp({
                        url: $localStorage.serviceUrl_eventMgr + '/v1/event/getHistory?eventId=' + $scope.detailId,
                        method: 'get',
                        callBack: function(res){
                            $scope.workTakeList = res.data;
                            if($scope.workTakeList[0] == 'sendOrder' || $scope.workTakeList[0] == 'delegate'){
                                $scope.personType = true;
                            }else{
                                $scope.personType = false;
                            };
                        }
                    });
                    
                    //操作类型处理函数
                    $scope.workTypeTurn = function(item){
                        var text = '';
                        switch(item){
                            case 'sendOrder':
                            $scope.personType = true;
                            text = '派单';
                            break;
                            case 'confirm':
                            text = '确认';
                            break;
                            case 'report':
                            text = '上报';
                            break;
                            case 'close':
                            text = '结案';
                            break;
                            case 'delegate':
                            text = '委办';
                            break;
                            case 'rollback':
                            text = '退回';
                            break;
                        };
                        return text;
                    };
                    //获取区域列表数据
                    // $ajaxhttp.myhttp({
                    //     url: $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree?parentCode=' + $localStorage.userLoginInfo.userInfo.regionId,
                    //     method: 'get',
                    //     callBack: function(res){
                    //         $scope.regionList = res.data;
                    //     }
                    // });
                    if($localStorage.userLoginInfo.userInfo.regionId == 120100000000){
                        $scope.areaWb = false;
                    }else{
                        $scope.areaWb = true;
                    };
                    //派单时请求区域列表数据
                    $ajaxhttp.myhttp({
                        url: $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree?parentCode=' + $localStorage.userLoginInfo.userInfo.regionId,
                        method: 'get',
                        callBack: function(res){
                            $scope.regionList = res.data;
                        }
                    });
                    $scope.selectRegion = function(choseRegion,senderRegion){
                        var regionIdScope = '';
                        if($scope.typeModule == 'delegate'){
                            if(choseRegion == 0){
                                regionIdScope = 120100000000;
                            }else{
                                regionIdScope = $localStorage.userLoginInfo.userInfo.regionId;
                            };
                        };
                        var roleIds = '';
                        if($scope.typeModule == 'sendOrder'){
                            if(senderRegion){
                                regionIdScope = senderRegion.id;
                            };
                            roleIds = 'fca74e7d677111e7968ef01fafcf3a37';
                        }else{
                            roleIds = 'cb0a5c20b4b811e88338fa163e29a9e1';
                        };
                        $ajaxhttp.myhttp({
                            url: $localStorage.serviceUrl_eventMgr + 'v1/event/loadUser?roleIds=' + roleIds + '&regionId=' + regionIdScope,
                            method: 'get',
                            callBack: function(res){
                                $scope.personList = res.data;
                            }
                        });
                    };
                    $scope.selectPerson = function(id){
                        $scope.personId = id;
                    };
                    
                    $scope.regionType = true;
                    $scope.reachType = false;
                    // 选择派单放试
                    $scope.selectSenderType = function(num){
                        // switch(num){
                        //     case 0:
                        //     $scope.personType = true;
                        //     $scope.regionType = true;
                        //     $scope.reachType = false;
                        //     break;
                        //     case 1:
                        //     $scope.personType = false;
                        //     $scope.regionType = true;
                        //     $scope.reachType = false;
                        //     break;
                        //     case 2:
                        //     $scope.personType = false;
                        //     $scope.regionType = false;
                        //     $scope.reachType = true;
                        //     break;
                        //     default:
                        //     break;
                        // };
                    };

                    //操作按钮问题
                    $scope.btnClick = function(item,ind){
                        $('#tabs li').eq(ind).addClass('select').siblings().removeClass('select');
                        $scope.choseRegion = '';
                        $scope.chosePerson = '';
                        switch(item){
                            case 'sendOrder':
                            $scope.typeModule = 'sendOrder';
                            $scope.commendName = '派单';
                            break;
                            case 'confirm':
                            $scope.typeModule = 'confirm';
                            $scope.commendName = '确认';
                            break;
                            case 'report':
                            $scope.typeModule = 'report';
                            $scope.commendName = '上报';
                            break;
                            case 'close':
                            $scope.typeModule = 'close';
                            $scope.commendName = '结案';
                            break;
                            case 'delegate':
                            $scope.typeModule = 'delegate';
                            $scope.commendName = '委办';

                            break;
                            case 'rollback':
                            $scope.typeModule = 'rollback';
                            $scope.commendName = '退回';
                            break;
                        };
                    };
                    $scope.back = function(){
                        window.history.back();
                    };
                    $scope.certainClick = function(){
                        $ajaxhttp.myhttp({
                            url: $localStorage.serviceUrl_eventMgr + '/v1/event/' + $scope.typeModule,
                            method: 'get',
                            params: {
                                eventId: $scope.detailId,
                                userId: $localStorage.userLoginInfo.userInfo.id,
                                resultDesc: $scope.sendDescription,
                                handlerIds: $scope.personId
                            },
                            callBack: function(res){
                                if(res.resCode == 1){
                                    var index = layer.open({
                                        title:'提示',
                                        content: "操作成功"
                                    });
                                    setTimeout(function(){
                                        layer.close(index);
                                        window.history.back();
                                    },1000);
                                }
                            }
                        });
                        
                    };

                    //====================================地图显示======================================================
                    var promise = esriApiDeps.query();
                    var w = wish.get();

                    $scope.init = function(){
                        loadGisModuls();
                    };

                    //地图对象
                    var initExtent = new w.Extent(49.670562744140625, -2.7861714363098145, 155.13931274414062, 67.52632856369019);
                    $scope.map = new w.Map('mapContainer', {
                        extent: initExtent,
                        fadeOnZoom: true
                    });
                    //加载天地图
                    tiandituFactory.initTianditu($scope.map);

                    //加载GIS模块
                    function loadGisModuls() {
                        if (typeof $scope.map !== 'undefined') {
                            MapUtil.init($scope.map);
                            SymbolUtil.init($scope.map);
                            GeometryUtil.init($scope.map);
                        } else {
                            console.error('error： $scope.map 未定义')
                        }
                    }

                    function addMarker(data) {
                        var item = data;
                        var grade = getEventRegionGrade(item);
                        if(MapUtil.isCoordValid(item["longitude"],item["latitude"])){
                            MapUtil.center2LongLat(item["longitude"],item["latitude"], grade);
                            var point = GeometryUtil.getPoint(item["longitude"],item["latitude"]);
                            var iconPath = "img/esri-icon/patrol/event.png";
                            var symbol = SymbolUtil.getPictureMarkerSymbol(iconPath, 25, 36);
                            var g = new w.Graphic(point, symbol);
                            $scope.map.graphics.add(g);
                        }else{
                            console.warn("无效坐标");
                            layer.msg('无效坐标！绘制失败...',{time:2000});
                        }
                    }

                    function getEventRegionGrade(data){
                        if(data["eventbelongvillageid"] !== null){
                            grade = 5;
                        }else if(data["eventbelongtownid"] !== null){
                            grade = 4;
                        }else if(data["eventbelongcountyid"] !== null){
                            grade = 3;
                        }else if(data["eventbelongcityid"] !== null){
                            grade = 2;
                        }else if(data["eventbelongprovinceid"] !== null){
                            grade = 1;
                        }else {
                            var grade = 2; //默认值
                        }
                        return grade;
                    };

                    // 音视频播放
                    $scope.playVideo = function(item){
                        $('#videoBox').show();
                        $('#audioPlayer').css('display','none');
                        $("#videoPlayerBox").css('display','block');
                        $scope.videoUrl = $scope.eventImgUrl +  item.accessoryurl;
                        $("#videoPlayerBox source").attr("src", $scope.videoUrl);
                        var myPlayer = videojs("videoPlayerBox")
                        myPlayer.ready(function () {
                            myPlayer.play()
                        });
                    };
                    $scope.playAudio = function(item){
                        $('#videoBox').show();
                        $('#audioPlayer').css('display','block');
                        $("#videoPlayerBox").css('display','none');
                        $scope.videoUrl = $scope.eventImgUrl + item.accessoryurl;
                        console.log($("#audioPlayer"))
                        $("#audioPlayer audio").attr("src", $scope.videoUrl);
                        // var myPlayer = $("#audioPlayer");
                        // myPlayer.play()
                    }
                    // 停止并关闭视频、
                    $scope.closePlayer = function(){
                        $('#videoBox').hide();
                    };


    }]);
})(window, angular);
