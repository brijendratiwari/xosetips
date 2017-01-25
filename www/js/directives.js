app.factory('StateChecker', function($rootScope, $state){
    return {
        runStateChecker: function(){
            $rootScope.$on('$ionicView.afterEnter', function(){
                if (window.ga) {
            	    window.ga.trackView($state.current.name);
                }
                if (ionic.Platform.isAndroid()) {
                    var ref = $state.href($state.current.name, {}, {absolute: false});
                    var stateObj = { state: $state.current.name };
                    history.pushState(stateObj, $state.current.name, ref);
                }
            });
    }
};
});

app.factory('Message', function($ionicPopup, $translate, $rootScope){
    var texts = {};

    function changeLan() {
        $translate(["ACTIVATE_ACCOUNT_CHECK_EMAIL", "LOGOUT_MSG","EXIT_APP","SIGNOUT_FAIL_MSG","CANCEL_TEXT","CONFIRM_TEXT","SUCCESS_TEXT","ALERT","NEW_TIP","TIP_NOTIF","TIP_NOT_SUB","HIP_ERROR","SUBS_UNAVIAL","PROFILE_SAVD","PROFILE_UNAV","UNSUBS_MSG","FAC_LOG_FLD","REQ_ERROR","PASS_MATCH_ERROR"]).then(function (translation) {
            texts = translation;
        }, function (translationId) {
            texts = translationId;
        });
    }

    changeLan();
    
    $rootScope.$on('$translateChangeSuccess', function () {
		changeLan();
	});
       
    return {
        alert: function(message) {
            var msg = texts[message];
            if (typeof msg === "undefined") {
                msg = message;
            }

            return $ionicPopup.alert({
                title: texts.ALERT,
				template: '<p style="text-align: center;">' + msg + '</p>'
            });
        },
        confirm: function(message) {
            var msg = texts[message];
            if (typeof msg === "undefined") {
                msg = message;
            }

            return $ionicPopup.confirm({
                title: texts.ALERT,
				template: '<p style="text-align: center;">' + msg + '</p>',
                cancelText: texts.CANCEL_TEXT,
				okText: texts.CONFIRM_TEXT
            });
        },
        confirmWithTitle : function(title, message) {
            var msg = texts[message];
            if (typeof msg === "undefined") {
                msg = message;
            }

            var ttl = texts[title];
            if (typeof msg === "undefined") {
                ttl = title;
            }
            return $ionicPopup.confirm({
                title: ttl,
				template: '<p style="text-align: center;">' + msg + '</p>',
                cancelText: texts.CANCEL_TEXT,
				okText: texts.CONFIRM_TEXT
            });
        }
    };
});