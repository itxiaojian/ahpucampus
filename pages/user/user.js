var app = getApp();
var util = require('../../utils/util.js');
var httprequest = require('../../utils/httprequest.js');

Page({
  data: {
    userInfo: {}
  },

  onLoad: function () { 
    var that = this;
    //先从缓存中赋值当前页面用户信息
    var currentUser = util.getCurrentUser();
    that.setData({
      userInfo: currentUser
    })
    //感觉有点多此一举
    if (!util.isNull(currentUser.openId)){
      console.log("当前用户已授权"+JSON.stringify(currentUser));
      return;
    }
    //微信授权，获取jwt-token
    wx.login({
      success: function (loginCode) {
        wx.request({
          url: app.globalData.API_URL + '/auth',
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          data: {
            code: loginCode.code
          },
          success: function (res) {
            //获取信息成功后按照当前页>全局>缓存的顺序更新用户信息
            console.log("authorize-user:" + JSON.stringify(res.data));
            console.log("that.userInfo-beforeauth" + JSON.stringify(that.data.userInfo));
            that.data.userInfo.openId = res.data.openId;
            that.data.userInfo.token = res.data.token;
            that.data.userInfo.randomKey = res.data.randomKey;
            //这里必须要重新setData一次，that.data.userInfo <> userInfo
            that.setData({
              userInfo: that.data.userInfo
            })
            console.log("that.data.userInfo-afterauth" + JSON.stringify(that.data.userInfo));
            app.globalData.userInfo = that.data.userInfo,
            util.setCurrentUser(that.data.userInfo);
            console.log("getCurrentUser" + JSON.stringify(util.getCurrentUser()));
            console.log("app.globalData.userInfo" + JSON.stringify(app.globalData.userInfo));

            //完善的用户信息提交到后台入表
            saveOrUpdateUser(app.globalData.userInfo);
          },
            fail: function () {
              console.log("授权失败,系统异常");
            }
          })
        }
      })
  }
})

function saveOrUpdateUser(user) {
  httprequest.doPost("/hello", "", user,
    function (res) {
      wx.hideNavigationBarLoading()
      console.log("用户信息保存成功" + JSON.stringify(user));
    },
    function (res) {
      wx.hideNavigationBarLoading()
      console.log("用户信息保存失败" + JSON.stringify(user));
    });
}