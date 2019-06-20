var modulePrefix = "/component";
var componenttypeUrl = modulePrefix + '/v1/componenttype';
var componentUrl = modulePrefix + '/v1/component';
(function(window, angular) {
    'use strict';

    angular.module("app").controller('imComponentDetail', [
        '$localStorage',
        '$scope',
        '$location',
        '$log',
        '$q',
        '$rootScope',
        'globalParam',
        '$window',
        'routeService',
        'moduleService',
        '$http',
        function imComponentDetail($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, moduleService, $http) {

            $scope.init = function () {
            };

            var obj = $localStorage.componentDetailData.data;
            //部件名称
            $scope.componentName = obj.name;
            //所属区域
            $scope.regionName = obj.regionName;
            //部件等级名称
            $scope.complevelName = obj.complevelName;
            //部件来源
            $scope.sourceName = obj.sourceName;
            //部件大类
            $scope.mainclassname = obj.mainclassname;
            //部件小类
            $scope.subclassname = obj.subclassname;
            //备注
            $scope.remark = obj.remark;
            //经度
            $scope.longitude = obj.longitude;
            //纬度
            $scope.latitude = obj.latitude;
            //河湖库段
            $scope.reachName = obj.reachName;
			
			$scope.point = {
			    'longitude': $scope.longitude,
			    'latitude': $scope.latitude
			}

            //回显对应数据
            var initData = function () {
                switch ($scope.subclassname) {
                    case typeName[0]:
                    case typeName[16]:
                        $scope.agripollution_farmname = obj.specificComponent.farmname;
                        $scope.agripollution_yield = obj.specificComponent.yield;
                        $scope.cultivation_type = obj.specificComponent.cultivationtype;
                        $scope.agripollution_floorspace = obj.specificComponent.floorspace;
                        $scope.agripollution_buildingspace = obj.specificComponent.buildingspace;
                        $scope.farmfacility = obj.specificComponent.farmfacility == null ? null : obj.specificComponent.farmfacility + '';
                        $scope.treatmentid = obj.specificComponent.treatmentid;
                        $scope.agripollution_capofpollution = obj.specificComponent.capofpollution;
                        $scope.agripollution_chairman = obj.specificComponent.chairman;
                        $scope.agripollution_telephone = obj.specificComponent.telephone;
                        break;
                    case typeName[1]:
                        $scope.induspollution_floorspace = obj.specificComponent.floorspace;
                        $scope.induspollution_buildingspace = obj.specificComponent.buildingspace;
                        $scope.induspollution_companyname = obj.specificComponent.companyname;
                        $scope.induspollution_chairman = obj.specificComponent.chairman;
                        $scope.induspollution_cellphone = obj.specificComponent.cellphone;
                        $scope.induspollution_telephone = obj.specificComponent.telephone;
                        $scope.induspollution_product = obj.specificComponent.product;
                        $scope.induspollution_yearlycapacity = obj.specificComponent.yearlycapacity;
                        $scope.induspollution_waterconsumption = obj.specificComponent.waterconsumption;
                        $scope.induspollution_capofwateraftertreat = obj.specificComponent.capofwateraftertreat;
                        $scope.isinternetwork = obj.specificComponent.isinternetwork == null ? null : obj.specificComponent.isinternetwork + '';
                        $scope.treatmentid = obj.specificComponent.treatmentid;
                        break;
                    case typeName[2]:
                        $scope.lifepollution_floorspace = obj.specificComponent.floorspace;
                        $scope.lifepollution_buildingspace = obj.specificComponent.buildingspace;
                        $scope.lifepollution_familynum = obj.specificComponent.familynum;
                        $scope.lifepollution_population = obj.specificComponent.population;
                        $scope.lifepollution_waterconsumption = obj.specificComponent.waterconsumption;
                        $scope.lifepollution_capofpollution = obj.specificComponent.capofpollution;
                        $scope.treatmentid = obj.specificComponent.treatmentid;
                        break;
                    case typeName[3]:
                        $scope.section_rivername = obj.specificComponent.rivername;
                        $scope.sectionlevel = obj.specificComponent.sectionlevel == null ? null : obj.specificComponent.sectionlevel + '';
                        $scope.showlevel = obj.specificComponent.showlevel == null ? null : obj.specificComponent.showlevel + '';
                        $scope.nowquality = obj.specificComponent.nowquality;
                        $scope.targetquality = obj.specificComponent.targetquality == null ? null : obj.specificComponent.targetquality + '';
                        break;
                    case typeName[4]:
                        $scope.pumpstation_ennmnm = obj.specificComponent.ennmnm;
                        $scope.pumpstation_model = obj.specificComponent.model;
                        $scope.pumpstation_pumpnum = obj.specificComponent.pumpnum;
                        $scope.pumpstation_areacover = obj.specificComponent.areacover;
                        $scope.pumpstation_adunnm = obj.specificComponent.adunnm;
                        break;
                    case typeName[5]:
                        $scope.watergate_ennmnm = obj.specificComponent.ennmnm;
                        $scope.watergate_gateFormNum = obj.specificComponent.gateFormNum;
                        $scope.watergate_areacover = obj.specificComponent.areacover;
                        $scope.watergate_adunnm = obj.specificComponent.adunnm;
                        break;
                    case typeName[6]:
                        $scope.rivervideo_serverip = obj.specificComponent.serverip;
                        $scope.rivervideo_serverport = obj.specificComponent.serverport;
                        $scope.rivervideo_serveradminname = obj.specificComponent.serveradminname;
                        $scope.rivervideo_serveradminpwd = obj.specificComponent.serveradminpwd;
                        $scope.rivervideo_chn = obj.specificComponent.chn;
                        $scope.rivervideo_chnname = obj.specificComponent.chnname;
                        $scope.rivervideo_streamip = obj.specificComponent.streamip;
                        $scope.rivervideo_streamport = obj.specificComponent.streamport;
                        $scope.rivervideo_deviceid = obj.specificComponent.deviceid;
                        $scope.rivervideo_vcontent = obj.specificComponent.vcontent;
                        $scope.company = obj.specificComponent.company == null ? null : obj.specificComponent.company + '';
                        $scope.protocol = obj.specificComponent.protocol == null ? null : obj.specificComponent.protocol + '';
                        $scope.connecttype = obj.specificComponent.connecttype == null ? null : obj.specificComponent.connecttype + '';
                        $scope.status = obj.specificComponent.status == null ? null : obj.specificComponent.status + '';
                        break;
                    case typeName[7]:
                        backImg(obj);
                        $scope.belongPollution = obj.specificComponent.pollutionName;
                        $scope.belongVideo = obj.specificComponent.videoName;
                        $scope.pollutionId = obj.specificComponent.pollutionId;
                        $scope.videoId = obj.specificComponent.videoId;
                        $scope.reOutfallId = obj.specificComponent.reOutfallId;
                        $scope.intorivermode = obj.specificComponent.intorivermode;
                        $scope.dischargemode = obj.specificComponent.dischargemode;
                        $scope.pollutant = obj.specificComponent.pollutant;
                        $scope.unitPollutantType = obj.specificComponent.unitPollutantType;
                        $scope.outfall_unitName = obj.specificComponent.unitName;
                        $scope.outfall_unitCellphone = obj.specificComponent.unitCellphone;
                        $scope.outfall_dischargeWasteWater = obj.specificComponent.dischargeWasteWater;
                        $scope.outfall_unitLatitude = obj.specificComponent.unitLatitude;
                        $scope.outfall_unitLongitude = obj.specificComponent.unitLongitude;
                        $scope.outfall_capofpollution = obj.specificComponent.capofpollution;
                        $scope.outfall_unitAddress = obj.specificComponent.unitAddress;
                        break;
                    case typeName[8]:
                        $scope.waterlevel = obj.specificComponent.waterlevel;
                        $scope.control = obj.specificComponent.control;
                        break;
                    case typeName[9]:
                        $scope.sewageTreatmentFacilities_facilityName = obj.specificComponent.facilityName;
                        $scope.sewageTreatmentFacilities_principal = obj.specificComponent.principal;
                        $scope.sewageTreatmentFacilities_dutyunit = obj.specificComponent.dutyunit;
                        $scope.sewageTreatmentFacilities_celphone = obj.specificComponent.celphone;
                        $scope.treatmentid = obj.specificComponent.treatmentid;
                        $scope.attentionLevel = obj.specificComponent.attentionLevel;
                        break;
                    case typeName[10]:
                        $scope.monitor_sourceunit = obj.specificComponent.sourceunit;
                        $scope.monitor_responseunit = obj.specificComponent.responseunit;
                        $scope.control = obj.specificComponent.controllevel;
                        $scope.recordtype = obj.specificComponent.recordtype;
                        $scope.nowquality = obj.specificComponent.nowquality;
                        $scope.targetquality = obj.specificComponent.targetquality == null ? null : obj.specificComponent.targetquality + '';
                        $scope.monitortype = obj.specificComponent.type;
                        break;
                    case typeName[11]:
                        $scope.targetquality = obj.specificComponent.targetquality == null ? null : obj.specificComponent.targetquality + '';
                        $scope.functionalArea_dutyunit = obj.specificComponent.dutyunit;
                        $scope.functionalArea_phone = obj.specificComponent.phone;
                        $scope.functionalArea_undercentralizedunit = obj.specificComponent.undercentralizedunit;
                        break;
                    case typeName[12]:
                        $scope.intake_watermode = obj.specificComponent.watermode;
                        $scope.intake_watercapacity = obj.specificComponent.watercapacity;
                        $scope.intake_wateruse = obj.specificComponent.wateruse;
                        $scope.intake_waterunit = obj.specificComponent.waterunit;
                        $scope.intake_waterunitperson = obj.specificComponent.waterunitperson;
                        $scope.intake_phone = obj.specificComponent.phone;
                        $scope.intake_undercentralizedunit = obj.specificComponent.undercentralizedunit;
                        break;
                    case typeName[14]:
                        backImg(obj);
                        break;
                    case typeName[15]:
                        backImg(obj);
                        break;
                    default:
                        break;
                }
            };

            //回显照片
            function backImg(obj) {
                if (obj.mdPhotos != null) {
                    $scope.hasImg = (obj.mdPhotos.fileurl == null || obj.mdPhotos.fileurl === '') ? false : true;
                    $scope.imgObj = {url: obj.mdPhotos.fileurl};
                } else {
                    $scope.hasImg = false;
                }
            }

            //监测河道水质暂时不需要
            //所有特有部件类型 typeName和typeId需要上下对应
            var typeName = ['农业污染源', '工业污染源', '生活污染源', '监测断面',
                '泵站', '水闸', '监控摄像头', '企业排污口',
                '饮用水源地', '农村污水处理设施', '监测站', '水功能区',
                '取水口', '排放水口', '河道公示牌', '河道照片', '畜禽养殖'];
            var typeId = ['MdAgripollutionBox', 'MdInduspollutionBox', 'MdLifepollutionBox', 'MdSectionBox',
                'MdPumpstationBox', 'MdWatergateBox', 'MdRivervideoBox', 'MdOutfallBox',
                'MdWaterBox', 'GrSewageTreatmentFacilitiesBox', 'MdMonitorBox', 'MdWaterFunctionalAreaBox',
                'MdIntakeBox', 'MdWaterOutputBox', 'MdWaterCardBox', 'MdreachImgBox'];

            //根据部件小类切换输入框
            $scope.changeBox = function () {
                var name = obj.subclassname;
                //先将所有div隐藏
                $('.dis-none').css('display', 'none');
                //显示特定div
                var size = typeName.indexOf(name);
                $('#' + typeId[size]).css('display', 'block');// div显示
                initData();
                checkBoxInit(name);
            };
            //访问数据字典表
            //type 前后台约定
            //address 存放请求结果,可传多个
            function getType(type, address) {
                var adds = [];
                var size = arguments.length;
                for (var i = 1; i < size; i++) {
                    adds.push(arguments[i]);
                }
                $http({
                    method: "get",
                    url: moduleService.getServiceUrl() + componentUrl + "/smDictionaryType",
                    params: {
                        type: type
                    }
                }).success(
                    function (res) {
                        var size = adds.length;
                        for (var i = 0; i < size; i++) {
                            $scope[adds[i]] = res.data;
                        }
                    }
                );
            }

            //初始化相应下拉框
            var checkBoxInit = function (name) {
                switch (name) {
                    case typeName[0]:
                    case typeName[16]:
                        cultivationType();
                        farmfacilityType();
                        treatmentidType();
                        break;
                    case typeName[1]:
                        isinternetworkType();
                        treatmentidType();
                        break;
                    case typeName[2]:
                        treatmentidType();
                        break;
                    case typeName[3]:
                        sectionlevelType();
                        nowqualityType();
                        break;
                    case typeName[4]:
                        break;
                    case typeName[5]:
                        break;
                    case typeName[6]:
                        companyType();
                        protocolType();
                        connectType();
                        statusType();
                        break;
                    case typeName[7]:
                        pollutantType();
                        dischargemodeType();
                        intorivermodeType();
                        break;
                    case typeName[8]:
                        controlType();
                        nowqualityType();
                        break;
                    case typeName[9]:
                        attentionLevelType();
                        treatmentidType();
                        break;
                    case typeName[10]:
                        nowqualityType();
                        controlType();
                        monitorType();
                        recordType();
                        break;
                    case typeName[11]:
                        nowqualityType();
                        break;
                    case typeName[12]:
                        break;
                    default:
                        break;
                }
            };
            //养殖场类型初始化
            var cultivationType = function () {
                getType('3', 'cultivation_types');
            };
            //农场设施初始化
            var farmfacilityType = function () {
                getType('4', 'farmfacilitys');
            };
            //处理方式下拉框初始化
            var treatmentidType = function () {
                getType('5', 'treatmentids');
            };
            //是否入网下拉框初始化
            var isinternetworkType = function () {
                getType('6', 'isinternetworks');
            };
            //断面级别和显示级别初始化
            var sectionlevelType = function () {
                getType('1', 'sectionlevels', 'showlevels');
            };
            //当前水质和目标水质,水质等级初始化
            var nowqualityType = function () {
                getType('7', 'nowqualitys', 'targetqualitys', 'waterlevels');
            };
            //设备平台初始化
            var companyType = function () {
                getType('8', 'companys');
            };
            //网络协议初始化
            var protocolType = function () {
                getType('11', 'protocols');
            };
            //连接方式初始化
            var connectType = function () {
                getType('10', 'connecttypes');
            };
            //视频状态初始化
            var statusType = function () {
                getType('9', 'statuss');
            };
            //污染物种类初始化
            var pollutantType = function () {
                getType('14', 'pollutants', 'unitPollutantTypes');
            };
            //入河方式初始化
            var intorivermodeType = function () {
                getType('12', 'intorivermodes');
            };
            //排放方式初始化
            var dischargemodeType = function () {
                getType('13', 'dischargemodes');
            };
            //控制级别初始化
            var controlType = function () {
                getType('1', 'controls');
            };
            //关注级别初始化
            var attentionLevelType = function () {
                getType('15', 'attentionLevels');
            };
            //监测站数据类型初始化
            var monitorType = function () {
                getType('17', 'monitortypes');
            };
            //记录方式初始化
            var recordType = function () {
                getType('16', 'recordtypes');
            };
            //查看文件
            $scope.lookImg = function () {
                $scope.imageUrl = $scope.imgObj.url;
                $("#image").trigger('click');
            };
            $scope.back = function () {
                // 跳转到菜单页面
                routeService.route(109, true);
            }

        }]);

})(window, angular);