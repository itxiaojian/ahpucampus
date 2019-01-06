var util = require('../../utils/util.js');
var httprequest = require('../../utils/httprequest.js');
var app = getApp();
var page = 0;
var page_size = 5; 
var GetList = function (that) {
  var activeIndex = that.data.activeIndex;
  that.setData({
    hidden: false
  });
  wx.showNavigationBarLoading();

  var data = {
     'page': page,
     'pageSize': page_size,
     'activeIndex': that.data.activeIndex,
     'randomKey': that.data.userInfo.randomKey
  };

  console.log(JSON.stringify(data));

   httprequest.doPost(
      app.globalData.API_URL + "/message/queryList",
      "",
      data,
      app.globalData.userInfo.token,
      function (res) {
         var list = that.data.list;
         var whdthNum = res.data.list.length;
         if (whdthNum == 0) {
         that.setData({
            ShdthNum: whdthNum
         });
         }
         if (whdthNum != 0){
            for (var i = 0; i < res.data.list.length; i++) {
            list.push(res.data.list[i]);
         }
         setTimeout(function () {
            that.setData({
               list: list
            });
         }, 300)
         page++;
         setTimeout(function () {
            that.setData({
               hidden: true
            });
         }, 4000)
         }else{
         that.setData({
            hidden: true,
            display: false
         });
         }
    },
      function () {
         wx.hideNavigationBarLoading();
         wx.stopPullDownRefresh();
      },
      function () {
         wx.hideNavigationBarLoading();
         wx.stopPullDownRefresh();
      });
}
Page({
  data: {
     picUrl: app.globalData.API_URL + "/messagefile/getFile/preview/",
    hidden: true,
    list: [],
    scrollTop: 0,
    tabs: ["丢失的物品", "捡到的物品"],
    activeIndex: 0,
    ShdthNum: 1,
    display: true,
     userInfo: {}
  },
  onLoad: function () {
     var that = this;
    console.log("test1 onLoad");
    //获取用户基本信息
    app.getUserInfo(function (userInfo) {
      util.setCurrentUser(userInfo);
       that.setData({
         userInfo: userInfo
      })
    })
  },
  onShow: function () {
    console.log("test1 onShow");
    var that = this;
    var ShdthNum = that.data.ShdthNum;
    if (ShdthNum == 1){
      GetList(that);
    }
  },

  onReachBottom: function (e) {
    var that = this;
    var ShdthNum = that.data.ShdthNum;
    if (ShdthNum != 0){
      GetList(that);
    }
  },

  tabClick: function (e) {
    page = 0;
    this.setData({
      list: [],
      activeIndex: e.currentTarget.id,
      ShdthNum: 1,
      display: true
    });
    GetList(this)
  },

  onShareAppMessage: function () {
    var that = this;
    var picUrl = that.data.picUrl;
    return {
      title: '童鞋，你有一条失物招领的消息！',
      path: '/pages/index/index'
    }
  }
})
