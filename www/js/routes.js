app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('home', {
    url: '/page1',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('menu.blog', {
    url: '/blogs',
    views: {
      'side-menu': {
        templateUrl: 'templates/blog.html',
        controller: 'blogCtrl'
      }
    }
  })

  .state('menu.tips', {
    url: '/tips',
    views: {
      'side-menu': {
        templateUrl: 'templates/tips.html',
        controller: 'tipsCtrl'
      }
    }
  })

  .state('menu.fullTip', {
    url: '/fullTip/:tipId',
    views: {
      'side-menu': {
        templateUrl: 'templates/fullTip.html',
        controller: 'fullTipCtrl'  
      }
    } 
  })

  .state('menu.fullBlog', {
    url: '/fullblog/:blogId',
    views: {
      'side-menu': {
        templateUrl: 'templates/fullBlog.html',
        controller: 'fullBlogCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })


  // .state('signup', {
  //   url: '/signup',
  //   templateUrl: 'templates/signup.html',
  //   controller: 'signupCtrl'  
  // })

  .state('menu.profile', {
    url: '/profile',
    views: {
      'side-menu': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('menu.editSettings', {
    url: '/settings',
    views: {
      'side-menu': {
        templateUrl: 'templates/editSettings.html',
        controller: 'editSettingsCtrl'
      }
    }
  })

  .state('menu.subscription', {
    url: '/subscription',
    views: {
      'side-menu': {
        templateUrl: 'templates/subscription.html',
        controller: 'subscriptionCtrl'
      }
    }
  })

  var check = window.localStorage.getItem('issubscribed')

  check = (check == "true");

  if (typeof window.localStorage.getItem('userdata') === "undefined") {
    $urlRouterProvider.otherwise('/side-menu/blogs');
  }
  else if (check){
    $urlRouterProvider.otherwise('/side-menu/tips');
  }
  else {
    $urlRouterProvider.otherwise('/side-menu/blogs');
  }

});