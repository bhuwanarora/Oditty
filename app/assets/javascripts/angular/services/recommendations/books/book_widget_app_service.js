//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
bookWidgetApp.service('bookWidgetAppService', function ($rootScope) {
    this.triggerExpand = function(){
        $rootScope.$broadcast('triggerExpand')
    }

    this.triggerHover = function(){
        $rootScope.$broadcast('triggerHover')   
    }

    this.triggerMouseOut = function(){
        $rootScope.$broadcast('triggerMouseOut')   
    }    

});