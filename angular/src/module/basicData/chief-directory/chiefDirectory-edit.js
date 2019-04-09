var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var waterUrl = modulePrefix + "/v1/waterSystem";
var riverUrl = modulePrefix + "/v1/river";
var lakesUrl = modulePrefix + "/v1/lakes";
var reservoirUrl = modulePrefix + "/v1/reservoir";
var reachUrl = modulePrefix + "/v1/reach";
var dictionaryUrl = modulePrefix + "/v1/dictionary";
(function(window, angular) {
	'use strict';
	var app = angular.module("app");
	app.controller(
		'chiefDirectoryEdit', ['$localStorage','$scope','$rootScope','routeService','moduleService','$http',
		function chiefDirectoryEdit($localStorage, $scope, $rootScope, routeService,moduleService, $http) {
            if(!$localStorage.chiefEditData){
                layer.msg('获取数据失败,请重试');
                return;
            }
            $scope.chief = $localStorage.chiefEditData;
            
            $scope.chief.doc ?  $scope.chief.docId = $scope.chief.doc.id : '';
            $scope.chief.doc ?  $scope.chief.docName = $scope.chief.doc.filename: '';
            // $scope.chief.docId = $scope.chief.doc.id;
            // $scope.chief.docName = $scope.chief.doc.filename;
            $scope.chief.reach = filterName($scope.chief.reachIds);
            $scope.chief.lake = filterName($scope.chief.lakesIds);
            $scope.chief.reservoir = filterName($scope.chief.reservoirIds);
            $scope.chief.pond = filterName($scope.chief.pond);


            $scope.doc = {};
            $scope.file = {};
            // $scope.roleArrName = [];
            // $scope.roleArrNameStr = [];
			/*页面初始化方法*/
			$scope.init = function() {
               let rolesArr = [];
               $scope.checkboxShow = false;    
               $scope.roles = $scope.chief.roles || '';
               $http({
                    method: "get",
                    url: moduleService.getServiceUrl() + "/watersource/v1/reachChairMan/roleList"
                }).success(function (res) {
                    $scope.editChiefRole = res.data.concat();
                    let length = $scope.editChiefRole.length;
                    for(let i = 0; i <length ;i++){
                        $scope.editChiefRole[i].state = false
                    }
                    for(let j = 0; j < $scope.roles.length; j++){
                         rolesArr.push($scope.roles[j].name)
                         for(let i = 0; i <length ;i++){
                            if($scope.roles[j].id == $scope.editChiefRole[i].id){
                                $scope.editChiefRole[i].state = true 
                            } 
                         }
                    }
                     $scope.roleArrNameStr = rolesArr.join();

                })
            }

            $scope.inputSure = function(){
                let length = $scope.editChiefRole.length;
                let roleArrName = [];
                let roleArr = [];
                let roleArrId = [];
                for(let i = 0 ; i < length ; i ++){
                    if($scope.editChiefRole[i].state){
                        roleArr.push($scope.editChiefRole[i])
                        roleArrName.push($scope.editChiefRole[i].name)
                    }
                }
                for(let j = 0 ; j < roleArr.length ; j ++){
                    roleArrId.push(roleArr[j].id)
                }
                $scope.roleArrNameStr = roleArrName.join()
                $scope.rolesArrayId = roleArrId.join();



                $scope.checkboxShow = false;
            }

            function filterName(arr){
                var brr = [];
                if(arr && arr.length != 0){
                    angular.forEach(arr,function(each){
                        brr.push(each.name);
                    })
                }
                return brr;
            }

            $scope.inputOpen = function(){
                $scope.checkboxShow  ? $scope.checkboxShow = false : $scope.checkboxShow = true;
            }
            $scope.roleClick = function(role){

            }
            var getOfficial = function(){
                $http({
                    method: "get",
                    url: moduleService.getServiceUrl() + "/watersource/v1/doc/getOfficial"
                }).success(function (res) {
                    $scope.file.type = res.data;
                });
            }();

            //履职类型 自执行  下同
            $scope.dutyType = function () {
                $http({
                    method: "get",
                    url: moduleService.getServiceUrl() + reachUrl + "/chairmanType"
                }).success(function (res) {
                    $scope.dutyTypeList = res.data;
                });
            }
            //河湖库级别
            $scope.chiefGrade = function() {
                $http({
                    method: "get",
                    url: moduleService.getServiceUrl() + riverUrl + "/riverType",
                    params: {
                        type: '116'
                    },
                }).success(
                    function(res) {
                        $scope.chiefGradeList = res.data;
                    }
                );
            }

            $scope.regionShow = function(control) {
                $scope.regionControl = control;
                $scope.modalTreeInfo = {'treeType': 'region'};
                $("#treeModal").modal('show');
            }

            $scope.waterbodyShow = function(waterType) {
                if(!$scope.chief.regionName){
                    layer.msg('请先选择行政区域');
                    return;
                }
                $scope.waterControl = waterType;
                $scope.modalTreeInfo = {'treeType': 'waterbody', 'treeParam':{'regionCode': $scope.chief.regionCode,'waterType': waterType},'setting': {'check': {'enable': true,'chkStyle': "checkbox",'chkboxType': { "Y": "", "N": "" }}}};
                $("#treeModal").modal('show');
            }

            $scope.$on('zTreeModalClose', function(event,data) {
                if($scope.modalTreeInfo.treeType == 'region'){
                    if($scope.regionControl == 1){
                        $scope.chief.regionName = data.treeNodeName;
                        $scope.chief.regionCode = data.treeNodeId;
                    }else if($scope.regionControl == 2){
                        $scope.doc.regionName = data.treeNodeName;
                        $scope.doc.regionId = data.treeNodeId;
                    }else if($scope.regionControl == 3){
                        $scope.file.regionName = data.treeNodeName;
                        $scope.file.regionId = data.treeNodeId;
                    }
                }else if($scope.modalTreeInfo.treeType == 'waterbody'){
                    if($scope.waterControl == 0){
                        $scope.chief.reach = data.treeNodeNames;
                        $scope.chief.reachIds = BaseTreeNode(data.nodes);
                    }else if($scope.waterControl == 1){
                        $scope.chief.lake = data.treeNodeNames;
                        $scope.chief.lakesIds = BaseTreeNode(data.nodes);
                    }else if($scope.waterControl == 2){
                        $scope.chief.reservoir = data.treeNodeNames;
                        $scope.chief.reservoirIds = BaseTreeNode(data.nodes);
                    }else if($scope.waterControl == 3){
                        $scope.chief.pond = data.treeNodeNames;
                        $scope.chief.pondIds = BaseTreeNode(data.nodes);
                    }
                    
                }
            })

            function BaseTreeNode(arr){
                var brr = [];
                if(arr.length > 0){
                    angular.forEach(arr,function(each){
                        brr.push({id:each.id, name: each.name, grade: each.grade})
                    });
                }
                return brr;
            }

            $scope.chiefEdit = function(){
                var phoneReg=/^[1][3-9][0-9]{9}$/;
                if(!$scope.chief.name){
                    layer.msg('请输入河长姓名');
                    return;
                }else if(!$scope.chief.regionName){
                    layer.msg('请选择所属区域');
                    return;
                }else if(!$scope.chief.cellphone){
                    layer.msg('请输入手机号');
                    return;
                }else if(!phoneReg.test($scope.chief.cellphone)){
                    layer.msg('请输入11位手机号');
                    return;
                }
                $http({
                    method: 'PUT',
                    url: moduleService.getServiceUrl() + '/watersource/v1/reachChairMan/update',
                    data: {
                        id: $scope.chief.id,
                        name: $scope.chief.name,
                        // userName:$scope.chief.userName,
                        position: $scope.chief.position,
                        cellphone: $scope.chief.cellphone,
                        description: $scope.chief.description,
                        regionCode: $scope.chief.regionCode,
                        status: $scope.chief.status,
                        chairmanRole: $scope.chief.chairmanRole,
                        isAssess: $scope.chief.isAssess,
                        docId: $scope.chief.docId,
                        reachIds: JSON.stringify($scope.chief.reachIds),
                        lakesIds: JSON.stringify($scope.chief.lakesIds),
                        pondIds: JSON.stringify($scope.chief.pondIds),
                        reservoirIds: JSON.stringify($scope.chief.reservoirIds),
                        role:$scope.rolesArrayId
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest:function(obj){return $.param(obj)}
                }).success(function(res) {
                    if (res.resCode === 1) {
                        layer.msg('新增成功', {shift:-1}, function(){
                            $scope.back();
                        })
                    }else{
                        layer.msg(res.resMsg || "提交失败，请重试！");
                    }
                }).error(function(error){
                    layer.msg("服务器异常，请稍后重试！");
                });
            }

            $scope.attachBoxShow = function(){
                $("#input-file").fileinput('reset');
                $("#attachBox").modal('show');
            }
            $('#datetimepicker1').datetimepicker({
                format: 'YYYY-MM-DD',
                locale: moment.locale('zh-cn')
            }).on('dp.change', function(ev){
                var result = new moment(ev.date).format('YYYY-MM-DD HH:mm:ss');
                $scope.file.createdate = result;
            });
            $('#datetimepicker2').datetimepicker({
                format: 'YYYY-MM-DD',
                locale: moment.locale('zh-cn')
            }).on('dp.change', function(ev){
                var result = new moment(ev.date).format('YYYY-MM-DD HH:mm:ss');
                $scope.file.effectiveTime = result;
            });

            /*表单分页*/
            var reGetProducts = function() {
                if(!$scope.file.type){
                    return;
                }
                $http({
                    url: moduleService.getServiceUrl() + "/watersource/v1/doc/list",
                    method: 'GET',
                    params: {
                        type: $scope.file.type,
                        docName: $scope.doc.docName,
                        regionId: $scope.doc.regionId,
                        pageNumber: $scope.paginationConf.currentPage,
                        pageSize: $scope.paginationConf.itemsPerPage,
                    },
                }).success(function(res) {
                    if(res.resCode == 1){
                        $scope.paginationConf.totalItems = res.data.total;
                        $scope.moduleList = res.data.list;
                        $('.page-num').val($scope.paginationConf.currentPage);
                    }else{
                        layer.msg('服务器异常，请稍后再试');
                    }
                }).error(function(res) {
                    layer.msg('服务器异常，请稍后再试');
                });
            };
            /*配置分页基本参数*/
            $scope.paginationConf = {
                currentPage: 1,
                itemsPerPage: $rootScope.tempSize == null ? 10 : $rootScope.tempSize,
                pagesLength: 5,
                perPageOptions: [5, 10, 20, 50],
            };
            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage + file.type', reGetProducts);

            $scope.search = function(){
                $scope.paginationConf.currentPage = 1;
                reGetProducts();
            }

            $scope.reSet = function(){
                $scope.doc.docName = null;
                $scope.doc.regionName = null;
                $scope.doc.regionId = null;
                reGetProducts();
            }

            $scope.selectDoc = function(){
                var doc = $scope.file.doc.split('&&');
                $scope.chief.docId = doc[0];
                $scope.chief.docName = doc[1];
                $('#fileModal').modal('hide');
            }

			$("#input-file").fileinput({
                uploadUrl: '#', //上传的地址
                showUpload: false, //显示批量上传按钮
                showCaption: true, //是否显示标题
                showPreview: true, //是否显示预览
                language: "zh", //设置语言
                maxFileCount: 1,
                dropZoneEnabled: true,
                allowedFileExtensions: ['doc','docx','pdf']
            });

			$scope.fileInput = function(){
                var fd = new FormData();
                var files = $('#input-file').prop('files');
                if(files.length == 0){
                    layer.msg("请选择文件");
                    return ;
                }
                angular.forEach(files,function(each,index){
                    fd.append('files', each);
                })
                $http({
                    method: 'POST',
                    url: moduleService.getServiceUrl() + '/watersource/v1/attachment/upload',
                    data: fd,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).success(function(res) {
                    if (res.resCode === 1) {
                        $scope.file.documents = res.data;
                        $scope.file.docName = $scope.file.documents[0].name;
                        $("#attachBox").modal('hide');
                    }else{
                        layer.msg(res.resMsg || "上传失败，请重试！");
                    }
                }).error(function(error){
                    layer.msg("服务器异常，请稍后重试！");
                });
            };

            $scope.addDispatch = function(){
                if(!$scope.file.filename){
                    layer.msg('请输入文件名称');
                    return;
                }else if(!$scope.file.createdate){
                    layer.msg('请输入印发日期');
                    return;
                }else if(!$scope.file.createdate){
                    layer.msg('请输入印发日期');
                    return;
                }else if(!$scope.file.regionId){
                    layer.msg('请输入发文区域');
                    return;
                }else if(!$scope.file.agency){
                    layer.msg('请输入发文机构');
                    return;
                }else if(!$scope.file.effectiveTime){
                    layer.msg('请输入公告日期');
                    return;
                }else if(!$scope.file.media){
                    layer.msg('请输入公告媒体');
                    return;
                }else if(!$scope.file.documents){
                    layer.msg('请上传公告文件');
                    return;
                }
                $http({
                    method: 'POST',
                    url: moduleService.getServiceUrl() + '/watersource/v1/doc/addSimple',
                    data: {
                        typeId: $scope.file.type,
                        filename: $scope.file.filename,
                        createdate: $scope.file.createdate,
                        regionid: $scope.file.regionId,
                        agency: $scope.file.agency,
                        effectiveTime: $scope.file.effectiveTime,
                        media: $scope.file.media,
                        jsonFiles: JSON.stringify($scope.file.documents),
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest:function(obj){return $.param(obj)}
                }).success(function(res) {
                    if (res.resCode === 1) {
                        layer.msg('修改成功', {shift:-1}, function(){
                            $('#addfileModal').modal('hide');
                            $scope.file = {};
                        })
                        reGetProducts();
                    }else{
                        layer.msg(res.resMsg || "上传失败，请重试！");
                    }
                }).error(function(error){
                    layer.msg("服务器异常，请稍后重试！");
                });
            }

            $scope.back = function() {
                routeService.route(118, true);
            }
		}
	]);
})(window, angular);