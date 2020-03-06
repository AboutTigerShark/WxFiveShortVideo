// pages/chooseBgm/chooseBgm.js
const app = getApp()
Page({

  data: {
    bgmList : [],

  },
  onLoad: function (params) {
      var me = this;
      var serverUrl = app.serverUrl;

      console.log(params);
      me.setData({
        videoParams = params
      })

      wx.request({
        url: serverUrl + '/bgm/list',
        method: "POST",
        header: { 'content-type': 'application/json' },
        success: function (res){
          console.log(res.data)
          me.setData({
            serverUrl: serverUrl,
            bgmList : res.data.data
          })
        }
      })
      debugger;

  },
  upload: function(e){
    var me = this;
    var serverUrl = app.serverUrl;

    var bgmId = e.detail.value.bgmId;
    var desc = e.detail.value.desc;

    console.log("bgmId"+ bgmId);
    console.log("desc" + desc);

    var duration = me.data.videoParams.duration;
    var height = me.data.videoParams.height;
    var width = me.data.videoParams.width;
    var tempVideoPath = me.data.videoParams.tempFilePath;
    var tempCoverPath = me.data.videoParams.thumbTempFilePath;

    wx.showLoading({
      title: '上传中..',
    });

    var userId = app.userinfo.id;
    wx.uploadFile({
      url: serverUrl + '/video/uploadVideo?userId=' + userId,
      filePath: tempVideoPath,
      name: 'file',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var data = JSON.parse(res.data);
        console.log(data);
        wx.hideLoading();
        if (data.status == 200) {
          wx.showToast({
            title: '更换成功..',
            icon: 'success',
          });

          var imageUrl = data.data;
          me.setData({
            faceUrl: serverUrl + imageUrl
          });

        } else if (data.status == 500) {
          wx.showToast({
            title: res.data.msg,
          })
        }

      }
    })
  }
})