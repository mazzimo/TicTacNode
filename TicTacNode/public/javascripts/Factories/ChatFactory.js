var ChatFactory = function ($http, $q) {
    var funcSendMessage = function (msg) {

        var deferredObject = $q.defer();
        
        $http.post(
            '/chat',
            { message : msg }
        ).
        success(function (data) {
            deferredObject.resolve({ success: true, resultData: data });
        }).
        error(function () {
            deferredObject.resolve({ success: false });
        });
        
        return deferredObject.promise;
    };
    
    return {
        SendMessage: funcSendMessage
    }
}

ChatFactory.$inject = ['$http', '$q'];