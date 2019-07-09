var modulePrefix = "/component";
var componenttypeUrl = modulePrefix + '/v1/componenttype';
var componentUrl = modulePrefix + '/v1/component';
var outfallUrl = modulePrefix + '/v1/outfall';
var rivervideoUrl = modulePrefix + '/v1/rivervideo';
var photosUrl = modulePrefix + '/v1/photos';

(function(window, angular) {
  'use strict';

  angular.module("app").controller('sewageTreatmentAdd', [
    '$localStorage',
    '$scope',
    '$location',
    '$log',
    '$q',
    '$rootScope',
    '$window',
    'routeService',
    'moduleService',
    '$http',
    'wish',
    'esriApiDeps',
    'tiandituFactory',
    'MapUtil',
    'SymbolUtil',
    'GeometryUtil',
    'OneMapMapInit',
    'MapTool',
    'ComponentManagerService',
    'OneMapqueryAdminregionFromMysql',
    'OneMapMapUtil',
    function sewageTreatmentAdd($localStorage, $scope, $location, $log, $q, $rootScope, $window, routeService,
                            moduleService, $http, wish, esriApiDeps, tiandituFactory, MapUtil, SymbolUtil, GeometryUtil,
                            OneMapMapInit, MapTool, ComponentManagerService, OneMapqueryAdminregionFromMysql, OneMapMapUtil) {

      $scope.init = function() {};

      var w = wish.get();

      $scope.point = {
        'longitude': '',
        'latitude': ''
      };

      /*经纬度验证*/
      var coordReg = /^\d+(?=\.{0,1}\d+$|$)/;
      $scope.coordCheck = function(x) {
        if (x == null || x == '') {} else if (!coordReg.test(x)) {
          layer.msg('只能输入数字及小数点！', {
            time: 1000
          });
          if (x == $scope.point.longitude) {
            $scope.point.longitude = '';
          } else if (x == $scope.point.latitude) {
            $scope.point.latitude = '';
          }
        }
        // addMarker();
      };

      function addMarker() {
        if (MapUtil.isCoordValid($scope.point.longitude, $scope.point.latitude)) {
          // MapUtil.center2LongLat($scope.point.longitude, $scope.point.latitude);
          var point = GeometryUtil.getPoint($scope.point.longitude, $scope.point.latitude);
          var iconPath = "img/esri-map-icon/component.png";
          var symbol = SymbolUtil.getPictureMarkerSymbol(iconPath, 22, 24);
          var g = new w.Graphic(point, symbol);
          $scope.map.graphics.add(g);
        } else {
          console.warn("无效坐标");
          layer.msg('无效坐标！绘制失败...', {
            time: 2000
          });
        }
      }

      /*备注信息*/
      $scope.countNum = 512;
      $scope.checkRemark = function() {
        $scope.countNum = 512 - $scope.remark.length;
        if ($scope.remark.length > 512) {
          layer.msg("描述内容请控制在512字符之内！");
          $scope.remark = $scope.remark.substr(0, 512);
          $scope.countNum = 0;
        }
      };

      $scope.hasImg = false;
      $scope.isRepeat = false;

      /**
       * 污水处理厂
       */
      $scope.big_Change_name = '污水处理厂';
      $scope.big_Change_id = '80000000000000000000000000000000';
      $scope.small_Change_name = '污水处理厂';
      $scope.small_Change_id = '80010000000000000000000000000000';
      //部件大类
      $scope.componentBType = function() {
        $http({
          method: "get",
          url: moduleService.getServiceUrl() + componenttypeUrl + "/findMainClass"
        }).success(
          function(res) {
            $scope.componentBTypes = res.data;
          }
        );
      };
      $scope.big_Change = function(big_type) {
        $scope.big_Change_name = big_type.name;
        $scope.big_Change_id = big_type.id;
        componentSType();
        //删除选中的部件小类
        $scope.small_Change_name = null;
        $scope.small_Change_id = null;
      };
      //部件小类
      var componentSType = function() {
        $http({
          method: "get",
          url: moduleService.getServiceUrl() + componenttypeUrl + "/findSubClass",
          params: {
            mainClassId: $scope.big_Change_id
          }
        }).success(
          function(res) {
            $scope.componentSTypes = res.data;
          }
        );
      };
      $scope.small_Change = function(small_type) {
        $scope.small_Change_name = small_type.name;
        $scope.small_Change_id = small_type.id;
        changeBox($scope.small_Change_name);
        //清空上传照片
        $scope.imgObj = null;
        $scope.hasImg = false;
      };
      //部件名称是否重复
      $scope.repeatName = function() {
        if ($scope.componentName != null && $scope.componentName !== '') {
          $http({
            method: "get",
            url: moduleService.getServiceUrl() + componentUrl + "/getByName",
            params: {
              name: $scope.componentName
            }
          }).success(function(res) {
            if (res.resCode === 1) {
              $scope.isRepeat = true;
            }
          }).error(function(res) {

          });
          $scope.isRepeat = false;
        }
      };

      //所有特有部件类型 typeName和typeId需要上下对应
      var typeName = ['农业污染源', '工业污染源', '生活污染源', '监测断面',
        '泵站', '水闸', '监控摄像头', '企业排污口',
        '饮用水源地', '农村污水处理设施', '监测站', '水功能区',
        '取水口', '排放水口', '河道公示牌', '河道照片', '畜禽养殖'
      ];
      var typeId = ['MdAgripollutionBox', 'MdInduspollutionBox', 'MdLifepollutionBox', 'MdSectionBox',
        'MdPumpstationBox', 'MdWatergateBox', 'MdRivervideoBox', 'MdOutfallBox',
        'MdWaterBox', 'GrSewageTreatmentFacilitiesBox', 'MdMonitorBox', 'MdWaterFunctionalAreaBox',
        'MdIntakeBox', 'MdWaterOutputBox', 'MdWaterCardBox', 'MdreachImgBox', 'MdAgripollutionBox'
      ];

      //根据部件小类切换输入框
      var changeBox = function(name) {
        //先将所有div隐藏
        $('.dis-none').css('display', 'none');
        //显示特定div
        var size = typeName.indexOf(name);
        // div显示
        $('#' + typeId[size]).css('display', 'block');
        checkBoxInit(name);
      }

      //初始化相应下拉框
      var checkBoxInit = function(name) {
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
          default:
            break;
        }
      };

      //部件等级
      $scope.componentGrade = function() {
        getType('1', 'componentGrades');
      };
      //部件等级改变
      $scope.grade_change = function(component_grade) {
        $scope.grade_change_name = component_grade.typeName;
        $scope.grade_change_value = component_grade.typeValue;
      };
      //部件来源
      $scope.componentSource = function() {
        getType('2', 'componentSources');
      };
      //部件来源改变
      $scope.source_change = function(component_source) {
        $scope.source_change_name = component_source.typeName;
        $scope.source_change_value = component_source.typeValue;
      };

      /*所属区域树模态框*/
      $scope.regionShow = function() {
        $scope.modalTreeInfo = {
          'treeType': 'region'
        };
        $("#treeModal").modal('show');
      };
      /*河湖库段树模态框*/
      $scope.reachShow = function() {
        $scope.modalTreeInfo = {
          'treeType': 'reach'
        };
        $("#treeModal").modal('show');
      }
      /*污染源树模态框*/
      $scope.pollutionShow = function() {
        $scope.modalTreeInfo = {
          'treeType': 'pollution'
        };
        $("#treeModal").modal('show');
      }
      /*测控摄像树模态框*/
      $scope.videoShow = function() {
        $scope.modalTreeInfo = {
          'treeType': 'video'
        };
        $("#treeModal").modal('show');
      }

      $scope.$on('zTreeModalClose', function(event, data) { //树弹窗关闭事件通信 返回data = {treeNodeId,treeNodeName}
        if ($scope.modalTreeInfo.treeType == 'region') {
          $scope.regionName = data.treeNodeName;
          $scope.regionCode = data.treeNodeId;
          $scope.regionInfo = data;
        } else if ($scope.modalTreeInfo.treeType == 'reach') {
          $scope.reachName = data.treeNodeName;
          $scope.reachCode = data.treeNodeId;
        } else if ($scope.modalTreeInfo.treeType == 'pollution') {
          if (treeNode.isParent) {
            layer.msg("请选择具体的污染源！");
            return;
          } else {
            $scope.pollutionName = data.treeNodeName;
            $scope.pollutionId = data.treeNodeId;
          }
        } else if ($scope.modalTreeInfo.treeType == 'video') {
          $scope.videoName = data.treeNodeName;
          $scope.videoId = data.treeNodeId;
        }
      })

      $scope.$watch('regionCode', function(n, o) {
        if ($scope.regionInfo != undefined) {
          locationToSelectRegion($scope.regionInfo);
        }
      });

      function locationToSelectRegion(data) {
        OneMapqueryAdminregionFromMysql.getRegionData(data.treeNode.id, data.treeNode.grade)
        if (MapUtil.isCoordValid(data.treeNode["longitude"], data.treeNode["latitude"])) {
          if ($localStorage.mapType != "arcgisDynamic") {
            MapUtil.center2LongLat(data.treeNode["longitude"], data.treeNode["latitude"], data.treeNode["grade"]);
          }
        } else {
          // console.warn("定位失败！坐标为空！");
          layer.msg('定位失败！坐标为空！', {
            time: 2000
          });
        }
      }

      //打开文件上传
      $scope.imgUpload = function() {
        document.getElementById("fileFrom").reset();
        $("#imgBox").modal('show');
      };
      //删除图片文件
      $scope.imgDelete = function($event) {
        $scope.imgObj = null;
        $scope.hasImg = false;
        $event.stopPropagation();
      };
      //上传文件
      $scope.fileInput = function() {
        var fd = new FormData();
        var file = $('#input-file').prop('files')[0];
        if (!file) {
          layer.msg("请选择文件");
          return;
        }
        fd.append('file', file);
        $scope._load = layer.load(3, {
          shade: [0.3, '#000000']
        });
        $http({
          method: 'POST',
          url: moduleService.getServiceUrl() + photosUrl + '/uploadImg',
          data: fd,
          headers: {
            'Content-Type': undefined
          },
          transformRequest: angular.identity
        }).success(
          function(res) {
            if (res.resCode === 1) {
              $scope.imgObj = res.data;
              $scope.hasImg = true;
              layer.msg("上传照片成功！", {
                time: 3000
              });
            } else {
              layer.msg("服务器异常，请稍后重试！", {
                time: 3000
              });
            }
            layer.close($scope._load);
          }).error(
          function(error) {
            layer.msg("服务器异常，请稍后重试！", {
              time: 2000
            });
            layer.close($scope._load);
          });
        $("#imgBox").modal('hide');
      };
      //查看文件
      $scope.lookImg = function() {
        $scope.imageUrl = $scope.imgObj.url;
        $scope.$apply();
        setTimeout(function() {
          $("#image").trigger('click');
          layer.photos({
            photos: '#layer-photos-demo',
            anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
          });
        }, 0)
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
          function(res) {
            var size = adds.length;
            for (var i = 0; i < size; i++) {
              $scope[adds[i]] = res.data;
            }
          }
        );
      }


      //养殖场类型初始化
      var cultivationType = function() {
        getType('3', 'cultivation_types');
      };
      //养殖场类型改变
      $scope.cultivation_change = function(cultivation_type) {
        $scope.cultivation_type_name = cultivation_type.typeName;
        $scope.cultivation_type_value = cultivation_type.typeValue;
      };

      //农场设施初始化
      var farmfacilityType = function() {
        getType('4', 'farmfacilitys');
      };
      //农场设施改变
      $scope.farmfacility_change = function(farmfacility) {
        $scope.farmfacility_name = farmfacility.typeName;
        $scope.farmfacility_value = farmfacility.typeValue;
      };

      //处理方式下拉框初始化
      var treatmentidType = function() {
        getType('5', 'treatmentids');
      };
      //处理方式改变
      $scope.treatmentid_change = function(treatmentid) {
        $scope.treatmentid_name = treatmentid.typeName;
        $scope.treatmentid_value = treatmentid.typeValue;
      };

      //是否入网下拉框初始化
      var isinternetworkType = function() {
        getType('6', 'isinternetworks');
      };
      //是否入网改变
      $scope.isinternetwork_change = function(isinternetwork) {
        $scope.isinternetwork_name = isinternetwork.typeName;
        $scope.isinternetwork_value = isinternetwork.typeValue;
      };

      //断面级别和显示级别初始化
      var sectionlevelType = function() {
        getType('1', 'sectionlevels', 'showlevels');
      };
      //断面级别改变
      $scope.sectionlevel_change = function(sectionlevel) {
        $scope.sectionlevel_name = sectionlevel.typeName;
        $scope.sectionlevel_value = sectionlevel.typeValue;
      };
      //显示级别改变
      $scope.showlevel_change = function(showlevel) {
        $scope.showlevel_name = showlevel.typeName;
        $scope.showlevel_value = showlevel.typeValue;
      };

      //当前水质和目标水质,水质等级初始化
      var nowqualityType = function() {
        getType('7', 'nowqualitys', 'targetqualitys', 'waterlevels');
      };
      //当前水质改变
      $scope.nowquality_change = function(nowquality) {
        $scope.nowquality_name = nowquality.typeName;
        $scope.nowquality_value = nowquality.typeValue;
      };
      //目标水质改变
      $scope.targetquality_change = function(targetquality) {
        $scope.targetquality_name = targetquality.typeName;
        $scope.targetquality_value = targetquality.typeValue;
      };

      //设备平台初始化
      var companyType = function() {
        getType('8', 'companys');
      };
      //设备平台改变
      $scope.company_change = function(company) {
        $scope.company_name = company.typeName;
        $scope.company_value = company.typeValue;
      };

      //网络协议初始化
      var protocolType = function() {
        getType('11', 'protocols');
      };
      //网络协议改变
      $scope.protocol_change = function(protocol) {
        $scope.protocol_name = protocol.typeName;
        $scope.protocol_value = protocol.typeValue;
      };

      //连接方式初始化
      var connectType = function() {
        getType('10', 'connecttypes');
      };
      //连接方式改变
      $scope.connecttype_change = function(connecttype) {
        $scope.connecttype_name = connecttype.typeName;
        $scope.connecttype_value = connecttype.typeValue;
      };

      //视频状态初始化
      var statusType = function() {
        getType('9', 'statuss');
      };
      //视频状态改变
      $scope.status_change = function(status) {
        $scope.status_name = status.typeName;
        $scope.status_value = status.typeValue;
      };

      //入河方式初始化
      var intorivermodeType = function() {
        getType('12', 'intorivermodes');
      };
      //入河方式改变
      $scope.intorivermode_change = function(intorivermode) {
        $scope.intorivermode_name = intorivermode.typeName;
        $scope.intorivermode_value = intorivermode.typeValue;
      };

      //排放方式初始化
      var dischargemodeType = function() {
        getType('13', 'dischargemodes');
      };
      //排放方式改变
      $scope.dischargemode_change = function(dischargemode) {
        $scope.dischargemode_name = dischargemode.typeName;
        $scope.dischargemode_value = dischargemode.typeValue;
      };

      //污染物种类初始化
      var pollutantType = function() {
        getType('14', 'pollutants', 'unitPollutantTypes');
      };
      //污染物种类改变
      $scope.pollutant_change = function(pollutant) {
        $scope.pollutant_name = pollutant.typeName;
        $scope.pollutant_value = pollutant.typeValue;
      };
      $scope.unitPollutantType_change = function(unitPollutantType) {
        $scope.unitPollutantType_name = unitPollutantType.typeName;
        $scope.unitPollutantType_value = unitPollutantType.typeValue;
      };
      //关注级别初始化
      var attentionLevelType = function() {
        getType('15', 'attentionLevels');
      };
      //关注级别改变
      $scope.attentionLevel_change = function(attentionLevel) {
        $scope.attentionLevel_name = attentionLevel.typeName;
        $scope.attentionLevel_value = attentionLevel.typeValue;
      };
      //水质等级改变
      $scope.waterlevel_change = function(waterlevel) {
        $scope.waterlevel_name = waterlevel.typeName;
        $scope.waterlevel_value = waterlevel.typeValue;
      };
      //控制级别初始化
      var controlType = function() {
        getType('1', 'controls');
      };
      //控制级别改变
      $scope.control_change = function(control) {
        $scope.control_name = control.typeName;
        $scope.control_value = control.typeValue;
      };

      //记录方式初始化
      var recordType = function() {
        getType('16', 'recordtypes');
      };
      //记录方式改变
      $scope.recordtype_change = function(recordtype) {
        $scope.recordtype_name = recordtype.typeName;
        $scope.recordtype_value = recordtype.typeValue;
      };
      //监测站数据类型初始化
      var monitorType = function() {
        getType('17', 'monitortypes');
      };
      //监测站数据类型改变
      $scope.monitortype_change = function(monitortype) {
        $scope.monitortype_name = monitortype.typeName;
        $scope.monitortype_value = monitortype.typeValue;
      };
      //水质判定初始化
      var determineType = function() {
        getType('7', 'waterlevels');
      };
      //该数组与typeName对应
      var checks = [checkMdAgripollution, checkMdInduspollution, checkMdLifepollution, checkMdSection,
        checkMdPumpstation, checkMdWatergate, checkMdRivervideo, checkMdOutfall,
        checkMdWater, checkGrSewageTreatmentFacilities, checkMdMonitor, checkFunctionalArea,
        checkIntake, checkWaterOutfall, checkWaterCard, checkReachImg, checkMdAgripollution
      ];

      //校验数据
      function checkData() {
        var re;
        if ($scope.big_Change_name == null) {
          layer.msg('请选择部件大类类型！', {
            time: 2000
          });
          return false;
        } else if ($scope.small_Change_name == null) {
          layer.msg('请选择具体部件小类类型！', {
            time: 2000
          });
          return false;
        }
        if ($scope.componentName == null || $scope.componentName === '') {
          layer.msg('请输入部件名称！', {
            time: 2000
          });
          return false;
        }
        if ($scope.isRepeat) {
          layer.msg('部件名称重复，请重新输入部件名称！', {
            time: 2000
          });
          return false;
        }
        if ($scope.regionCode == null) {
          layer.msg('请选择部件所属区域！', {
            time: 2000
          });
          return false;
        }
        if ($scope.point.longitude == null || $scope.point.longitude === '') {
          layer.msg('请输入所在经度！', {
            time: 2000
          });
          return false;
        } else {
          re = /^-?((1[0-7]?[0-9]?)(([.][0-9]{1,12})?)|(([0-9]?[0-9]?)([.][0-9]{1,12})?)|180(([.][0]{1,12})?))$/;
          if (isNaN($scope.point.longitude) || !re.test($scope.point.longitude)) {
            layer.msg('请输入正确经度,最大保留12位小数.<br>经度范围：-180.0000~180.0000', {
              time: 2000
            });
            return false;
          }
        }
        if ($scope.point.latitude == null || $scope.point.latitude === '') {
          layer.msg('请输入所在纬度！', {
            time: 2000
          });
          return false;
        } else {
          re = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,12})?)|90(([.][0]{1,12})?))$/;
          if (isNaN($scope.point.latitude) || !re.test($scope.point.latitude)) {
            layer.msg('请输入正确纬度,最大保留12位小数.<br>纬度范围：-90.0000~90.0000！', {
              time: 2000
            });
            return false;
          }
        }
        var flag = true;
        var index = typeName.indexOf($scope.small_Change_name);
        if (index !== -1) {
          flag = checks[index]();
        }
        return flag;
      }

      function checkMdInduspollution() {
        if (!norCheck($scope.induspollution_floorspace, '^\\d+(?:\.\\d{1,2})?$', '占地面积必须是正数且小数点后只保留2位')) {
          return false;
        }
        if (!norCheck($scope.induspollution_buildingspace, '^\\d+(?:\.\\d{1,2})?$', '建筑面积必须是正数且小数点后只保留2位')) {
          return false;
        }
        if (!norCheck($scope.induspollution_cellphone, '([0-9]{3,4}-)?[0-9]{7,8}',
          '电话格式错误，号码为7-8位，可加地区前缀<br>例：0571-89632145')) {
          return false;
        }
        if (!norCheck($scope.induspollution_telephone, '^1[0-9]{10}$', '手机号码格式错误，号码为11位 <br>例：13566998877')) {
          return false;
        }
        if (!norCheck($scope.induspollution_yearlycapacity, '^\\d+(?:\.\\d{1,2})?$', '年产量必须是正数且小数点后只保留2位')) {
          return false;
        }
        if (!norCheck($scope.induspollution_waterconsumption, '^\\d+(?:\.\\d{1,2})?$', '月用水量必须是正数且小数点后只保留2位')) {
          return false;
        }
        if (!norCheck($scope.induspollution_capofwateraftertreat, '^[0-9]+$', '污水排量请输入正整数')) {
          return false;
        }
        return true;
      }

      function checkMdAgripollution() {
        if (!norCheck($scope.agripollution_telephone, '^1[0-9]{10}$', '联系方式格式错误，号码为11位 <br>例：13566998877')) {
          return false;
        }
        if (!norCheck($scope.agripollution_floorspace, '^\\d+(?:\.\\d{1,2})?$', '占地面积必须是正数且小数点后只保留2位')) {
          return false;
        }
        if (!norCheck($scope.agripollution_buildingspace, '^\\d+(?:\.\\d{1,2})?$', '建筑面积必须是正数且小数点后只保留2位')) {
          return false;
        }
        if (!norCheck($scope.agripollution_capofpollution, '^[0-9]+$', '污水排量请输入正整数')) {
          return false;
        }
        return true;
      }

      function checkMdLifepollution() {
        if (!norCheck($scope.lifepollution_floorspace, '^\\d+(?:\.\\d{1,2})?$', '占地面积必须是正数且小数点后只保留2位')) {
          return false;
        }
        if (!norCheck($scope.lifepollution_buildingspace, '^\\d+(?:\.\\d{1,2})?$', '建筑面积必须是正数且小数点后只保留2位')) {
          return false;
        }
        if (!norCheck($scope.lifepollution_familynum, '^[0-9]+$', '户数请输入正整数')) {
          return false;
        }
        if (!norCheck($scope.lifepollution_population, '^[0-9]+$', '人口请输入正整数')) {
          return false;
        }
        if (!norCheck($scope.lifepollution_waterconsumption, '^[0-9]+$', '用水量请输入正整数')) {
          return false;
        }
        if (!norCheck($scope.lifepollution_capofpollution, '^[0-9]+$', '排放量请输入正整数')) {
          return false;
        }
        return true;
      }

      function checkMdOutfall() {
        if (!norCheck($scope.outfall_capofpollution, '^[0-9]+$', '污染处理量请输入正整数！')) {
          return false;
        }
        if (!norCheck($scope.outfall_unitCellphone, '^1[0-9]{10}$', '排污单位联系电话格式错误，号码为11位 <br>例：13566998877')) {
          return false;
        }
        if (!norCheck($scope.outfall_dischargeWasteWater, '^[0-9]+$', '排污单位批准的废污水年排放量请输入正整数！')) {
          return false;
        }
        if (!norCheck($scope.outfall_unitLongitude,
          '^-?((1[0-7]?[0-9]?)(([.][0-9]{1,12})?)|(([0-9]?[0-9]?)([.][0-9]{1,12})?)|180(([.][0]{1,12})?))$',
          '请输入正确的排污单位经度,最大保留12位<br>经度范围：-180.0000~180.0000')) {
          return false;
        }
        if (!norCheck($scope.outfall_unitLatitude, '^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,12})?)|90(([.][0]{1,12})?))$',
          '请输入正确的排污单位纬度，最大保留12位。<br>纬度范围：-90.0000~90.0000！')) {
          return false;
        }
        return true;
      }

      function checkMdSection() {
        if ($scope.nowquality_value == null) {
          layer.msg('请选择当前水质！', {
            time: 2000
          });
          return false;
        }
        return true;
      }

      function checkMdPumpstation() {
        if (!norCheck($scope.pumpstation_pumpnum, '^[0-9]+$', '水泵数量，请输入整数')) {
          return false;
        }
        if (!norCheck($scope.pumpstation_areacover, '^\\d+(?:\.\\d{1,2})?$', '占地面积必须是正数且小数点后只保留2位')) {
          return false;
        }
        return true;
      }

      function checkMdWatergate() {
        if (!norCheck($scope.watergate_gateFormNum, '^[0-9]+$', '闸门数量，请输入整数')) {
          return false;
        }
        if (!norCheck($scope.watergate_areacover, '^\\d+(?:\.\\d{1,2})?$', '占地面积必须是正数且小数点后只保留2位')) {
          return false;
        }
        return true;
      }

      function checkMdRivervideo() {
        if ($scope.status_value == null || $scope.status_value === '') {
          layer.msg("请选择视频状态！");
          return false;
        }
        var re =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if ($scope.rivervideo_serverip == null || $scope.rivervideo_serverip === '') {
          layer.msg("请输入视频服务器IP");
          return false;
        } else {
          if ($scope.rivervideo_serverip.split('.').length != 4 || !re.test($scope.rivervideo_serverip)) {
            layer.msg("错误的视频服务器IP地址<br>示例:127.0.0.1");
            return false;
          }
        }
        if ($scope.rivervideo_serverport == null || $scope.rivervideo_serverport === '') {
          layer.msg("请输入视频服务器端口");
          return false;
        }
        if (!norCheck($scope.rivervideo_serverport, '^[0-9]+$', '视频服务器端口错误，请输入整数')) {
          return false;
        }
        if ($scope.rivervideo_serveradminname == null || $scope.rivervideo_serveradminname === '') {
          layer.msg("请输入用户名");
          return false;
        }
        if ($scope.rivervideo_serveradminpwd == null || $scope.rivervideo_serveradminpwd === '') {
          layer.msg("请输入密码");
          return false;
        }
        if (!norCheck($scope.rivervideo_chn, '^[0-9]+$', '通道号错误，请输入整数')) {
          return false;
        }
        if ($scope.rivervideo_streamip != null && $scope.rivervideo_streamip !== '') {
          if ($scope.rivervideo_streamip.split('.').length != 4 || !re.test($scope.rivervideo_streamip)) {
            layer.msg("错误的流媒体服务器IP地址<br>示例:127.0.0.1");
            return false;
          }
        }
        if (!norCheck($scope.rivervideo_streamport, '^[0-9]+$', '流媒体服务器端口错误，请输入整数')) {
          return false;
        }
        return true;
      }

      function checkMdWater() {
        return true;
      }

      function checkGrSewageTreatmentFacilities() {
        if (!norCheck($scope.rivervideosewageTreatmentFacilities_celphone_streamport, '^1[0-9]{10}$',
          '联系手机格式错误，号码为11位 <br>例：13566998877')) {
          return false;
        }
        return true;
      }

      function checkMdMonitor() {
        if ($scope.monitortype_value == null) {
          layer.msg("请选择监测站数据类型！");
          return false;
        }
        return true;
      }

      function checkFunctionalArea() {
        if (!norCheck($scope.functionalArea_phone, '^1[0-9]{10}$', '联系电话格式错误，号码为11位 <br>例：13566998877')) {
          return false;
        }
        return true;
      }

      function checkIntake() {
        if (!norCheck($scope.intake_watercapacity, '^[0-9]+$', '日取水量请输入正整数！')) {
          return false;
        }
        if (!norCheck($scope.intake_phone, '^1[0-9]{10}$', '联系电话格式错误，号码为11位 <br>例：13566998877')) {
          return false;
        }
        return true;
      }

      function checkWaterOutfall() {
        return true;
      }

      function checkWaterCard() {
        return true;
      }

      function checkReachImg() {
        return true;
      }

      function norCheck(value, re, msg) {
        re = new RegExp(re);
        if (value == null || value === '') {
          return true;
        } else {
          if (isNaN(value) || !re.test(value)) {
            layer.msg(msg, {
              time: 2000
            });
            return false;
          }
          return true;
        }
      }

      //为对象添加属性
      function addData(obj) {
        obj.name = $scope.componentName;
        obj.complevel = $scope.grade_change_value;
        obj.mainclassid = $scope.big_Change_id;
        obj.subclassid = $scope.small_Change_id;
        obj.mainclassname = $scope.big_Change_name;
        obj.subclassname = $scope.small_Change_name;
        obj.source = $scope.source_change_value;
        obj.longitude = $scope.point.longitude;
        obj.latitude = $scope.point.latitude;
        obj.provinceid = $scope.regionCode;
        obj.remark = $scope.component_remark;
        obj.reachid = $scope.reachCode;
      }

      //访问后台的url
      var addUrls = ['agripollution', 'induspollution', 'lifepollution', 'section',
        'pumpstation', 'watergate', 'rivervideo', 'outfall',
        'water', 'sewageTreatmentFacilities', 'monitor', 'waterFunctionalArea',
        'intake', 'waterOutput', 'component', 'component', 'agripollution'
      ];

      //新增
      $scope.add = function() {
        var flag = checkData();
        if (!flag) {
          return;
        }
        var params;
        switch ($scope.small_Change_name) {
          case typeName[0]:
          case typeName[16]:
            params = {
              farmname: $scope.agripollution_farmname,
              yield: $scope.agripollution_yield,
              cultivationtype: $scope.cultivation_type_value,
              floorspace: $scope.agripollution_floorspace,
              buildingspace: $scope.agripollution_buildingspace,
              farmfacility: $scope.farmfacility_value,
              treatmentid: $scope.treatmentid_value,
              capofpollution: $scope.agripollution_capofpollution,
              chairman: $scope.agripollution_chairman,
              telephone: $scope.agripollution_telephone
            };
            break;
          case typeName[1]:
            params = {
              floorspace: $scope.induspollution_floorspace,
              buildingspace: $scope.induspollution_buildingspace,
              companyname: $scope.induspollution_companyname,
              chairman: $scope.induspollution_chairman,
              telephone: $scope.induspollution_telephone,
              cellphone: $scope.induspollution_cellphone,
              product: $scope.induspollution_product,
              yearlycapacity: $scope.induspollution_yearlycapacity,
              waterconsumption: $scope.induspollution_waterconsumption,
              capofwateraftertreat: $scope.induspollution_capofwateraftertreat,
              isinternetwork: $scope.isinternetwork_value,
              treatmentid: $scope.treatmentid_value
            };
            break;
          case typeName[2]:
            params = {
              floorspace: $scope.lifepollution_floorspace,
              buildingspace: $scope.lifepollution_buildingspace,
              familynum: $scope.lifepollution_familynum,
              population: $scope.lifepollution_population,
              waterconsumption: $scope.lifepollution_waterconsumption,
              capofpollution: $scope.lifepollution_capofpollution,
              treatmentid: $scope.treatmentid_value
            };
            break;
          case typeName[3]:
            params = {
              rivername: $scope.section_rivername,
              sectionlevel: $scope.sectionlevel_value,
              showlevel: $scope.showlevel_value,
              nowquality: $scope.nowquality_value,
              targetquality: $scope.targetquality_value
            };
            break;
          case typeName[4]:
            params = {
              ennmnm: $scope.pumpstation_ennmnm,
              adunnm: $scope.pumpstation_adunnm,
              model: $scope.pumpstation_model,
              pumpnum: $scope.pumpstation_pumpnum,
              areacover: $scope.pumpstation_areacover,
              lon: $scope.point.longitude,
              lat: $scope.point.latitude
            };
            break;
          case typeName[5]:
            params = {
              ennmnm: $scope.watergate_ennmnm,
              adunnm: $scope.watergate_adunnm,
              gateFormNum: $scope.watergate_gateFormNum,
              areacover: $scope.watergate_areacover,
              lon: $scope.point.longitude,
              lat: $scope.point.latitude
            };
            break;
          case typeName[6]:
            params = {
              serverip: $scope.rivervideo_serverip,
              serverport: $scope.rivervideo_serverport,
              serveradminname: $scope.rivervideo_serveradminname,
              serveradminpwd: $scope.rivervideo_serveradminpwd,
              chn: $scope.rivervideo_chn,
              chnname: $scope.rivervideo_chnname,
              streamip: $scope.rivervideo_streamip,
              streamport: $scope.rivervideo_streamport,
              deviceid: $scope.rivervideo_deviceid,
              vcontent: $scope.rivervideo_vcontent,
              company: $scope.company_value,
              protocol: $scope.protocol_value,
              connecttype: $scope.connecttype_value,
              status: $scope.status_value
            };
            break;
          case typeName[7]:
            params = {
              fileUrl: $scope.imgObj == null ? null : $scope.imgObj.virtualPath,
              fileName: $scope.imgObj == null ? null : $scope.imgObj.name,
              pollutionId: $scope.pollutionId,
              videoId: $scope.videoId,
              capofpollution: $scope.outfall_capofpollution,
              unitAddress: $scope.outfall_unitAddress,
              dischargemode: $scope.dischargemode_value,
              pollutant: $scope.pollutant_value,
              unitPollutantType: $scope.unitPollutantType_value,
              intorivermode: $scope.intorivermode_value,
              unitName: $scope.outfall_unitName,
              unitCellphone: $scope.outfall_unitCellphone,
              dischargeWasteWater: $scope.outfall_dischargeWasteWater,
              unitLatitude: $scope.outfall_unitLatitude,
              unitLongitude: $scope.outfall_unitLongitude
            };
            break;
          case typeName[8]:
            params = {
              waterlevel: $scope.waterlevel_value,
              control: $scope.control_value
            };
            break;
          case typeName[9]:
            params = {
              facilityName: $scope.sewageTreatmentFacilities_facilityName,
              treatmentid: $scope.treatmentid_value,
              attentionLevel: $scope.attentionLevel_value,
              principal: $scope.sewageTreatmentFacilities_principal,
              dutyunit: $scope.sewageTreatmentFacilities_dutyunit,
              celphone: $scope.sewageTreatmentFacilities_celphone
            };
            break;
          case typeName[10]:
            params = {
              sourceunit: $scope.monitor_sourceunit,
              controllevel: $scope.control_value,
              recordtype: $scope.recordtype_value,
              nowquality: $scope.nowquality_value,
              targetquality: $scope.targetquality_value,
              responseunit: $scope.monitor_responseunit,
              type: $scope.monitortype_value
            };
            break;
          case typeName[11]:
            params = {
              targetquality: $scope.targetquality_value,
              dutyunit: $scope.functionalArea_dutyunit,
              phone: $scope.functionalArea_phone,
              undercentralizedunit: $scope.functionalArea_undercentralizedunit
            };
            break;
          case typeName[12]:
            params = {
              watermode: $scope.intake_watermode,
              watercapacity: $scope.intake_watercapacity,
              wateruse: $scope.intake_wateruse,
              waterunit: $scope.intake_waterunit,
              waterunitperson: $scope.intake_waterunitperson,
              phone: $scope.intake_phone,
              undercentralizedunit: $scope.intake_undercentralizedunit
            };
            break;
          case typeName[14]:
            params = {
              fileUrl: $scope.imgObj == null ? null : $scope.imgObj.virtualPath,
              fileName: $scope.imgObj == null ? null : $scope.imgObj.name,
            };
            break;
          case typeName[15]:
            params = {
              fileUrl: $scope.imgObj == null ? null : $scope.imgObj.virtualPath,
              fileName: $scope.imgObj == null ? null : $scope.imgObj.name,
            };
            break;
          default:
            params = {};
            break;
        }
        addData(params);
        var index = typeName.indexOf($scope.small_Change_name);
        var addUrl = index === -1 ? "component" : addUrls[index];
        addHttp('post', moduleService.getServiceUrl() + modulePrefix + '/v1/' + addUrl + "/add", params);
      };
      var addHttp = function(method, url, params) {
        console.log(params, 'params')
        console.log(url, 'urlurlurl')
        $http({
          method: method,
          url: url,
          data: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest: function(obj) {
            return $.param(obj)
          }
        }).success(function(res) {
          if (res.resCode === 1) {
            layer.msg('新增成功', {
              shift: -1
            }, function() {
              $scope.back();
            });
          } else {
            layer.msg(res.resMsg || '请求失败,请稍后再试');
          }
        }).error(function(res) {
          layer.msg('服务器异常，请稍后重试！', {
            time: 2000
          });
        })
      };

      $scope.back = function() {
        // 跳转到菜单页面
        routeService.route(110, true);
      }

    }
  ]);

})(window, angular);
