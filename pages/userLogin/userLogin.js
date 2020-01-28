// pages/userLogin/userLogin.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  doLogin: function(e){
    var formobject = e.detail.value;
    var username = formobject.username;
    var password = formobject.password;

    var serverUrl = app.serverUrl;

    //判空
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    }else{
      wx.showLoading({
        title: '登陆中...'
      });
      wx.request({
        url: serverUrl + '/login',
        method: 'POST',
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          wx.hideLoading();
          var status = res.data.status;
          if (status == 200) {
            wx.showToast({
              title: '登录成功',
              icon: 'none',
              duration: 3000
            })
            app.userinfo = res.data.data;
            wx.navigateTo({
              url: '../userInfo/userInfo',
            })
          } else if (status == 500) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }

        }
      })
    }
  
  },
  goRegistPage: function(e){
    wx.navigateTo({
      url: '../userRegister/userRegister',
    })
  }

})