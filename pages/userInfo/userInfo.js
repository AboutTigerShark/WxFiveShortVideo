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
    var userinfo = app.userinfo;
    console.log(userinfo);
     wx.request({
       url: serverUrl + '/user/query?userId=' + userinfo.id,
       method: "POST",
       header: { 'content-type': 'application/json' },
       success: function (res) {
         console.log(res.data);
         var status = res.data.status;
         if(status == 200){
           var userinfo = res.data.data;
         
           var faceUrl = "../resource/images/noneface.png";
           if (userinfo.faceImage != "" && userinfo.faceImage != undefined &&                      userinfo.faceImage != null){
             faceUrl = serverUrl + userinfo.faceImage;

           }
           me.setData({
             faceUrl: faceUrl,
             fansCounts: userinfo.fansCounts,
             followCounts: userinfo.followCounts,
             receiveLikeCounts: userinfo.receiveLikeCounts,
             nickname: userinfo.nickname
           })
     
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

  },
  uploadVideo: function(){
    wx.chooseVideo({
      sourceType: ['album'],
      success(res) {
        console.log(res);

        var duration = res.duration;
        var height = res.height;
        var width = res.width;
        var tempVideoPath = res.tempFilePath;
        var tempCoverPath = res.thumbTempFilePath;

        if(duration > 10){
          wx.showToast({
            title: '上传视频过长,请上传小于10秒的视频!',
            icon: "none",
            duration: 2500,
          })
        }else if (duration < 1) {
          wx.showToast({
            title: '上传视频过短,请上传大于1秒的视频',
            icon: "none",
            duration: 2500,
          })
        }else{
          //TODO 打开选择BGM的页面
        }
      }
    })
  }

})