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
    picUrl: "https://0001.kuufuu.com/",
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
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    console.log("test1 onReady");
  },

  onHide: function () {
    // 生命周期函数--监听页面隐藏
    console.log("test1 onHide");
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
    console.log("test1 onUnload");
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    console.log("test1 onPullDownRefresh");
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
    console.log("test1 onReachBottom");
  }
})
