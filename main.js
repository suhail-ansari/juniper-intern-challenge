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
    

    $scope.showResult = false;

    $scope.data = {
        start_time: {date: "", time: ""},
        end_time: {date: "", time: ""},
        table: "traffic_table",
        select_fields: [],
        where: []
    }

    $scope.addNewOrQueryGroup = function(){
        $scope.data.where.push([]);
    }

    $scope.deleteOrQueryGroup = function(index){
        $scope.data.where.splice(index, 1);
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

    $scope.isStarDateValid = true;
    $scope.isStarTimeValid = true;
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
        
    }


});