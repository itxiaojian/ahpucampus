var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var util = require('../../utils/util.js');
var httprequest = require('../../utils/httprequest.js');
var wxMarkerData = [];  
var app = getApp();
var qqmapsdk;
Page({
  data: { 
    markers: [],    
    longitude:'',    
    latitude:'',
    realLongitude:'',
    realLatitude:'',
    province:'',
    city:'',
    district:'',  
    detailAddress:'',    
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
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: app.globalData.qqmapKey
    });
    this.getrealLocaltion();
  },
  getrealLocaltion:function(){
    var that = this;
    wx.getLocation({
      success: function(res) {
        console.log("getrealLocaltion===" +JSON.stringify(res));
        that.setData({
          realLongitude:res.longitude,
          realLatitude:res.latitude,

        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
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
          if(res.success){
            var aid = res.data.messageId;
            if (imglist != '') {
              for (var i = 0; i < imglist.length; i++) {
                wx.uploadFile({
                  url: app.globalData.API_URL + '/messagefile/upload',
                  filePath: imglist[0],
                  name: 'files',
                  formData: {
                    'pid': aid,
                    'formData': JSON.stringify(e.detail.value)
                  },
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json',
                     "Authorization": "Bearer " + app.globalData.userInfo.token
                  },
                  success: function (res) {
                    console.log('successmessagefile/upload' + JSON.stringify(res));
                    if (i >= imglist.length) {
                      wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 3000
                      })
                      that.setData({
                        imglist: [],
                        detailAddress:'',
                        loading: true,
                        disabled: true
                      })
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }, 2000)
                    }
                  },
                  fail:function(res){
                    console.log('failmessagefile/upload'+JSON.stringify(res));
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
    this.onChangeAddress();
  },

  //移动选点
  onChangeAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(JSON.stringify(res));
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          detailAddress: res.name
        });
        that.getlocationDetial(res.latitude, res.longitude);
      },
      fail: function (err) {
        console.log(err);
        that.setData({
          latitude: 0,
          longitude: 0,
          detailAddress: '火星网友一枚'
        })
      }
    });
  },

  getlocationDetial: function (latitude, longitude){
    var that = this;
    // 调用接口
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res);
        var addressComponent = res.result.address_component;
        that.setData({
          province: addressComponent.province,
          city: addressComponent.city,
          district: addressComponent.district
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
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