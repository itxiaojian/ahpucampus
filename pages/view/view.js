var app = getApp();
var util = require("../../utils/util.js");
var httprequest = require('../../utils/httprequest.js');
Page({
  data: {
    views:'',
     picUrl: app.globalData.API_URL + "/messagefile/getFile/original/",
    openId:'',
    windowWidth:'',
    windowHeight:'',
    contents:'',
    vid:'',
    tel:'0123456789',
    mobile:'',
    isShow: false,
    isLoad: true,
    content: "",
    isLoading: true,
    cfBg: false,
    comments: [],
    emojiChar: "😊----------------------------------------------------------------------------",
    //0x1f---
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [],
    alipayEmoji: [],
    view_id: 0,
    userInfo: {},
    nsdata: true,
    page: 1,
    pageSize: 5,
    gzList:[]  
  },

  onShow: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth * 0.92
        })
      }
    })
  },


 

  onLoad: function (params) {
    var that = this;
    wx.showNavigationBarLoading(); 
    
    app.getUserInfo(function (userInfo) {
        that.setData({
           userInfo: userInfo,
           openId: userInfo.openId
        })
     })
    var em = {}, emChar = that.data.emojiChar.split("-");
    var emojis = []
    that.data.emoji.forEach(function (v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v
      };
      emojis.push(em)
    });
    that.setData({
      emojis: emojis
    })
    that.umessage(params.id); 

     var data = {
        'messageId': params.id,
        'randomKey': that.data.userInfo.randomKey
     };
    httprequest.doPost(
      app.globalData.API_URL + "/message/queryDetail",
          "",
          data,
          app.globalData.userInfo.token,
          function (res) {
            var mobile = res.data.telephone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            that.setData({
              views: res.data,
              contents: res.data.content,
              vid: res.data.id,
              tel: res.data.telephone,
              mobile: mobile,
              view_id: params.id
              //gzList: res.data.gzlist
            })
            wx.showLoading({
              title: '加载中'
            })
          },
          function () {
            setTimeout(function () {
                wx.hideLoading()
            }, 1000)
            wx.hideNavigationBarLoading()
          },
          function () {
            setTimeout(function () {
                wx.hideLoading()
            }, 1000)
            wx.hideNavigationBarLoading()
          }
    );
    setTimeout(function () {
      that.getGuanzhu(1);
    }, 5000) 
    setTimeout(function () {
      that.getGuanzhu(2);
    }, 7000)
  },

   umessage: function (vid) {
      var that = this;
      var data = {
         page: 0,
         page_size: that.data.pageSize,
         messageId: that.data.view_id
      };

      httprequest.doPost(app.globalData.API_URL + '/message/getMessageComments', '', data, app.globalData.userInfo.token,
         function (res) {
            var msNum = res.data.comments.length;

            if (msNum == undefined) {
               that.setData({
                  nsdata: false
               })
            } else {
               that.setData({
                  comments: res.data.comments,
                  view_id: vid
               })
            }

         })
   },

   getGuanzhu: function (ev) {
      var that = this;
      var userInfo = that.data.userInfo;
      var url = app.globalData.API_URL + '/message/saveOrGetVisitorLog';
      var data = {
         actionType: ev,
         openId: that.data.openId,
         messageId: that.data.vid,
         avatar: userInfo.avatarUrl,
         nickName: userInfo.nickName,
         randomKey: userInfo.randomKey
      }
      httprequest.doPost(url, "", data, app.globalData.userInfo.token,
         function (res) {
            wx.hideNavigationBarLoading()
            console.log("/getGuanzhu"+JSON.stringify(res.data));
         },
         function (res) {
            wx.hideNavigationBarLoading()
         });

   },

  callmeTap: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var urlink = new Array(current);
    wx.previewImage({
      current: 'current', 
      urls: urlink  
    })
  },

  openMaps:function(e){
    var lat = e.currentTarget.dataset.lat;
    var long = e.currentTarget.dataset.long;
    var address = e.currentTarget.dataset.address;
    wx.openLocation({
      latitude: Number(lat),
      longitude: Number(long),
      scale: 28,
      name:'信息发出位置',
      address: address
    })
  },

  

  getMusicInfo: function (message) {
    var that = this;
    var data = {
      messageId: that.data.view_id
    }
    httprequest.doPost(app.globalData.API_URL + '/message/getMessageComments', message, data, app.globalData.userInfo.token, 
    function (res) {
      var contentlistTem = that.data.comments
        if (that.data.page == 1) {
          contentlistTem = []
        }
      var contentlist = res.data.comments
        if (contentlist.length > that.data.pageSize) {
          that.setData({
            comments: contentlistTem.concat(contentlist),
            isLoading: false
          })
        } else {
          that.setData({
            comments: contentlistTem.concat(contentlist),
            isLoading: false,
            page: that.data.page + 1
          })
        }

    }, function (res) {
      wx.showToast({
        title: '加载失败',
      })

    })
  },

  onPullDownRefresh: function () {
    this.data.page = 1
    this.getMusicInfo('刷新数据')
  },

  onReachBottom: function () {

    if (this.data.isLoading) {
      this.getMusicInfo('..加载中..')
    } else {
      wx.showToast({
        title: '加载完成',
      })
    }
  },

  emojiScroll: function (e) {
    
  },

  
  textAreaFocus: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },
  emojiShowHide: function () {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.false
    })
  },
  emojiChoose: function (e) {
    this.setData({
      content: this.data.content + e.currentTarget.dataset.emoji
    })
  },
  cemojiCfBg: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },

  textAreaBlur: function (e) {
    console.log("textAreaBlur" + e.detail.value);
    this.setData({
      content: e.detail.value
    })

  },


  send: function (e) {
    var that = this, conArr = [];
    var vid = that.data.view_id;
    var userInfo = that.data.userInfo;
    var url = app.globalData.API_URL + '/message/saveComment';
    var sendTime = util.formatTimes(new Date());
    var content = that.data.content;
    if(content.trim().length === 0){
      wx.showToast({
        title: '评论不可为空哦',
        icon: 'loading',
        duration: 1000
      })
    }

    var data = {
      messageId:vid,
      content: content,
      sendOpenId: that.data.openId,
      sendAvatar: userInfo.avatarUrl,
      sendNickName: userInfo.nickName,
      createTime: sendTime,
      randomKey: userInfo.randomKey,
      commentType:1
    }
    setTimeout(function () {  
     httprequest.doPost(url, "", data, app.globalData.userInfo.token,
        function (res) {
          console.log("/saveComment" + JSON.stringify(res.data));
          if (content.trim().length > 0) {
            conArr.push({
               sendAvatar: userInfo.avatarUrl,
               sendNickName: userInfo.nickName,
               createTime: sendTime,
               content: that.data.content
            })
            that.setData({
              comments: that.data.comments.concat(conArr),
              content: "",
              isShow: false,
              cfBg: false
            })
            wx.showToast({
              title: '评论成功',
              icon: 'loading',
              duration: 1000
            })
          } else {
            that.setData({
              content: ""
            })
          }
        },
        function (res) {
          console.log("/saveComment失败" + JSON.stringify(res));
        });
    }, 100)
  },

onShareAppMessage: function (res) {
  var that = this;
  return {
    title: '【丢失】请各位朋友帮我找一找',
    path: '/pages/view/view?id=' + that.data.vid
  }
}

})