app.constant('APIMethods', ["APILogin", "SignUp", "SocialLogin", "GetTips", "GetBlogs", "GetProfile", "GetSubscription", "UpdateProfile", "MakePay"]);

app.constant('URL', {
	'API': 'https://www.xosetips.com/api/',
	'SUCCESS': 'https://www.xosetips.com/api/success',
	'FAILURE': 'https://www.xosetips.com/api/failure',
	'REGISTERED': 'https://www.xosetips.com/api/registered',
	'SIGNUPOK': 'https://www.xosetips.com/home/signupok'
});


app.constant('T_URL', {
	'API': 'https://ben.engd.com/api/',
	'SUCCESS': 'https://ben.engd.com/api/success',
	'FAILURE': 'https://ben.engd.com/api/failure',
	'REGISTERED': 'https://ben.engd.com/api/registered',
	'SIGNUPOK': 'https://ben.engd.com/home/signupok'
});

app.factory('apiCalls', function(){
	return {
		'APILogin': {'type':'POST','path': 'login'},
		'SignUp': {'type':'POST','path': 'registered'},
		'SocialLogin': {'type':'POST','path': 'facebook_login'},
		'GetTips': {'type':'TOKENPOST','path': 'usertip'},
		'GetBlogs': {'type':'POST','path': 'bloglist'},
		'GetProfile': {'type':'TOKENPOST','path': 'profile'},
		'GetSubscription': {'type':'TOKENPOST','path': 'get_subscription'},
		'UpdateProfile': {'type':'TOKENPOST','path': 'update_user'},
		'MakePay': {'type':'TOKENPOST','path': 'payment'},
		'Greek':{'type':'GET', 'path': 'language/greek'},
		'English':{'type':'GET', 'path': 'language/english'},
		'GetPlan':{'type':'TOKENPOST', 'path': 'getPlan'},
		'Logout':{'type':'TOKENGET', 'path': 'logout'},
		'GetTip':{'type':'TOKENPOST', 'path': 'getTip'},
		'IncTip':{'type':'TOKENPOST', 'path': 'views_tip'},
		'IncBlog':{'type':'TOKENPOST', 'path': 'views_blog'},
		'TokenUpdate':{'type':'TOKENPOST', 'path': 'update_firebasetoken'},
		'VerifyFCM':{'type':'TOKENPOST', 'path': 'verify_fcm'}
	};
	
});


app.factory('Store', function(){
	var blogStore = {};
	blogStore.getStorage = function() {
		var localstorage = window.localStorage.getItem('blogSelected');
		if (localstorage === null) {
			localstorage = [];
		}
		else {
			localstorage = JSON.parse(localstorage);
		}
		return localstorage;
	};

	blogStore.setStorage = function(localstorage) {
		window.localStorage.setItem("blogSelected", JSON.stringify(localstorage));
	};


	var tipStore = {};
	tipStore.getStorage = function() {
		var localstorage = window.localStorage.getItem('tipsRec');
		if (localstorage === null) {
			localstorage = [];
		}
		else {
			localstorage = JSON.parse(localstorage);
		}
		return localstorage;
	};

	tipStore.setStorage = function(localstorage) {
		window.localStorage.setItem("tipsRec", JSON.stringify(localstorage));
	};

	var langStore = {};
	langStore.getStorage = function() {
		var lang = window.localStorage.getItem('langStore');
		if (lang === null) {
			lang = 'el';
		}
		return lang;
	};

	langStore.engStorage = function(lang) {
		window.sessionStorage.setItem("engStore", JSON.stringify(lang));
	};

	langStore.getEngStorage = function() {
		var lang = JSON.parse(window.sessionStorage.getItem('engStore'));
		if (lang === null) {
			lang = {};
		}
		return lang;
	};

	langStore.grkStorage = function(lang) {
		window.sessionStorage.setItem("grkStore", JSON.stringify(lang));
	};

	langStore.getGrkStorage = function() {
		var lang = JSON.parse(window.sessionStorage.getItem('grkStore'));
		if (lang === null) {
			lang = {};
		}
		return lang;
	};

	langStore.setStorage = function(lang) {
		window.localStorage.setItem("langStore", lang);
	};

	return {blogStore: blogStore, tipStore: tipStore, langStore: langStore};
});


app.factory('TokenService', function(){

	var tokenService = {};
	tokenService.getToken = function() {
		var localstorage = window.localStorage.getItem('userdata');

		if (localstorage === null) {
			localstorage = {};
		}
		else {
			localstorage = JSON.parse(localstorage);
		}

		var token = localstorage["token"];

		return (typeof token === "undefined")?"":token;
	};

	tokenService.saveToken = function(token) {
		var localstorage = window.localStorage.getItem('userdata');
		if (localstorage === null) {
			localstorage = {};
		}
		else {
			localstorage = JSON.parse(localstorage);
		}

		localstorage["token"] = token;

		window.localStorage.setItem("userdata", JSON.stringify(localstorage));
	};
	return tokenService;
});

app.factory('ApiCaller', ['$http', 'apiCalls', '$ionicLoading', 'Message', 'TokenService', 'URL', function($http, apiCalls, $ionicLoading, Message, TokenService, URL) {
	var apiCaller = {};

	function getCall(path, success, failure) {
		$http.get(path).//Link
		success(function(data, status) {
			$ionicLoading.hide();
			success(data);
		}).
		error(function(data, status) {
			$ionicLoading.hide();
			if (failure) {
				failure(data);
			}
		});
	}

	function postCall(path, api_request, success, failure) {
		$http.post(path, api_request).
		success(function(data, status) {
			$ionicLoading.hide();
			success(data);
		}).
		error(function(data, status) {
			$ionicLoading.hide();
			if (failure) {
				failure(data);
			}
		});
	}

	function tokenCall(path, api_request, success, failure) {
		if (TokenService.getToken().length == 0) {
			$ionicLoading.hide();
            failure(null);
            return;
		}

		$http({
			method: 'POST',
    		url: path,
			data: api_request,
			headers: {
		        "Content-Type": "application/x-www-form-urlencoded",
		        "Token": TokenService.getToken()
		    }
		}).
		success(function(data, status) {
			$ionicLoading.hide();
			if (data.status === "error" && (data.error === "Token not found" || data.error === "Invalid token")) {
				Message.alert('Your login has expired').then(function(){
					window.localStorage.removeItem('userdata');
					setTimeout(function(){
		             	window.location.href = "";
		            }, 100);
				})
			}
			else {
				success(data);
			}
		}).
		error(function(data, status) {
			$ionicLoading.hide();
			if (failure) {
				failure(data);
			}
		});
	}

	function tokenGetCall(path, success, failure) {
		if (TokenService.getToken().length == 0) {
			$ionicLoading.hide();
            failure(null);
            return;
		}

		$http({
			method: 'GET',
    		url: path,
			headers: {
		        "Content-Type": "application/x-www-form-urlencoded",
		        "Token": TokenService.getToken()
		    }
		}).
		success(function(data, status) {
			$ionicLoading.hide();
			if (data.status === "error" && (data.error === "Token not found" || data.error === "Invalid token")) {
				Message.alert('Your login has expired').then(function(){
					window.localStorage.removeItem('userdata');
					setTimeout(function(){
		             	window.location.href = "";
		            }, 100);
				})	
			}
			else {
				success(data);
			}
		}).
		error(function(data, status) {
			$ionicLoading.hide();
			if (failure) {
				failure(data);
			}
		});
	}

	apiCaller.callAPI = function (methodName, data, successBlock, failureBlock) {
		var methods = apiCalls[methodName];

		var isIPad = ionic.Platform.isIPad();
		var isIOS = ionic.Platform.isIOS();
		var isAndroid = ionic.Platform.isAndroid();

		var url = 'http://localhost:8100/apicall/api/';
		if (isIPad || isIOS || isAndroid) {
			url = URL.API;
		}	
		var path = url + methods.path;

		var request = "";
		angular.forEach(data,function(val, key){
			if (request.length > 0) {
				request += "&";
			}
		  request += key + "=" + val;
		})
		if (methodName != "GetTips" && methodName != "GetBlogs") {
			$ionicLoading.show({template:'<strong style="text-align: center;">Loading...</strong>'});
		}
		if (methods.type === 'TOKENPOST') {
			tokenCall(path, request, successBlock, failureBlock);
		}
		else if (methods.type === 'TOKENGET') {
			tokenGetCall(path, successBlock, failureBlock);
		}
		else if (methods.type === 'POST') {
			if (methodName == "APILogin" || methodName == "SignUp" || methodName == "SocialLogin") {
				var token = window.sessionStorage.getItem('fcm_token');
				if (token != null || token != undefined) {
					request += '&firebasetoken=' + token;
				}
				if (isIPad || isIOS || isAndroid) {
					request += '&device=' + (isAndroid?'android':'ios');
				}
			}
			postCall(path, request, successBlock, failureBlock);
		}
		else {
			getCall(path, successBlock, failureBlock);
		}
	};


	return apiCaller;
}])

app.factory('SyncCaller', ['ApiCaller', function(ApiCaller) {
	var isBusy = false;
	var reqStore = {};

	var respBlockArr = [];

	var syncall = function (request, parameters, onResponse) {
		respBlockArr.push(onResponse);
		if (isBusy) {
			reqStore.methodName = request;
			reqStore.params = parameters;			
		}
		else {
			isBusy = true;
			apiCall(request, parameters);
		}

	}

	function apiCall (request, parameters){
		ApiCaller.callAPI(request, parameters, function(response){
			var rblock = getNextSuccess();
			if (rblock != null) {
				rblock(response);
			} 
			checkIfNext();
		},function(error) {
			checkIfNext();
			console.log("Error: " + JSON.stringify(error));
		});
	}

	function getNextSuccess() {
		var respBl = respBlockArr[0];
		respBlockArr = respBlockArr.splice(1, respBlockArr.length);
		return respBl;
	}

	function checkIfNext() {
		setTimeout(function(){
			isBusy = false;
		}, 100);
		if (typeof reqStore.methodName != "undefined") {
			apiCall(reqStore.methodName, reqStore.params);
			if (respBlockArr.length > 1) {
				respBlockArr.splice(1, respBlockArr.length - 1);
			}
			reqStore = {};
		}
	}

	return {SynchronisedCall: syncall};

}])


