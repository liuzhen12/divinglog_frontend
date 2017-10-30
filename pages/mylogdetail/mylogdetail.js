Page({
    data: {
      access_token: '',
      array: '',
      source: function () {
        var that = this;
        wx.chooseImage({
          count: 1,
          //original原图，compressed压缩图
          sizeType: ['original'],
          //album来源相册 camera相机
          sourceType: ['album', 'camera'],
          //成功时会回调
          success: function (res) {
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

    onShareAppMessage: function () {
      return {
        title: 'Stamp',
        path: '/pages/logedit?status=Stamp&selflink=' + this.data.loglinks.self.href,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    },

    yulan: function (event) {
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

    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    }
});