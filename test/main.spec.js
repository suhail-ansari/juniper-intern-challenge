describe('Check Controller Initialisation', function(){
    
    var scope, $location, createController;
    
    beforeEach(module('juniper-app'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        createController = function() {
            return $controller('MainController', {
                '$scope': scope
            });
        };
    }));

    it('Check for initial form values', function() {
        var controller = createController();
        expect(scope.data).toEqual({
            start_time: {date: "", time: ""},
            end_time: {date: "", time: ""},
            table: "traffic_table",
            select_fields: [],
            where: []
        });
    });

    it('Check for initial date values', function() {
        var controller = createController();
        expect(scope.startDateOptions).toEqual({maxDate: ""});
        expect(scope.endDateOptions).toEqual({minDate: ""});
        expect(scope.format).toEqual("MM/dd/yyyy");
        expect(scope.isDatepickerOpen).toEqual([false, false]);
        expect(scope.toggleMinDate).toBeDefined();
        expect(scope.toggleMaxDate).toBeDefined();
    });

    it('Checks for inital values and methods for query builder', function(){
        var controller = createController();
        expect(scope.isValidQueryGroup).toEqual([]);
        expect(scope.addNewOrQueryGroup).toBeDefined();
        expect(scope.deleteOrQueryGroup).toBeDefined();
        expect(scope.addNewAndQuery).toBeDefined();
        expect(scope.deleteAndQuery).toBeDefined();
        expect(scope.queryString).toEqual("");
    });

    it('Checks for form validations inital values and methods', function(){
        var controller = createController();
        expect(scope.isValidTableName).toBeTruthy();
        expect(scope.isStartDateValid).toBeTruthy();
        expect(scope.isStartTimeValid).toBeTruthy();
        expect(scope.isEndDateValid).toBeTruthy();
        expect(scope.isEndTimeValid).toBeTruthy();
        expect(scope.isSelectFieldValid).toBeTruthy();
        expect(scope.validateDate).toBeDefined();
        expect(scope.combineDateTime).toBeDefined();
        expect(scope.validateWhereClause).toBeDefined();
        expect(scope.submitForm).toBeDefined();
        expect(scope.displayResult).toBeDefined();
    });
});

describe('Check datepicker methods', function(){
    var scope, $location, createController;
    
    beforeEach(module('juniper-app'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        createController = function() {
            return $controller('MainController', {
                '$scope': scope
            });
        };
    }));

    it('Checks toggleMaxDate method', function(){
       var controller = createController();
       expect(scope.data.end_time.date).toEqual("");
       var newDate = new Date();
       scope.data.end_time.date = newDate;
       scope.toggleMaxDate();
       expect(scope.isStartDateValid).toBeTruthy();
       expect(scope.isStartTimeValid).toBeTruthy();
       expect(scope.startDateOptions.maxDate).toEqual(newDate);
    });

    it('Checks toggleMinDate method', function(){
       var controller = createController();
       expect(scope.data.start_time.date).toEqual("");
       var newDate = new Date();
       scope.data.start_time.date = newDate;
       scope.toggleMinDate();
       expect(scope.isEndDateValid).toBeTruthy();
       expect(scope.isEndTimeValid).toBeTruthy();
       expect(scope.endDateOptions.minDate).toEqual(newDate);
    });

});

describe('Check query builder methods', function(){
    var scope, $location, createController;
    
    beforeEach(module('juniper-app'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        createController = function() {
            return $controller('MainController', {
                '$scope': scope
            });
        };
    }));

    it('Ckecks addNewOrQueryGroup method', function(){
        var controller = createController();
        expect(scope.data.where.length).toEqual(0);
        scope.addNewOrQueryGroup();
        expect(scope.data.where.length).toEqual(1);
    });

    it('Ckecks deleteOrQueryGroup method', function(){
        var controller = createController();
        scope.addNewOrQueryGroup();
        expect(scope.data.where.length).toEqual(1);
        scope.deleteOrQueryGroup(0);
        expect(scope.data.where.length).toEqual(0);
        expect(scope.deleteOrQueryGroup(2)).toBeFalsy();
    });

    it('Ckecks addNewAndQuery method', function(){
        var controller = createController();
        expect(scope.data.where.length).toEqual(0);
        scope.addNewOrQueryGroup();
        expect(scope.data.where.length).toEqual(1);
        expect(scope.data.where[0].length).toEqual(0);
        scope.addNewAndQuery(0);
        expect(scope.data.where[0].length).toEqual(1);
        expect(scope.data.where[0][0]).toEqual({name:"", operator:"", value:""});
    });

    it('Ckecks deleteAndQuery method', function(){
        var controller = createController();
        expect(scope.data.where.length).toEqual(0);
        scope.addNewOrQueryGroup();
        expect(scope.data.where.length).toEqual(1);
        expect(scope.data.where[0].length).toEqual(0);
        scope.addNewAndQuery(0);
        expect(scope.data.where[0].length).toEqual(1);
        expect(scope.data.where[0][0]).toEqual({name:"", operator:"", value:""});
        scope.deleteAndQuery(0, 0);
        expect(scope.data.where[0].length).toEqual(0);

        expect(scope.deleteAndQuery(1, 1)).toBeFalsy();

    });

});

describe('Check form validation methods', function(){
    var scope, $location, createController;
    
    beforeEach(module('juniper-app'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        createController = function() {
            return $controller('MainController', {
                '$scope': scope
            });
        };
    }));

    it('Checks validateDate method', function(){
        var controller = createController();
        expect(scope.validateDate({date:"", time:""})).toBeFalsy();
        expect(scope.validateDate({date: new Date(), time:""})).toBeFalsy();
        expect(scope.validateDate({date:"", time:new Date()})).toBeFalsy();
        expect(scope.validateDate({date: new Date(), time: new Date()})).toBeTruthy();
    });

    it('Checks validateDate method', function(){
        var controller = createController();
        var newDate = new Date();
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        expect(scope.combineDateTime({date: newDate, time: newDate})).toEqual(newDate.getTime());
        expect(scope.combineDateTime({date: "", time: ""})).toBeFalsy();
    });

    it('Checks validateWhereClause method', function(){
        var controller = createController();
        var queryGroups = [
            [{}],
            [{}]
        ]
        expect(scope.validateWhereClause(queryGroups)).toBeFalsy();

        var queryGroups = [
            [{name:"", value:"a", operator:"="}]
        ]
        expect(scope.validateWhereClause(queryGroups)).toBeFalsy();

        var queryGroups = [
            [{name:"a", value:"", operator:"="}]
        ]
        expect(scope.validateWhereClause(queryGroups)).toBeFalsy();

        var queryGroups = [
            [{name:"a", value:"a", operator:""}]
        ]
        expect(scope.validateWhereClause(queryGroups)).toBeFalsy();

        var queryGroups = [
            [{name:"destination", value:"a", operator:"="}]
        ]
        expect(scope.validateWhereClause(queryGroups)).toBeTruthy();
    });

    it('Checks validateForm method with initial data', function(){
        var controller = createController();
        expect(scope.validateForm(scope.data)).toBeFalsy();
    });

    it('Checks validateForm method with start_time unset data', function(){
        var controller = createController();
        scope.data = {
            start_time: {date:"", time:""},
            end_time: {date: new Date(), time: new Date()},
            select_fields: ['source_vn'],
            where: []
        };
        expect(scope.validateForm(scope.data)).toBeFalsy();
    });
    
    it('Checks validateForm method with end_time unset data', function(){
        var controller = createController();
        scope.data = {
            start_time: {date: new Date(), time: new Date()},
            end_time: {date:"", time:""},
            select_fields: ['source_vn'],
            where: []
        };
        expect(scope.validateForm(scope.data)).toBeFalsy();

    });
    
    it('Checks validateForm method with end_time < start_time', function(){
        var controller = createController();

        var startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() + 1);

        var endDate = new Date();

        scope.data = {
            end_time: {date: endDate, time: endDate},
            start_time: {date: startDate, time: startDate},
            select_fields: ['source_vn'],
            where: []
        };
        expect(scope.validateForm(scope.data)).toBeFalsy();
    });
    
    it('Checks validateForm method with invalid where clause', function(){
        var controller = createController();
        
        scope.data = {
            start_time: {date: new Date(), time: new Date()},
            end_time: {date: new Date(), time: new Date()},
            select_fields: ['source_vn'],
            where: [[{}]]
        };
        expect(scope.validateForm(scope.data)).toBeFalsy();
        
        scope.data.where[0][0] = {name: '', operator: '=', value: 'a'};
        expect(scope.validateForm(scope.data)).toBeFalsy();

        scope.data.where[0][0] = {name: 'a', operator: '', value: 'a'};
        expect(scope.validateForm(scope.data)).toBeFalsy();

        scope.data.where[0][0] = {name: 'a', operator: '=', value: ''};
        expect(scope.validateForm(scope.data)).toBeFalsy();
    });

    it('Checks validateForm method with valid full where clause', function(){
        var controller = createController();
        
        scope.data = {
            start_time: {date: new Date(), time: new Date()},
            end_time: {date: new Date(), time: new Date()},
            select_fields: ['source_vn'],
            where: [[{name: 'a', operator: '=', value: 'a'}]]
        };

        var startTimeStamp = scope.combineDateTime(scope.data.start_time);
        var endTimeStamp = scope.combineDateTime(scope.data.end_time);

        expect(scope.validateForm(scope.data)).toEqual({
            start_time: startTimeStamp,
            end_time: endTimeStamp,
            select_fields: ['source_vn'],
            where_clause: [[{name: 'a', operator: '=', value: 'a'}]]
        });

    });

});