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

    $scope.submitForm = function(){
        console.log($scope.data);
    }

});