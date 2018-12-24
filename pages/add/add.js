var bmap = require('../../utils/bmap-wx.js');
var util = require('../../utils/util.js');
var httprequest = require('../../utils/httprequest.js');
var wxMarkerData = [];  
var app = getApp();
Page({
  data: {
    ak:"HlywG465vNEBwWOm98Exbt3ZwB2nk2VF", 
    markers: [],    
    longitude:'',    
    latitude:'', 
    province:'',
    city:'',
    district:'',  
    detailAddress:'获取中...',    
    index: 0,
    date: '2017-01-01',
    isChecked: true,
    isChecksd: false,
    messageType:0,
    labels:"丢失日期",
    imglist: [],
    item: '../../image/upic.png',
    loading: false,
    disabled: false,
    loadingHide: true,
    loadingText: "位置获取中",
    content:'',
    userInfo: {}
  },

  onLoad: function () {
    this.getBaiduMap();
  },

  onShow: function () {
    var that = this;
    //先从缓存中赋值当前页面用户信息
    var currentUser = util.getCurrentUser();
    that.setData({
      userInfo: currentUser,
      disabled: false,
      loading: false,
      content: '',
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  diushi:function(){
    this.setData({
      isChecksd: false,
      isChecked: true,
      messageType: 0,
      labels:"丢失日期"
    })
  },

  jiandao: function () {
    this.setData({
      isChecked: false,
      isChecksd: true,
      messageType: 1,
      labels: "捡到日期"
    })
  },

  formSubmit: function (e) {
    var that = this;
    var imglist = that.data.imglist;
    var formData = e.detail.value;
    var content = e.detail.value.content;
    var isChecked = that.data.isChecked;
    var isChecksd = that.data.isChecksd;
    if (isChecked == true){
      var rid = 0;
    }else if (isChecksd == true) {
      var rid = 1;
    }
    if (content.length === 0){
      wx.showToast({
        title: '描述没填写',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.showToast({
        title: '请稍后',
        icon: 'loading',
        duration: 4000
      })


      httprequest.doPost(app.globalData.API_URL + "/message/save", "", formData, app.globalData.userInfo.token,
        function (res) {
          console.log(JSON.stringify(res));
          wx.hideNavigationBarLoading()
          if(res.data.success){
            var aid = res.data.data.messageId;
            if (imglist != '') {
              for (var i = 0; i < imglist.length; i++) {
                wx.uploadFile({
                  url: app.globalData.API_URL + 'upload/pid/' + aid,
                  filePath: imglist[0],
                  name: 'files',
                  formData: {
                    'pid': aid
                  },
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  success: function (res) {
                    if (i >= imglist.length) {
                      wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 3000
                      })
                      that.setData({
                        imglist: [],
                        loading: true,
                        disabled: true
                      })
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }, 2000)
                    }
                  }
                })
              }

            } else {
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 3000
              })
              that.setData({
                loading: true,
                disabled: true
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2000)
            }
          }
        },
        function (res) {
          wx.hideNavigationBarLoading()
          // console.log("用户信息保存失败" + JSON.stringify(user));
        });
    }
  }, 



  checkimg: function () {
    self = this
    wx.chooseImage({
      count: 3, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        self.setData({
          imglist: tempFilePaths
        })
      }
    })
  },

  clearGps: function(){
    this.getBaiduMap();
  },
  getBaiduMap: function (){     
    var that = this;    
    that.setData({ loadingHide: false });
    var BMap = new bmap.BMapWX({     
        ak: that.data.ak     
    });    
    var fail = function(data) { 
        var errMsg = data.errMsg;
        if(errMsg == 'getLocation:fail auth deny'){
          that.setData({  
            latitude: 0,    
            longitude: 0,
            detailAddress:'火星网友一枚'
          })
        }else{
          that.setData({
            latitude: 0,    
            longitude: 0,
            detailAddress:'火星网友一枚'
          })
        }
        setTimeout(function () {
          that.setData({ loadingHide: true });
        }, 1000)  
    };     
    var success = function(data) {
      console.log("百度地图返回" + JSON.stringify(data));  
        wxMarkerData = data.wxMarkerData;
      var addressComponent = data.originalData.result.addressComponent;
        that.setData({     
            markers: wxMarkerData,    
            latitude: wxMarkerData[0].latitude,    
            longitude: wxMarkerData[0].longitude,    
            detailAddress: wxMarkerData[0].address,  
            province:addressComponent.province,
            city:addressComponent.city,
            district:addressComponent.district 
        }); 
        setTimeout(function () {
          that.setData({ loadingHide: true });
        }, 1000)     
    }; 
    BMap.regeocoding({     
        fail: fail,     
        success: success
    }); 
  }

})