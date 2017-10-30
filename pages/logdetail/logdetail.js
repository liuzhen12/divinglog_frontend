//获取应用实例
var app = getApp()
Page({
    data: {
      access_token:'',
      array:'',
      source: function() {
        var that = this;
        wx.chooseImage({
          count: 1,
          //original原图，compressed压缩图
          sizeType: ['original'],
          //album来源相册 camera相机
          sourceType: ['album', 'camera'],
          //成功时会回调
          success: function(res) {
          //重绘视图
          that.setData({
          source: res.tempFilePaths,
          })
          }
        })
      }
    },

    onLoad: function (option) {
      var that = this;
      var token = wx.getStorageSync('access_token')
      var links = wx.getStorageSync('loglistLinks')
      that.setData({
        access_token: token,
      });
      console.log(token)
      wx.request({
        url: links.self.href + "?access-token=" + token,
        data: {

        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (resArray) {
          console.log(resArray.data)
          var url = wx.getStorageSync('url')
          var original = resArray.data.assets.split(',')
          original.forEach(function (item, index, array) {
            array[index] = url + item;
          })
          resArray.data.original = original
          var compressed = resArray.data.assets.split(',')
          compressed.forEach(function (item, index, array) {
            array[index] = url + item.replace(".", "_thumb.");
          })
          resArray.data.compressed = compressed
          console.log(resArray.data)
          that.setData({
            array: resArray.data
          })
        }
      })
    },

    yulan: function (event){
      console.log(event)
      var currentUrl = event.currentTarget.dataset.url.replace("_thumb", "")
      var oriUrls = event.currentTarget.dataset.urls
      oriUrls.forEach(function (item, index, array) {
        array[index] = item.replace("_thumb", "");
      })
      wx.previewImage({
        current: currentUrl, // 当前显示图片的链接，不填则默认为 urls 的第一张
        urls: oriUrls,
        success: function (res) {
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    },
});