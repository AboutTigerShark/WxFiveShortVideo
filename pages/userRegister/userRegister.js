// pages/userRegister/userRegister.js
const app = getApp()

Page({

  data: {

  },
  doRegist: function(e){
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;

    //简单的验证
    if(username.length == 0 || password.length == 0){
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    }else{
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等候...',
      });
      wx.request({
        url: serverUrl + '/register',
        method: "POST",
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res){ //回调函数
          console.log(res.data);
          wx.hideLoading();
          var status = res.data.status;
          if(status==200){
            wx.showToast({
              title: '注册成功!',
              icon: 'none',
              duration: 3000
            })
            app.userinfo = res.data.data;
          } else if (status==500){
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
  goLoginPage: function(){
    wx.navigateTo({
      url: '../userLogin/userLogin',
    })
  }

})