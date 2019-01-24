var app = getApp();
var util = require('../../utils/util.js');
var httprequest = require('../../utils/httprequest.js');
Page({
  data:{
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false
  },
  // index.js  登录业务：
  onLoad: function (options) {
    console.log("home onLoad");
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
           that.setUserInfoAndNext();
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    })
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      //console.log("用户的信息如下：");
      //console.log(e.detail.userInfo);
      //console.log("此时app用户信息：");
       //console.log(JSON.stringify(app.globalData.userInfo));
       app.globalData.userInfo.avatarUrl = e.detail.userInfo.avatarUrl;
       app.globalData.userInfo.city = e.detail.userInfo.city;
       app.globalData.userInfo.country = e.detail.userInfo.country;
       app.globalData.userInfo.gender = e.detail.userInfo.gender;
       app.globalData.userInfo.language = e.detail.userInfo.language;
       app.globalData.userInfo.nickName = e.detail.userInfo.nickName;
       app.globalData.userInfo.province = e.detail.userInfo.province;
       //console.log("赋值后app用户信息：");
       //console.log(JSON.stringify(app.globalData.userInfo));
       util.setCurrentUser(app.globalData.userInfo);
       app.saveOrUpdateUser(app.globalData.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      this.setUserInfoAndNext();
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  // 获取个人信息成功，然后处理剩下的业务或跳转首页
  setUserInfoAndNext() {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback()
    }
    wx.hideLoading()
    // 跳转首页
    setTimeout(() => {
      wx.reLaunch({
        url: '../index/index'
      })
    }, 30)
  }
})
