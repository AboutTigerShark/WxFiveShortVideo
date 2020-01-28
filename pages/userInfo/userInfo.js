// pages/userInfo/userInfo.js
const app = getApp()
Page({

  data: {

    faceUrl: "../resource/images/noneface.png",
    isMe: true,
    isFollow: false,
  },
  logout: function(){
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请稍等...',
    });

    var user = app.userinfo;
    debugger;
    wx.request({
      url: serverUrl + '/logout?userId=' + user.id,
      method: "POST",
      header: {'content-type': 'application/json'},
      success: function(res){
        console.log(res.data);
        var status = res.data.status;
        if (status == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '注销成功',
            icon: 'success',
            duration: 2000
          });
          wx.removeStorageSync("userinfo"); //清除缓存
          wx.redirectTo({
            url: '../userLogin/userLogin',
          })
        } 
      }
    })
    debugger;
  }

})