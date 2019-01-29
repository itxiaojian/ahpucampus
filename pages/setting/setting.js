var app = getApp();
Page({


  data: {
    loadingHide: true,
    loadingText: "加载中"
  },
  callmeTap: function () {
    wx.makePhoneCall({
      phoneNumber: '0351-7171839'
    })
  },

  onLoad: function (options) {
    var that = this;
    that.setData({ loadingHide: false });
    setTimeout(function () {
      that.setData({ loadingHide: true });
    }, 1000)
  },

   clearStorage : function(){
      wx.clearStorage({
         success: (res) => {
            console.log(JSON.stringify(res));
            wx.showToast({
               title: ' 清除成功',
               icon: 'success',
               duration: 1500
            })
         },
         fail: (res) => {
            console.log(JSON.stringify(res));
            wx.showToast({
               title: ' 清除失败',
               icon: 'success',
               duration: 1500
            })
         }
      })
   }
})