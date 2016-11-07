/**
 * Created by Lei on 9/23/16.
 */
var myApp = angular.module('myApp',[]);

myApp.controller('registerController',function($scope,DataFactory, ValidateService,$window){
    $scope.user = {};
    $scope.data = DataFactory;

    $scope.disableState = true;
    $scope.stateSytle={"background-color":'lightgray'};
    $scope.passedCheck =false;
    $scope.showPassword=false;

    $scope.$watch('user.country',function(newvalue, oldvalue){
        if(newvalue=="1"){
            $scope.disableState=false;
            $scope.stateSytle['background-color'] = 'white';
        }else{
            $scope.disableState=true;
            $scope.stateSytle['background-color'] = 'lightgray';
            $scope.msgState="";
            delete $scope.user.state;
        }
    })

    $scope.show = function(){
        $scope.showPassword=!$scope.showPassword;
    }

    $scope.submit= function(){
        $scope.passedCheck = 0;
        //validate first name
        if(ValidateService.simpleValidate($scope.registerForm.inputFirstName.$valid,$scope,"msgFirstName","first name")){
            $scope.passedCheck ++;
        }
        //validate last name
        if(ValidateService.simpleValidate($scope.registerForm.inputLastName.$valid,$scope,"msgLastName","last name")){
            $scope.passedCheck ++;
        }
        //validate company name
        if(ValidateService.simpleValidate($scope.registerForm.inputCompanyName.$valid,$scope,"msgCompanyName","company name")){
            $scope.passedCheck ++;
        }
        //validate email
        if(ValidateService.validateEmail($scope.user.email,$scope.registerForm.inputEmail.$error.email,$scope.registerForm.inputEmail.$valid,$scope,"msgEmail")){
            $scope.passedCheck ++;
        }
        //validate US phone(right now can only validate US phone)
        if(ValidateService.validateUSPhone($scope.user.phone, $scope.registerForm.inputPhone.$valid,$scope,"msgPhone")){
            $scope.passedCheck ++;
        }
        //validate country
        if(ValidateService.simpleSelectValidate($scope.registerForm.inputCountry.$valid,$scope,"msgCountry","country")){
            $scope.passedCheck ++;
        }
        //validate state
        if($scope.disableState){
            $scope.passedCheck ++;
        }else if(ValidateService.simpleSelectValidate($scope.registerForm.inputState.$valid,$scope,"msgState","state")){
            $scope.passedCheck ++;
        }
        //validate industry
        if(ValidateService.simpleSelectValidate($scope.registerForm.inputIndustry.$valid,$scope,"msgIndustry","industry")){
            $scope.passedCheck ++;
        }
        //validate zipcode(right now zipcode is not validated)
        if(ValidateService.simpleValidate($scope.registerForm.inputZip.$valid,$scope,"msgZip","zip")){
            $scope.passedCheck ++;
        }
        //validate password
        if(ValidateService.validatePassword($scope.user.password, $scope.registerForm.inputPassword.$valid,$scope,"msgPassword")){
            $scope.passedCheck ++;
        }
        //confirm password
        if($scope.user.password!=$scope.user.confirmPassword){
            $scope.msgConfirmPassword= "The password are not same, please reenter.";
        }else{
            $scope.msgConfirmPassword ="";
            $scope.passedCheck ++;
        }
        //finally check
        if($scope.passedCheck==11){
            $window.location.href = 'registerSuccessfully.html';
        }
    };
})

myApp.service('ValidateService',function(){
    ////for validation of simple text input
    ////function signature-----------------------------
    //valid: the valid property of the input you want to check. eg:[$scope.(Form Name).(Input Name).$valid]
    //$scope: angular $scope
    //messageName:the the property you want to store display message. eg:$scope[messageName]
    //messageContent: the message content you want to displany. eg:"Please enter your [messageContent].";
    this.simpleValidate = function(valid,$scope, messageName, messageContent){
        //if valid is true , means the required content has been filled. return true.
        if(valid){
            $scope[messageName]="";
            return true;
        }else{
            $scope[messageName]="Please enter your "+ messageContent + ".";
            return false;
        }
    };
    //for validation of selection list
    ////function signature-----------------------------is the same as above
    this.simpleSelectValidate = function(valid,$scope, messageName, messageContent){
        //if valid is true , means the required content has been selected. return true.
        if(valid){
            $scope[messageName]="";
            return true;
        }else{
            $scope[messageName]="Please select your "+ messageContent+ ".";
            return false;
        }
    };
    //for validation of password
    ////function signature-----------------------------
    //fld: the property in angular scope that store your password input
    //valid: the valid property of the input you want to check. eg:[$scope.(Form Name).(Input Name).$valid]
    //$scope: angular $scope
    //messageName:the the property you want to store display message. eg:$scope[messageName]
    this.validatePassword = function (fld,valid,$scope, messageName) {
        if (!this.simpleValidate(valid,$scope,messageName, "password")) {
            return false;

        } else if (fld.length < 8) {
            $scope[messageName] = "The password must be at least 8 characters. \n";
            return false;

        } else if (fld.search(/[A-Z]+/)==-1){
            $scope[messageName] = "The password must contain at least one uppercase character.\n";
            return false;
        } else if(fld.search(/[a-z]+/)==-1){
            $scope[messageName] = "The password must contain at least one lowercase character.\n";
            return false;
        } else if (fld.search(/[0-9]+/)==-1 ) {
            $scope[messageName] = "The password must contain at least one numeral.\n";
            return false;
        } else if(fld.search(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)==-1){
            $scope[messageName] = "The password must contain at least one special character.\n";
            return false;
        }
        $scope[messageName] = "";
        return true;
    };
    //for validation of US phone
    ////function signature-----------------------------
    //fld: the property in angular scope that store your USphone input
    //valid: the valid property of the input you want to check. eg:[$scope.(Form Name).(Input Name).$valid]
    //$scope: angular $scope
    //messageName:the the property you want to store display message. eg:$scope[messageName]
    this.validateUSPhone = function (fld,valid,$scope, messageName) {
        var phoneno = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
        if (!this.simpleValidate(valid,$scope,messageName, "phone")) {
            return false;

        } else if (fld.replace(/-/g,"").length != 10) {
            $scope[messageName] = "The phone number must be 10 digits. \n";
            return false;

        } else if(!fld.match(phoneno)) {
            $scope[messageName] = "The phone number can only contain numeral. eg:8001243847/800-124-3847.\n";
            return false;
        }
        $scope[messageName] = "";
        return true;
    }
    //for validation of Email
    ////function signature-----------------------------
    //fld: the property in angular scope that store your email
    //valid: the valid property of the input you want to check. eg:[$scope.(Form Name).(Input Name).$valid]
    //$scope: angular $scope
    //messageName:the the property you want to store display message. eg:$scope[messageName]
    this.validateEmail = function(fld,error,valid,$scope, messageName){
        if(typeof error !='undefined' &&
            error ==true){
            $scope[messageName] = "";
            return false

        }else if (!this.simpleValidate(valid,$scope,messageName, "email")) {
            return false;

        }
        $scope[messageName] = "";
        return true;
    }
});

myApp.factory('DataFactory',function(){
    return{
        model: null,
        countries: [
            {id: '1', name: 'UnitedState'},
            {id: '2', name: 'Canada'},
            {id: '3', name: 'UnitedKingdom'},
            {id: '4', name: 'China'},
            {id: '5', name: 'India'},
            {id: '6', name: 'Japan'}
        ],
        states: [
            {id: '1', name: 'CA'},
            {id: '2', name: 'FL'},
            {id: '3', name: 'NY'},
            {id: '4', name: 'WL'}
        ],
        industries: [
            {id: '1', name: 'IT'},
            {id: '2', name: 'Manufactor'},
            {id: '3', name: 'Finance'}
        ]
    };
})
