//about.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
var httprequest = require('../../utils/httprequest.js');
Page({
  data: {
    showLog: false,
    aboutInfo:null
  },
  onLoad: function () {
     var aboutInfo = null;
     var that = this;
     var data = {
        "type": "1",
        'randomKey': app.globalData.userInfo.randomKey
     };
     httprequest.doPost(app.globalData.API_URL + "/userindex/getAboutInfo", "", data, app.globalData.userInfo.token,
        function (res) {
           if(res.code == 200){
              console.log("/userindex/getAboutInfo成功" + JSON.stringify(res));
              aboutInfo = res.data.aboutInfo;
              util.setStorageSync('aboutInfo', aboutInfo);
              that.setData({
                 aboutInfo: aboutInfo,
                 year: new Date().getFullYear()
              });
           }
           console.log("/userindex/getAboutInfo成功" + JSON.stringify(res));
        },
        function (res) {
           aboutInfo = util.getStorageSync('aboutInfo');
           console.log("/userindex/getAboutInfo失败" + JSON.stringify(res));
        });
    
  },
  toggleLog: function () {
    this.setData({
      showLog: !this.data.showLog
    });
  }
});