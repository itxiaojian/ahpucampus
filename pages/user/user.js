var app = getApp();
Page({
  data: {
    userInfo: {},
    openid: null
  },
  
  txtMore:function(){
    var that = this;
    var openid = that.data.openid;
    if(openid != null){
        wx.switchTab({
          url: '../index/index',
        })
    }else{
      console.log('尚未登录');
    }
  },

  onLoad: function () {
    var that = this;
      wx.login({
        success: function (loginCode) {
          wx.request({
            url: app.globalData.API_URL + '/wechat/authorize',
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            data: {
              code: loginCode.code
            },
            success: function (res) {
              console.log("authorize:" + JSON.stringify(res.data));
              if(res.data.success){
                console.log("useropenid:" + res.data.data);
                that.setData({
                  openid: res.data.data
                })
              }else{
                console.log("授权失败");
              }
            },
            fail: function () {
              console.log("授权失败,系统异常");
            }
          })
        }
      })
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      console.log("userInfo:" + JSON.stringify(userInfo));
    })
  }
})