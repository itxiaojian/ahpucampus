var CusBase64 = require('base64.js');
var md5 = require('md5.js'); 
var util = require('util.js');


/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 * token: jwt token
 */
function doPost(url, message, postData, token, doSuccess, doFail) {

  // wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }

  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: url,
    header: {
      "content-type": "application/json;charset=UTF-8",
      "Authorization": "Bearer " + token
    },
    data: jwt4params(postData),
    method: 'POST',
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      doSuccess(res.data);
    },
    fail: function () {
      doFail();
    },
  })
}

//GET请求，不需传参，直接URL调用，
function doGet(url, doSuccess, doFail) {
  wx.request({
    url: url,
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    method: 'GET',
    success: function (res) {
      // wx.hideNavigationBarLoading()
      doSuccess(res.data);
    },
    fail: function () {
      // wx.hideNavigationBarLoading()
      doFail();
    },
  })
}

function jwt4params(params){
  var randomKey = params.randomKey;
  var _object = CusBase64.CusBASE64.encoder(JSON.stringify(params));
  var sign = md5.hexMD5(_object + randomKey);
  return new BaseTransferEntity(sign,_object);
}
function BaseTransferEntity(sign,_object){
  this.sign = sign;
  this._object = _object;
}

function request(url, params, success, fail) {
  this.requestLoading(url, params, "", success, fail)
}
function requestLoading(url, params, message, success, fail) {
  //console.log(params)
  // wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: app.globalData.API_URL+url,
    data: params,
    header: {
      //'Content-Type': 'application/json'
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      //console.log(res.data)
      // wx.hideNavigationBarLoading()
      if (res.data != 0){      

        if (res.statusCode == 200) {
          success(res.data)
        } else {
          fail()
        }
      }
      if (message != "") {
        wx.hideLoading()
      }

    },
    fail: function (res) {
      // wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      fail()
    },
    complete: function (res) {
      // wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    },
  })
}
module.exports = {
  request: request,
  requestLoading: requestLoading,
  doPost: doPost,
  doGet: doGet
}