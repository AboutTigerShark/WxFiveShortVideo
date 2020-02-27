// pages/userInfo/userInfo.js
const app = getApp()
Page({

  data: {

    faceUrl: "../resource/images/noneface.png",
    isMe: true,
    isFollow: false,
  },
  onLoad: function(){
    var me = this;
    var serverUrl = app.serverUrl;
    var user = app.userinfo;
     wx.request({
       url: serverUrl + '/query?userId=' + user.id,
       method: "POST",
       header: { 'content-type': 'application/json' },
       success: function (res) {
         console.log(res.data);
         var status = res.data.status;
         
        if(status == 200){
          var user = res.data.data;
          var faceUrl = "../resource/images/noneface.png";
          if (user.face_image != "" && user.face_image != undefined &&                            user.face_image != null){
            me.setData({
              faceUrl: faceUrl,

            })
                

          }
        }
       }
     }) 
  },
  logout: function(){
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请稍等...',
    });

    var user = app.userinfo;
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
  },
  changeFace: function(){
    var me = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', ['compressed']],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.showLoading({
          title: '请稍等...',
        });

        var serverUrl = app.serverUrl;
        var userId = app.userinfo.id;
        wx.uploadFile({
          url: serverUrl + '/user/uploadFaceImage?userId=' + userId,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {'content-type': 'application/json'},
          success: function(res){
            var data = JSON.parse(res.data);
            console.log(data);
            wx.hideLoading();
            if(data.status == 200){
              wx.showToast({
                title: '更换成功..',
                icon: 'success',
              });

              var imageUrl = data.data;
              me.setData({
                faceUrl: serverUrl + imageUrl
              });
              
            }else if(data.status == 500){
              wx.showToast({
                title: res.data.msg,
              })
            }
           
          }
        })
      },
    })

  }

})