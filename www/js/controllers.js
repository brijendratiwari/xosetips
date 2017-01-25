app.controller('blogCtrl', ['$scope', '$state','SyncCaller', 'APIMethods', 'Store', '$ionicScrollDelegate',
	function($scope, $state, SyncCaller, APIMethods, Store, $ionicScrollDelegate) {

		$scope.blogs = [];
		$scope.pagecount = 1;
		$scope.activePage = 0;
		$scope.checkCnt = 0; 
		$scope.blogSearch = "";
		$scope.showblog = false;

		$scope.searchBlog = function ($event) {
			var target = $event.target;
			var valueS = angular.element(target).val();
			$scope.checkCnt = 0;
			$scope.blogs = [];
			$scope.pagecount = 1;
			$scope.activePage = 0;

			$scope.blogSearch = valueS;
			if ($scope.blogSearch.length > 0) {
				$ionicScrollDelegate.scrollTop(false);
			}
			blogForPage(1,'scroll.infiniteScrollComplete');
		};

		$scope.doRefresh = function() {
			$scope.pagecount = 1;
			$scope.activePage = 0;
			$scope.blogs = [];
			blogForPage($scope.activePage + 1, 'scroll.refreshComplete');
		}

		$scope.shouldCheckNext = function() {
			var ret = true;
			if ($scope.checkCnt == 0 && $scope.blogs.length == 0) {
				$scope.checkCnt++;
				ret = false;
			}
			else if ($scope.blogs.length > 0) {
				ret = $scope.pagecount > $scope.activePage;
			}
			return ret;
		};

		$scope.$on('$ionicView.afterEnter', function(){
			if ($scope.blogs.length == 0) {
				$scope.blogs = Store.blogStore.getStorage();
			}
			if ($scope.blogs.length == 0) {
				$scope.checkCnt = 0;
				$scope.blogs = [];
				$scope.pagecount = 1;
				$scope.activePage = 0;
				blogForPage($scope.activePage + 1, 'scroll.infiniteScrollComplete');
				$ionicScrollDelegate.scrollTop(false);
			}
		});

		$scope.loadMore = function() {
			blogForPage($scope.activePage + 1, 'scroll.infiniteScrollComplete');
		};

		function blogForPage(pageno, type) {
			var data = {page: pageno};
			if ($scope.blogSearch.length > 0) {
				data['search_text'] = $scope.blogSearch;
			}
			$scope.showblog = false;
			SyncCaller.SynchronisedCall(APIMethods[4], data, function(response){
				$scope.activePage++;
				$scope.$broadcast(type);
				if (response.status === "success" && typeof response.data != "boolean") {
					$scope.showblog = false;
					$scope.search = false;

					var ids = [];
					for (var i = 0; i < $scope.blogs.length; i++) {
						ids.push($scope.blogs[i].id);
					}

					if ($scope.blogs.length > 0) {
						angular.forEach(response.data.blogs_info, function(val){
							if (ids.indexOf(val.id) == -1) {
								$scope.blogs.push(val);
							}
						})
					}
					else {
						$scope.blogs = response.data.blogs_info;
					}
					Store.blogStore.setStorage($scope.blogs);
					$scope.pagecount = parseInt(response.data.total_record/5) + parseInt((((response.data.total_record%5) > 0)?1:0));

					if(!$scope.$$phase) {
						$scope.$digest();
					}
				}
				else {
					$scope.showblog = true;
				}
			});
		}

		$scope.openfullblog = function(blognumber) {
			$state.go('menu.fullBlog', {blogId: blognumber});
		};

	}])

.controller('tipsCtrl', ['$scope', '$state', '$stateParams', 'Message', 'SyncCaller', 'APIMethods', 'Store', '$ionicScrollDelegate', '$ionicNavBarDelegate',
	function($scope, $state, $stateParams, Message, SyncCaller, APIMethods, Store, $ionicScrollDelegate, $ionicNavBarDelegate) {

		$scope.tips = [];
		$scope.pagecount = 1;
		$scope.activePage = 0;
		$scope.checkCnt = 0;

		$scope.shouldCheckNext = function() {
            if ($scope.nosubs) {
                return false;
            }
			var ret = true;
			if ($scope.checkCnt == 0 && $scope.tips.length == 0) {
				$scope.checkCnt++;
				ret = false;
			}
			else if ($scope.tips.length > 0) {
				ret = $scope.pagecount > $scope.activePage;
			}
			return ret;
		};
                         
        $scope.nosubs = false;
		$scope.showtip = false;

		$scope.searchtips = "";
		$scope.searchTip = function ($event) {
			var searchInpt = $event.target;

			var valueS = angular.element(searchInpt).val();

			$scope.checkCnt = 0;
			$scope.tips = [];
			$scope.pagecount = 1;
			$scope.activePage = 0;
			$scope.searchtips = valueS;
			if ($scope.searchtips.length > 0) {
				$ionicScrollDelegate.scrollTop(false);
			}
			else {
				$scope.tips = Store.tipStore.getStorage();
			}
			getTipAtPage(1, 'scroll.infiniteScrollComplete');
		};

		$scope.$on('$ionicView.afterEnter', function(){
			$ionicNavBarDelegate.showBackButton(false);
            var notif = window.localStorage.getItem('notif');
            $scope.nosubs = false;
            if (typeof notif != "undefined") {
				$ionicScrollDelegate.scrollTop(false);	
				$scope.checkCnt = 0;
				$scope.tips = [];
				$scope.pagecount = 1;
				$scope.activePage = 0;
				getTipAtPage($scope.activePage + 1, 'scroll.infiniteScrollComplete');
            }
			else {
				if ($scope.tips.length == 0) {
					$scope.tips = Store.tipStore.getStorage();
				}
				if ($scope.tips.length == 0) {
					$ionicScrollDelegate.scrollTop(false);	
					$scope.checkCnt = 0;
					$scope.tips = [];
					$scope.pagecount = 1;
					$scope.activePage = 0;
					getTipAtPage($scope.activePage + 1, 'scroll.infiniteScrollComplete');
				}
			}			
		});

		$scope.loadMore = function() {
			getTipAtPage($scope.activePage + 1, 'scroll.infiniteScrollComplete');
		};

		$scope.doRefresh = function() {
			$scope.pagecount = 1;
			$scope.activePage = 0;
			$scope.tips = [];
			getTipAtPage($scope.activePage + 1, 'scroll.refreshComplete');
		}

		function getTipAtPage(pageno, calltype) {
			var data = {page: pageno};
			if ($scope.searchtips.length > 0) {
				data['search_text'] = $scope.searchtips;
			}
			$scope.showtip = false;

			SyncCaller.SynchronisedCall(APIMethods[3], data, function(response){
				
				$scope.activePage++;
				$scope.$broadcast(calltype);
				if (response.status === "success" && typeof response.data != "boolean") {
					$scope.showtip = false;
					$scope.search = false;
					var ids = [];
					for (var i = 0; i < $scope.tips.length; i++) {
						ids.push($scope.tips[i].id);
					}

					if ($scope.tips.length > 0) {
						angular.forEach(response.data.user_tip, function(val){
							if (ids.indexOf(val.id) == -1) {
								$scope.tips.push(val);
							}
						})
					}
					else {
						$scope.tips = response.data.user_tip;
					}

					Store.tipStore.setStorage($scope.tips);

					$scope.pagecount = parseInt(response.data.user_total/8) + parseInt((((response.data.user_total%8) > 0)?1:0));

					if(!$scope.$$phase) {
						$scope.$digest();
					}
				}
				else if (response.status != "success") {
                    if (!$scope.nosubs) {
                        Message.alert(response.message).then(function(){
                            $state.go('menu.subscription');
                        });
                        $scope.nosubs = true;
                    }
				}
				else {
					$scope.showtip = true;
				}
			});
		}

		$scope.menufullTip = function(tid) {
			$state.go('menu.fullTip', {tipId: tid});
		};

	}])

.controller('menuCtrl', function($scope, $state, $rootScope, Message, $ionicSideMenuDelegate, TokenService, $translate, Store, $ionicPopover, ApiCaller, APIMethods) {

	function changeLan(){
		$translate(['SIGNIN', 'SIGN_OUT']).then(function (translation) {
			$scope.sign_in_text = translation.SIGNIN;
			$scope.sign_out_text = translation.SIGN_OUT;
			check();
		}, function (translationId) {
			$scope.sign_in_text = translationId.SIGNIN;
			$scope.sign_out_text = translationId.SIGN_OUT;
			check();
		});
	}

	//Broadcast Receiver

	$scope.$on('tiprec', function(){
		var tip_id = window.localStorage.getItem('newtip');
		ApiCaller.callAPI('GetTip', {"tip_id": tip_id}, function(response){
			if (response.status === "success") {
				var allTips = Store.tipStore.getStorage();
				allTips.splice(0, 0, response.data.tip);
				Store.tipStore.setStorage(allTips);
				Message.confirmWithTitle('NEW_TIP', 'TIP_NOTIF')
				.then(function(res) {
					window.localStorage.removeItem('newtip');
					if(res) {
						$state.go('menu.fullTip', {tipId: tip_id});
					}
				});
				window.localStorage.setItem('notif', 'true');

			}
		},function(error) {
			console.log(error);
		});
	});

	$scope.profile = {};

	ApiCaller.callAPI(APIMethods[5], null, function(response){
		if (response.status === "success") {
			$scope.profile = response.data;
		}
	},function(error) {
		console.log(error);
	});

	$scope.openChat = function(){
		if( window.plugins && window.plugins.Hipmob && typeof $scope.profile.userinfo != "undefined") {
			var hipmob_app_id = '32d3576104a1488f95689fbbc3e119a4';
			var Hipmob = window.plugins.Hipmob;

			var userinfo = $scope.profile.userinfo;
			$ionicSideMenuDelegate.toggleLeft();
			Hipmob.openChat(hipmob_app_id, {
				'title': 'Help',
				'user': userinfo.id,
				'name': userinfo.first_name + " " + userinfo.last_name,
				'email': userinfo.email,
				'context': 'Xosetip Help',
				'location': 'On Mobile'
			});
		} else {
			Message.alert('HIP_ERROR');
		}
	};

	$scope.langflagclass = "el";

	$rootScope.$on('$translateChangeSuccess', function () {
		changeLan();
	});

	$scope.showprofile = false;

	function check() {
		$scope.message = $scope.sign_in_text;
		$scope.showprofile = false;
		if (TokenService.getToken().length > 0) {
			$scope.message = $scope.sign_out_text;
			$scope.showprofile = true;
			if(!$scope.$$phase) {
				$scope.$digest();
			}
		}
	}

	$scope.toggleLang = function(engorgr) {
		$scope.iseng = (engorgr == "en")?'button-positive':'button-stable';
		$scope.isgreek = (engorgr == "el")?'button-positive':'button-stable';
		$scope.langflagclass = engorgr;
		Store.langStore.setStorage(engorgr);
		$translate.use(engorgr);
		if ($scope.popover) {
			$scope.popover.hide();
		}
	};

	$scope.toggleLang(Store.langStore.getStorage());

	$ionicPopover.fromTemplateUrl('my-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});

	$scope.toggleLangPopup = function($event) {
		$scope.popover.show($event);
	};


	$scope.toggleSideMenu = function() {
		$ionicSideMenuDelegate.toggleLeft();
		check();
	};

	check();

	$scope.loggerClick = function() {
		if (TokenService.getToken().length == 0) {
			$ionicSideMenuDelegate.toggleLeft();
			$state.go('login');
		}
		else {
			Message.confirm("LOGOUT_MSG")
			.then(function(res) {
				if(res) {
					ApiCaller.callAPI('Logout', null, function(response){
						if (response.status === "success") {
							window.localStorage.clear();
							window.location.href = "";
						}
						else {
							Message.alert('SIGNOUT_FAIL_MSG');
							$ionicSideMenuDelegate.toggleLeft();
						}
						
					},function(error) {
						console.log(error);
					});
				}
				else {
					$ionicSideMenuDelegate.toggleLeft();
				}
			});

		}
	};
})


.controller('loginCtrl', ['$scope', '$state', 'Message', 'ApiCaller', 'APIMethods', 'TokenService', '$rootScope', '$ionicNavBarDelegate', 'Store', 'URL', 
	function($scope, $state, Message, ApiCaller, APIMethods, TokenService, $rootScope, $ionicNavBarDelegate, Store, URL) {

		$scope.signin = {
			useremail:'',
			password:''
		};

		$scope.backFromLogin = function(){
			window.history.go(-1);
		};

		$scope.facebookLogin = function(){
			facebookConnectPlugin.login(["public_profile","email"],function(sucessdata){

				var req = {"access_token" : sucessdata.authResponse.accessToken};

				if (window.device) {
					req['deviceversion'] = window.device.version;
				}

				ApiCaller.callAPI(APIMethods[2], req, function(response){
					if (response.status === "success") {
						TokenService.saveToken(response.token);
						window.localStorage.setItem('issubscribed', response.subscription_status);
						window.location.href = "";
					}
					else {
						Message.alert(response.message);
					}
				},function(error) {
					console.log(error);
				});

			},function(error) {
				console.log(JSON.stringify(error));
				Message.alert('FAC_LOG_FLD');
			});
		};

		$scope.signup = function() {

			var getStr = (Store.langStore.getStorage() == 'el')?'lang=greek':'lang=english';

			var inapp = cordova.InAppBrowser.open(URL.REGISTERED + '?' + getStr, '_blank', 'location=no,toolbar=yes,clearcache=yes');

			inapp.addEventListener('loadstop', function(e){
				console.log("Load Start" + JSON.stringify(e));
			});

			inapp.addEventListener('loadstart', function(e){
				console.log(JSON.stringify(e));
				if (e.url === URL.SIGNUPOK) {
					inapp.close();
					Message.alert('ACTIVATE_ACCOUNT_CHECK_EMAIL');
				}
			});
		}

		$ionicNavBarDelegate.showBackButton(true);
		$scope.loginClick = function () {
			console.log(JSON.stringify($scope.signin));
			var postReq = {
				email: $scope.signin.useremail,
				password: $scope.signin.password,
				app_login: 1
			};

			if (window.device) {
				postReq['deviceversion'] = window.device.version;

			}

			ApiCaller.callAPI(APIMethods[0], postReq, function(response){
				if (response.status === "success") {
					TokenService.saveToken(response.token);
					window.localStorage.setItem('issubscribed', response.subscription_status);
					window.location.href = "";
				}
				else {
					Message.alert(response.message);
				}
			},function(error) {
				console.log(error);
			});
		};

	}])

.controller('signupCtrl', ['$scope', '$stateParams', 'Message', 'ApiCaller', 'APIMethods', 'vcRecaptchaService',
	function($scope, $stateParams, Message, ApiCaller, APIMethods, vcRecaptchaService) {
		$scope.signupform = {
			'firstname':'',
			'lastname':'',
			'email':'',
			'phone':'',
			'password':'',
			'repeatpass':''
		};

		$scope.signup_button = function (){
			if ($scope.signupform.password != $scope.signupform.repeatpass) {
				Message.alert("PASS_MATCH_ERROR");
				return;
			}

			var postReq = {
				fname: $scope.signupform.firstname,
				lname: $scope.signupform.lastname,
				user_email: $scope.signupform.email,
				user_password: $scope.signupform.password,
				'g-recaptcha-response':vcRecaptchaService.getResponse() 
			};

			if (typeof $scope.signupform.phone === "undefined") {
				postReq['phone'] = $scope.signupform.phone;
			}

			ApiCaller.callAPI(APIMethods[1], postReq, function(response){
				if (response.status === "success") {
					Message.alert('Success');
				}
				else {
					Message.alert(response.message);
				}
			},function(error) {

			});
		};

	}])

.controller('fullTipCtrl', ['$scope', '$stateParams', 'Store', '$ionicNavBarDelegate', 'ApiCaller',
	function($scope, $stateParams, Store, $ionicNavBarDelegate, ApiCaller) {
		
		if ($stateParams.tipId != null) {
			var tips = Store.tipStore.getStorage();
			$scope.tip = {};
			
			for (var i = 0; i < tips.length; i++) {
				if ( $stateParams.tipId == tips[i].id) {
					var tp = tips[i];
					var tmp = (new Date(tp.match_date) + "").split(" ");
					tp.match_date = tmp[1] + " " + tmp[2] + " " + tmp[3];
					$scope.tip = tp; 
				}
			}
		}

		$scope.backclk = function(){
			window.history.go(-1);
		};

		$scope.$on('$ionicView.afterEnter', function(){	
			$ionicNavBarDelegate.showBackButton(false);

			ApiCaller.callAPI('IncTip', {"tip_id": $scope.tip.id}, function(response){
				if (response.status === "success") {
					$scope.tip.views = response.data.count;
				}
			}, function(error) {

			})
		});
	}])

.controller('fullBlogCtrl', ['$scope', '$state', '$stateParams', 'Store', '$ionicNavBarDelegate', 'ApiCaller',
	function($scope, $state, $stateParams, Store, $ionicNavBarDelegate, ApiCaller) {

		$scope.backToMenu = function() {
			window.history.go(-1);
		}

		console.log("Blog : " + $stateParams.blogId);
		var blogs = Store.blogStore.getStorage();
		$scope.blog = blogs[$stateParams.blogId - 1];

		$scope.$on('$ionicView.afterEnter', function(){	
			$ionicNavBarDelegate.showBackButton(false);

			ApiCaller.callAPI('IncBlog', {"blog_id": $stateParams.blogId}, function(response){
				if (response.status === "success") {
					$scope.blog.views = response.data.count;
				}
			}, function(error) {

			})
		});
	}])

.controller('profileCtrl', ['$scope', '$state', 'Message', 'ApiCaller', 'APIMethods', '$ionicModal',
	function($scope, $state, Message, ApiCaller, APIMethods, $ionicModal) {

		$scope.openProfile = function(){
			$state.go('menu.editSettings');
		};

		$scope.selectedSubs = {};

		$ionicModal.fromTemplateUrl('plan-detail.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});

		$scope.closeDetail = function(){
			$scope.modal.hide();
		};
		
		$scope.showDetail = function(or_id) {
			console.log(or_id);
			angular.forEach($scope.subscriptions, function(subs) {
				if (subs.order_id == or_id) {
					$scope.selectedSubs = subs;
				}
			});
			$scope.modal.show();
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

		$scope.profile = {};
		$scope.subscriptions = [];
		$scope.$on('$ionicView.afterEnter', function(){	
			ApiCaller.callAPI(APIMethods[5], null, function(response){
				if (response.status === "success") {
					var dt = new Date(response.data.userinfo.subexpiry);
					var today = new Date();
					response.data.userinfo.isActive = (today <= dt);
					$scope.profile = response.data;

					if ($scope.profile.userinfo.profile_image.length == 0) {
						var isIPad = ionic.Platform.isIPad();
						var isIOS = ionic.Platform.isIOS();
						var isAndroid = ionic.Platform.isAndroid();
						$scope.profile.userinfo.profile_image = "../img/usermale.jpg";
						if (isIPad || isIOS || isAndroid) {
							$scope.profile.userinfo.profile_image = "img/usermale.jpg";
						}	
					}
					ApiCaller.callAPI(APIMethods[6], null, function(response){
						if (response.status === "success" && response.data.user_order != false) {

							var orders = response.data.user_order;

							angular.forEach(orders, function(order){
								var paydt = ("" + new Date(order.created_at)).split(" ");
								order.payment_date = paydt[1] + " " + paydt[2] + " " + paydt[3];
							});

							$scope.subscriptions = response.data.user_order;
						}
						else {
							Message.alert('SUBS_UNAVIAL');
						}
					},function(error) {
						console.log(error);
					});
				}
				else {
					Message.alert('PROFILE_UNAV');
				}
			},function(error) {
				console.log(error);
			});
		});
	}])

.controller('editSettingsCtrl', ['$scope', '$stateParams', 'Message', 'ApiCaller', 'APIMethods', '$ionicNavBarDelegate',
	function($scope, $stateParams, Message, ApiCaller, APIMethods, $ionicNavBarDelegate) {
		$scope.userdata = {};
		$scope.prefs = [];
		$scope.subscriptions = [];
		$scope.showLoading = true;

		$scope.userForm = {
			first_name: "",
			last_name: "",
			email: "",
			phone: "",
			gender: "",
			favourite_category:""
		};
		
		$scope.$on('$ionicView.afterEnter', function(){	
			$ionicNavBarDelegate.showBackButton(false);
			ApiCaller.callAPI(APIMethods[5], null, function(response){
				$scope.showLoading = false;
				if (response.status === "success") {
					$scope.prefs = [];
					setupViews(response.data);
					$scope.userdata = response.data.userinfo;
				}
				else {
					Message.alert('PROFILE_UNAV');
				}
			},function(error) {
				console.log(error);
			});
		});

		function setupViews(userdetails) {
			var categories = userdetails.categories;
			var favourites = userdetails.userinfo.favourite_category.split(",");
			angular.forEach(categories, function(category){
				$scope.prefs.push({"cat_id": category.category_id, "cat_name": category.category_name,  "selected": ((favourites.length==0)?true:(favourites.indexOf(category.category_id) != -1))});
			});
			$scope.userForm.first_name = userdetails.userinfo.first_name;
			$scope.userForm.last_name = userdetails.userinfo.last_name;
			$scope.userForm.email = userdetails.userinfo.email;
			$scope.userForm.phone = userdetails.userinfo.phone;
			$scope.userForm.gender = userdetails.userinfo.gender;
			$scope.userForm.favourite_category = userdetails.userinfo.favourite_category;
			if(!$scope.$$phase) {
				$scope.$digest();
			}
			$scope.isFemale = ($scope.userForm.gender == 'female')?'button-positive':'button-stable';
			$scope.isMale = ($scope.userForm.gender == 'male')?'button-positive':'button-stable';
		}

		$scope.toggleGender = function(ismale) {
			$scope.isFemale = (!ismale)?'button-positive':'button-stable';
			$scope.isMale = (ismale)?'button-positive':'button-stable';
			$scope.userForm.gender = ismale?"male":"female";
		};

		$scope.submitForm = function() {
			var prefStr = ""; 
			angular.forEach($scope.prefs, function(pref){
				if (pref.selected) {
					if (prefStr.length > 0) {
						prefStr += ",";	
					}
					prefStr += pref.cat_id;
				}
			})
			$scope.userForm.favourite_category = prefStr;
			console.log(JSON.stringify($scope.userForm));
			ApiCaller.callAPI(APIMethods[7], $scope.userForm, function(response){
				if (response.status === "success") {
					Message.alert('PROFILE_SAVD');
				}
				else {
					Message.alert(response.message);
				}
			},function(error) {
				console.log(error);
			});

		};

	}])

.controller('subscriptionCtrl', function($rootScope, $scope, ApiCaller, APIMethods, Message, $ionicNavBarDelegate, Store, $translate, URL) {

	$scope.formpay = {
		plan_id: "2",
		payment_method: 'paypal'
	};
	$scope.$on('$ionicView.afterEnter', function(){	
		getPaymentOptions();
		$ionicNavBarDelegate.showBackButton(false);
	});

	$scope.paymentopts = [];

	$rootScope.$on('$translateChangeSuccess', function () {
		getPaymentOptions();
	});

	function getPaymentOptions() {
		ApiCaller.callAPI("GetPlan", {"lang": ((Store.langStore.getStorage() === "en")?"english":"greek")}, function(response){
			if (response.status === "success") {
				$scope.paymentopts = response.data.subscription;
				$scope.formpay.plan_id = response.data.subscription[0].id;
			}
		},function(error) {
			console.log(error);
		});
	}
	$scope.pay = function() {
			ApiCaller.callAPI(APIMethods[8], $scope.formpay, function(response){
				if (response.status === "success") {

					var inapp = cordova.InAppBrowser.open(response.data.redirectURL, '_blank', 'location=no,toolbar=yes,clearcache=yes');

					inapp.addEventListener('loadstop', function(e){
						console.log("Load Start" + JSON.stringify(e));
						if (e.url === URL.SUCCESS || e.url === URL.FAILURE) {
							var msg = 'PAY_FAIL';
							if (e.url === URL.SUCCESS) {
								msg = 'PAY_SUCC';
							}
							Message.alert(msg)
							setTimeout(function(){
								inapp.close();
							},200);
						}
					});

					inapp.addEventListener('loadstart', function(e){
						console.log(JSON.stringify(e));
					});
				}
				else {
					Message.alert('Error in request');
				}
			},function(error) {
				console.log(error);
			});
		};
	})
