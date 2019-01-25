
function setCurrentUser(user) {
  var currUser = {
    nickName: user.nickName,
    gender: user.gender,
    language: user.language,
    city: user.city,
    province: user.province,
    country: user.country,
    avatarUrl: user.avatarUrl,
    openId: user.openId,
    token: user.token,
    randomKey: user.randomKey
  };
  wx.setStorageSync("currentUser", currUser);
}

function getCurrentUser() {
  return wx.getStorageSync("currentUser");
}

function setStorageSync(key, value) {
   wx.setStorageSync(key, value);
}

function getStorageSync(key) {
   return wx.getStorageSync(key);
}

function removeStorageSync(key) {
   wx.removeStorageSync(key);
}

function isNull(obj){
  if(obj == undefined || JSON.stringify(obj)=='{}'){
    return true;
  }else{
    return false;
  }
}

function isNotNull(obj){
   return !isNull(obj);
}

function formatTime(date) {
  //var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  //var second = date.getSeconds()


  return [month, day].map(formatNumber)+""+[hour, minute].map(formatNumber)
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTimes(date) { 
  var year = date.getFullYear()
  var month = date.getMonth() + 1 
  var day = date.getDate() 
  var hour = date.getHours() 
  var minute = date.getMinutes() 
  var second = date.getSeconds() 
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':') }

module.exports = {
  formatTime: formatTime,
  formatTimes:formatTimes,
  setCurrentUser: setCurrentUser,
  getCurrentUser: getCurrentUser,
  setStorageSync: setStorageSync,
  getStorageSync: getStorageSync,
  removeStorageSync: removeStorageSync,
  isNull: isNull,
  isNotNull: isNotNull
}
