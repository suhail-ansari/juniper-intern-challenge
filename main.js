var app = angular.module("juniper-app", ["ngRoute", "ui.bootstrap"]);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'main-view.html', 
        controller: 'MainController'
    })
    .otherwise({
        redirectTo: '/'
    });
});


app.controller('MainController', function($scope){

    // datepicker options
    $scope.datpickerOptions = {
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
    }
    $scope.format = "MM/dd/yyyy";
    $scope.isDatepickerOpen = [false, false];
    
    $scope.data = {
        start_time: {date: "", time: ""},
        end_time: {date: "", time: ""},
        table: "traffic_table",
        select_fields: [],
        where: []
    }
    
    $scope.isValidQueryGroup = [];
    $scope.addNewOrQueryGroup = function(){
        $scope.data.where.push([]);
        $scope.isValidQueryGroup.push(true);
    }

    $scope.deleteOrQueryGroup = function(index){
        $scope.data.where.splice(index, 1);
        $scope.isValidQueryGroup.splice(index, 1);
    }

    $scope.addNewAndQuery = function(index){
        $scope.data.where[index].push({
            name: "",
            operator: "",
            value: ""
        });
    }

    $scope.queryString = "";
    $scope.$watch('data.where', function(newValue, oldValue){
        console.log(newValue, oldValue);
        $scope.queryString = "";
        newValue.map(function(andGroup, i){

            $scope.queryString += ((i > 0)?" OR ":"") + "(";
            andGroup.map(function(query, j){
                $scope.queryString += ((j > 0)?" AND ":"") + query.name + " " + query.operator + " " + query.value;
            });
            $scope.queryString += ")";
        });
    }, true);

    $scope.deleteOrQuery = function(parentIndex, index){
        $scope.data.where[parentIndex].splice(index, 1);
    }   

    $scope.isStartDateValid = true;
    $scope.isStartTimeValid = true;
    $scope.isEndDateValid = true;
    $scope.isEndTimeValid = true;
    $scope.isSelectFieldValid = true;
    
    $scope.dialogOptions = {
        show: false,
        title: "",
        message: "",
        buttons: []
    }

    $scope.submitForm = function(){

        $scope.isStartDateValid = true;
        $scope.isStartTimeValid = true;
        $scope.isEndDateValid = true;
        $scope.isEndTimeValid = true;
        $scope.isSelectFieldValid = true;
        
        var res = {};
        
        res.table_name = $scope.data.table;
        
        if(!$scope.data.start_time.date || !$scope.data.start_time.time){
            $scope.isStartDateValid = false;
            $scope.isStartTimeValid = false;
        } else {
            var startDate = new Date();
            startDate.setMonth($scope.data.start_time.date.getMonth());
            startDate.setDate($scope.data.start_time.date.getDate());
            startDate.setYear($scope.data.start_time.date.getFullYear());
            startDate.setHours($scope.data.start_time.time.getHours());
            startDate.setMinutes($scope.data.start_time.time.getMinutes());
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);
            res.start_time = startDate.getTime();
        }

        if(!$scope.data.end_time.date || !$scope.data.end_time.time){
            $scope.isEndDateValid = false;
            $scope.isEndTimeValid = false;
        } else {
            var endDate = new Date();
            endDate.setMonth($scope.data.end_time.date.getMonth());
            endDate.setDate($scope.data.end_time.date.getDate());
            endDate.setYear($scope.data.end_time.date.getFullYear());
            endDate.setHours($scope.data.end_time.time.getHours());
            endDate.setMinutes($scope.data.end_time.time.getMinutes());
            endDate.setSeconds(0);
            endDate.setMilliseconds(0);
            res.end_time = endDate.getTime();
        }

        if($scope.data.select_fields.length < 1){
            $scope.isSelectFieldValid = false;
        } else {
            res.select_fields = $scope.data.select_fields;
        }

        if($scope.isStartDateValid &&
            $scope.isStartTimeValid &&
            $scope.isEndDateValid &&
            $scope.isEndTimeValid &&
            $scope.isSelectFieldValid &&
            $scope.validateQuery($scope.data.where)) {
                res.where_clause = $scope.data.where; 
                $scope.displayResult(res);
            }
    }

    $scope.validateQuery = function(queryGroups){
        var isValid = true;
        $scope.isValidQueryGroup = queryGroups.map(function(queryGroup){
            var _isValidQueryGroup = true;
            queryGroup.map(function(query){
                isValid = isValid && (query.name != "") && (query.operator != "") && (query.value != "");
                _isValidQueryGroup = _isValidQueryGroup && isValid;
            });
            return _isValidQueryGroup;
        });
        console.log(queryGroups, isValid, $scope.isValidQueryGroup);
        return isValid;
    }

    $scope.displayResult = function(data){
        $scope.showResult = true;
        $scope.jsonResult = angular.toJson(data, 2);
    }

});