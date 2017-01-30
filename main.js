var app = angular.module("juniper-app", ["ui.bootstrap"]);

app.controller('MainController', function($scope){

    // initialize form data for ng-model
    $scope.data = {
        start_time: {date: "", time: ""},
        end_time: {date: "", time: ""},
        table: "",
        select_fields: [],
        where: []
    }

    // datepicker options
    $scope.startDateOptions = {
        maxDate: $scope.data.end_time.date
    }

    $scope.endDateOptions = {
        minDate: $scope.data.start_time.date
    }
    
    $scope.format = "MM/dd/yyyy";
    $scope.isDatepickerOpen = [false, false];
    
    $scope.toggleMinDate = function(){
        $scope.isEndDateValid = true;
        $scope.isEndTimeValid = true;
        $scope.endDateOptions.minDate = $scope.data.start_time.date;
    }

    $scope.toggleMaxDate = function(){
        $scope.isStartDateValid = true;
        $scope.isStartTimeValid = true;
        $scope.startDateOptions.maxDate = $scope.data.end_time.date;
    }

    // variables to track if a query group 
    // is valid and show error
    $scope.isValidQueryGroup = [];

    /**
     * Add new OR query group to the where clause
     */
    $scope.addNewOrQueryGroup = function(){
        $scope.data.where.push([]);
        $scope.isValidQueryGroup.push(true);
    }

    /**
     * Delete OR query group at index
     * @param {number} index: index of the OR query group to be removed
     */
    $scope.deleteOrQueryGroup = function(index){
        if(index >= $scope.data.where.length){
            return false;
        }
        $scope.data.where.splice(index, 1);
        $scope.isValidQueryGroup.splice(index, 1);
    }

    /**
     * Add new AND query to OR group and index
     * @param {number} index: index of the OR group to add the query to
     */
    $scope.addNewAndQuery = function(index){
        $scope.data.where[index].push({
            name: "",
            operator: "",
            value: ""
        });
    }

    /**
     * Delete AND query in a group
     * @param {number} parentIndex: index of the parent OR query group
     * @param {number} index: index of the AND query to remove
     */
    $scope.deleteAndQuery = function(parentIndex, index){
        if(parentIndex >= $scope.data.where.length || index >= $scope.data.where[parentIndex].length){
            return false;
        }
        $scope.data.where[parentIndex].splice(index, 1);
    }   

    // model for the generated text query 
    $scope.queryString = "";
    // watch the model $scope.data for changes to generate the text query
    $scope.$watch('data.where', function(newValue, oldValue){
        $scope.queryString = "";
        newValue.map(function(andGroup, i){

            $scope.queryString += ((i > 0)?" OR ":"") + "(";
            andGroup.map(function(query, j){
                $scope.queryString += ((j > 0)?" AND ":"") + query.name + " " + query.operator + " " + query.value;
            });
            $scope.queryString += ")";
        });
    }, true);

    
    // track if the value in the fields are valid
    $scope.isValidTableName = true;
    $scope.isStartDateValid = true;
    $scope.isStartTimeValid = true;
    $scope.isEndDateValid = true;
    $scope.isEndTimeValid = true;
    $scope.isSelectFieldValid = true;
    
    /**
     * Validate submitted form
     * @param {object} data: form model
     * @param {string} data.table: table name
     * @param {object} data.start_time: object containing models for start date/time
     * @param {Date} data.start_time.date: Date object for start date
     * @param {Date} data.start_time.time: date object for start time
     * @param {object} data.end_time: object containing models for end date/time
     * @param {Date} data.end_time.date: Date object for end date
     * @param {Date} data.end_time.time: date object for end time
     * @param {array} data.select_fields: array containing options selected from the select field 
     * @param {array} data.where: array containing the OR query groups
     * @param {object} data.where[item]: query info object
     * @param {string} data.where[item].name: name of the field
     * @param {string} data.where[item].operator: query operator
     * @param {string} data.where[item].value: value of the field
     * 
     * @return {false} : return false if form is not valid
     * @return {object} : return validated data object
     */
    $scope.validateForm = function(data){
        var isValid = true;
        var res = {};
        if(data.table == undefined || data.table == 0){
            $scope.isValidTableName = false;
            isValid;
        } else {
            res.table_name = data.table;
        }

        if($scope.validateDate(data.start_time)){
            res.start_time = $scope.combineDateTime(data.start_time);
            if(!res.start_time) {
                $scope.isStartDateValid = false;
                $scope.isStartTimeValid = false;
                isValid = false;
            }
        } else {
            $scope.isStartDateValid = false;
            $scope.isStartTimeValid = false;
            isValid = false;
        }

        if($scope.validateDate(data.end_time)){
            res.end_time = $scope.combineDateTime(data.end_time);
            if(!res.end_time) {
                $scope.isEndDateValid = false;
                $scope.isEndTimeValid = false;
                isValid = false;
            }
        } else {
            $scope.isEndDateValid = false;
            $scope.isEndTimeValid = false;
            isValid = false;
        }

        if(res.start_time > res.end_time){
            $scope.isStartDateValid = false;
            $scope.isStartTimeValid = false;
            $scope.isEndDateValid = false;
            $scope.isEndTimeValid = false;
            isValid = false;
        }

        if(data.select_fields.length <= 0){
            $scope.isSelectFieldValid = false;
            isValid = false;
        } else {
            res.select_fields = data.select_fields;
        }

        if(!$scope.validateWhereClause(data.where)){
            isValid = false;
        } else {
            res.where_clause = data.where;
        }

        if(isValid){
            return res;
        }
        return isValid;
    }
    
    /**
     * Check if the values selected from datepicker and timepicker are valid
     * @param {object} dateTime: object containing models for start date/time
     * @param {Date} dateTime.date: Date object for start date
     * @param {Date} dateTime.time: date object for start time
     * 
     * @return {boolean}
     */
    $scope.validateDate = function(dateTime){
        if(dateTime.date instanceof Date && dateTime.time instanceof Date){
            return true;
        }
        return false;
    }
    
    /**
     * combines the date and time fields from the datepicker and timepicker
     * @param {object} dateTime: object containing models for start date/time
     * @param {Date} dateTime.date: Date object for start date
     * @param {Date} dateTime.time: date object for start time
     * 
     * @return {number}: unix timestamp of the combined date and time
     */
    $scope.combineDateTime = function(dateTime){
        if(!$scope.validateDate(dateTime)){
            return false;
        }
        var combinedDate = new Date();
        combinedDate.setMonth(dateTime.date.getMonth());
        combinedDate.setDate(dateTime.date.getDate());
        combinedDate.setYear(dateTime.date.getFullYear());
        combinedDate.setHours(dateTime.time.getHours());
        combinedDate.setMinutes(dateTime.time.getMinutes());
        combinedDate.setSeconds(0);
        combinedDate.setMilliseconds(0);
        return combinedDate.getTime();
    }
    
    /**
     * @param {array} queryGroups: array containing the OR query groups
     * @param {array} queryGroups[item]: array containing query objects
     * @param {object} queryGroups[item][item]: object containing query fields
     * @param {string} queryGroups[item][item].name: name of the field
     * @param {string} queryGroups[item][item].operator: query operator
     * @param {string} queryGroups[item][item].value: value of the field
     * 
     * @return {boolean}: if the where clause is valid or not
     */
    $scope.validateWhereClause = function(queryGroups){
        var isValid = true;
        $scope.isValidQueryGroup = queryGroups.map(function(queryGroup){
            var _isValidQueryGroup = true;
            queryGroup.map(function(query){
                isValid = isValid && (query.name != undefined && query.name != "") &&
                    (query.operator != undefined && query.operator != "") &&
                    (query.value != undefined && query.value != "");
                _isValidQueryGroup = _isValidQueryGroup && isValid;
            });
            return _isValidQueryGroup;
        });
        return isValid;
    }

    /**
     * Submit handler for the form. Checks if the form is valid and then displays
     * the result.
     */
    $scope.submitForm = function(){

        $scope.isStartDateValid = true;
        $scope.isStartTimeValid = true;
        $scope.isEndDateValid = true;
        $scope.isEndTimeValid = true;
        $scope.isSelectFieldValid = true;
        
        var res = $scope.validateForm($scope.data);
        console.log(res);
        if(res){
            $scope.displayResult(res);
        }
    }
        
    /**
     * Display result in the result panel
     */
    $scope.displayResult = function(data){
        $scope.showResult = true;
        $scope.jsonResult = angular.toJson(data, 2);
    }

});