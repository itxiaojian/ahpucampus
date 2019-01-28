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
      wx.openSetting({
         success: (res) => {
            console.log(JSON.stringify(res));
            /*
             * res.authSetting = {
             *   "scope.userInfo": true,
             *   "scope.userLocation": true
             * }
             */
         }
      })
      }
})