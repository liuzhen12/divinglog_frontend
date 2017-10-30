//获取应用实例
var app = getApp()
Page({
    data: {
      access_token: '',
      array: [],
      loglinks: [],
      source: function() {
        var that = this;
        wx.chooseImage({
          count: 1,
          //original原图，compressed压缩图
          sizeType: ['original','compressed'],
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

    onLoad: function (option){
      var that = this;
      var token = wx.getStorageSync('access_token')
      var links = wx.getStorageSync('indexLinks')
      that.setData({
        access_token: token,
      });
      wx.request({
        url: links.logs.href + "?access-token=" + token,
        data: {

        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (resArray) {
          console.log(resArray)
          var url = wx.getStorageSync('url')
          for (var i = 0; i < resArray.data.items.length; i++) {
            var original = resArray.data.items[i].assets.split(',')
            original.forEach(function (item, index, array) {
              array[index] = url + item;
            })
            resArray.data.items[i].original = original
            var compressed = resArray.data.items[i].assets.split(',')
            compressed.forEach(function (item, index, array) {
              array[index] = url + item.replace(".", "_thumb.");
            })
            resArray.data.items[i].compressed = compressed
          }
          console.log(resArray)
          that.setData({
            array: resArray.data.items,
            loglinks: resArray.data._extra
          })
        }
      })
    },

    logAdd: function(){
      wx.setStorage({
        key: "logaddLinks",
        data: this.data.loglinks.create
      }),
      wx.setStorage({
        key: "loguploadLinks",
        data: this.data.loglinks.upload
      }),
      wx.setStorage({
        key: "logEditStatus",
        data: 'Add'
      })
      wx.navigateTo({
        url: '../logedit/logedit'
      })
    },

    logMine: function () {
      wx.setStorage({
        key: "logmineLinks",
        data: this.data.loglinks.mine
      })
      wx.navigateTo({
        url: '../myloglist/myloglist'
      })
    },

    logEdit: function (event){
      wx.setStorage({
        key: "loglistLinks",
        data: event.currentTarget.dataset.links
      })
      wx.navigateTo({
        url: '../logdetail/logdetail'
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