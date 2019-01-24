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
function doPost(url, message, postData, token, doSuccess, doFail, docomplete) {

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
      
      if (res.statusCode == 200) {
        if(res.data.code == 200){
          doSuccess(res.data);
        }else{
          wx.showLoading({
            title: res.data.message,
          })
        }
        
      } else {
        doFail();
      }
      if (message != "") {
        wx.hideLoading()
      }
    },
    fail: function () {
      if (message != "") {
        wx.hideLoading()
      }
      doFail();
    },
    complete:function(){
       if(docomplete!=undefined){
          docomplete();
       }
      wx.hideLoading();
    }
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

module.exports = {
  doPost: doPost,
  doGet: doGet
}