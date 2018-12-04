
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

function isNull(obj){
  if(obj == undefined || JSON.stringify(obj)=='{}'){
    return true;
  }else{
    return false;
  }
}

function formatTime(date) {
  //var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  //var second = date.getSeconds()


  return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  setCurrentUser: setCurrentUser,
  getCurrentUser: getCurrentUser,
  isNull: isNull
}
