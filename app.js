//app.js
var util = require('/utils/util.js');
var httprequest = require('/utils/httprequest.js');
App({
  version: 'v0.1.4',
  //监听小程序初始化，当小程序初始化完成时会触发发，且全局只触发一次
  onLaunch: function() {
     var that = this;
    //先从缓存中赋值当前页面用户信息
    var currentUser = util.getCurrentUser();
    that.globalData.userInfo = currentUser;
    
    //微信授权，获取openId和jwt-token
    wx.login({
      success: function (loginCode) {
        var url = that.globalData.API_URL+'/auth?code='+loginCode.code;
        httprequest.doGet(url,function(res){
          console.log("onLaunch"+JSON.stringify(res));
          wx.hideNavigationBarLoading()
          //获取信息成功后按照当全局>缓存的顺序更新用户信息
          console.log("authorize-user:" + JSON.stringify(res));
          console.log("that.userInfo-beforeauth" + JSON.stringify(that.globalData.userInfo));
          that.globalData.userInfo.openId = res.openId;
          that.globalData.userInfo.token = res.token;
          that.globalData.userInfo.randomKey = res.randomKey
          console.log("that.data.userInfo-afterauth" + JSON.stringify(that.globalData.userInfo));
          util.setCurrentUser(that.globalData.userInfo);
          console.log("getCurrentUser" + JSON.stringify(util.getCurrentUser()));
          console.log("app.globalData.userInfo" + JSON.stringify(that.globalData.userInfo));

        },
        function(res){
          wx.hideNavigationBarLoading()
          console.log("授权失败,系统异常");
        })
      }
    })    
  },
  onShow: function () {
    console.log('App onShow');
    var that = this;
    var currentUser = util.getCurrentUser();
    if(util.isNotNull(currentUser.openId)){
      var url = that.globalData.API_URL + '/auth?openId=' + currentUser.openId;
      httprequest.doGet(url,function(res){
        console.log("onShow" + JSON.stringify(res));
        if(res.code == undefined){
          console.log("onShow-authorize-user:" + JSON.stringify(res));
          console.log("onShow-that.userInfo-beforeauth" + JSON.stringify(that.globalData.userInfo));
          that.globalData.userInfo.token = res.token;
          that.globalData.userInfo.randomKey = res.randomKey
          console.log("onShow-this.data.userInfo-afterauth" + JSON.stringify(that.globalData.userInfo));
          util.setCurrentUser(that.globalData.userInfo);
          console.log("onShow-getCurrentUser" + JSON.stringify(util.getCurrentUser()));
          console.log("onShow-app.globalData.userInfo" + JSON.stringify(that.globalData.userInfo));
        }else{
          console.log(JSON.stringify(res));
        }
      },
      function(res){
        console.log("onShow授权失败,系统异常");
      });
    }

  },

  onHide: function () {
    console.log('App onHide');

  },
  onError: function () {
    console.log('App onError');

  },
  //用户自定义的全局数据，可以通过var app = getApp()获取app实例，再通过app.globalData.userInfo获取数据
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    API_URL:'http://localhost:8086'
  }
})
