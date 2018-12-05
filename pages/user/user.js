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
    if (util.isNotNull(currentUser.openId) && util.isNotNull(currentUser.token)){
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
            app.saveOrUpdateUser(app.globalData.userInfo);
          },
            fail: function () {
              console.log("授权失败,系统异常");
            }
          })
        }
      })
  },

/**
 * 更新头像信息
 */
  refreash : function(){
    var m = util.formatTime(new Date);
    var count = wx.getStorageSync('refreashcount');
    console.log("m", m); 
    console.log("count", count);
    if (m != wx.getStorageSync('m') || count == undefined) {
      if (count = 5 || count == undefined) { 
        count = 0; 
        wx.setStorageSync('refreashcount', count);
        }
      wx.setStorageSync('m', m);
      this.getUserInfo();
      count++;
      wx.setStorageSync('refreashcount', count);
      // wx.hideLoading();
    } else {
      if(count < 5){
        this.getUserInfo();
        count++;
        wx.setStorageSync('refreashcount', count);
        // wx.hideLoading();
      }else{
        console.log("操作太快啦");
        wx.showToast({
          title: '操作太频繁啦',
          icon: 'none',
          duration: 2000
        });
      }
      //提交太频繁了。
    } 
  },

  getUserInfo :function(){
    wx.showLoading({
      title: "正在同步...",
    });
    var that = this;
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        // console.log("res======" + JSON.stringify(res));
        var openId = app.globalData.userInfo.openId;
        var randomKey = app.globalData.userInfo.randomKey;
        var token = app.globalData.userInfo.token;
        app.globalData.userInfo = res.userInfo;
        app.globalData.userInfo.openId = openId;
        app.globalData.userInfo.randomKey = randomKey;
        app.globalData.userInfo.token = token;
        that.setData({
          userInfo: app.globalData.userInfo
        });
        util.setCurrentUser(app.globalData.userInfo);
        //完善的用户信息提交到后台入表
        app.saveOrUpdateUser(app.globalData.userInfo);
      },
      complete: function () { 
        wx.hideLoading();
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1500
        })
      }
    })
  }
})
