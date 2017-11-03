//获取应用实例
var app = getApp()
Page({
  data: {
    access_token: '',
    array: [],
    loglinks: [],
    initialLogsLink: '',
    logsLink: '',
    searchLoading: false,
    searchLoadingComplte: false,
    batchLoadingComplete: true,
    source: function () {
      var that = this;
      wx.chooseImage({
        count: 1,
        //original原图，compressed压缩图
        sizeType: ['original', 'compressed'],
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
    wx.getSystemInfo({
      success: function (res) {
        //设置高度，根据当前设备宽高满屏显示
        that.setData({
          view: {
            Height: res.windowHeight
          }
        })
      }
    })
    var token = wx.getStorageSync('access_token')
    var links = wx.getStorageSync('logmineLinks')
    var params = { 'access-token': token };
    that.setData({
      access_token: token,
    });
    that.setData({
      initialLogsLink: links.href,
      logsLink: links.href
    })
    that.fetchSearchList();
    // wx.request({
    //   url: links.href + "?access-token=" + token,
    //   data: {

    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: "GET",
    //   success: function (resArray) {
    //     console.log(resArray)
    //     var url = wx.getStorageSync('url')        
    //     for (var i = 0; i < resArray.data.items.length;i++){
    //       var original = resArray.data.items[i].assets.split(',')
    //       original.forEach(function(item, index, array){
    //         array[index] = url + item;
    //       })
    //       resArray.data.items[i].original = original
    //       var compressed = resArray.data.items[i].assets.split(',')
    //       compressed.forEach(function (item, index, array) {
    //         array[index] = url + item.replace(".","_thumb.");
    //       })
    //       resArray.data.items[i].compressed = compressed
    //     }
    //     console.log(resArray)
    //     that.setData({
    //       array: resArray.data.items,
    //       loglinks: resArray.data._extra
    //     })
    //   }
    // })
  },

  fetchSearchList: function (refresh = true) {
    let that = this,
      token = wx.getStorageSync('access_token');
    var params = {
      'access-token': token
    };

    getData(that.data.logsLink, params, function (log_data) {
      var logItems = log_data.items;
      var url = wx.getStorageSync('url')
      for (var i = 0; i < logItems.length; i++) {
        var original = logItems[i].assets.split(',')
        original.forEach(function (item, index, array) {
          array[index] = url + item;
        })
        logItems[i].original = original
        var compressed = logItems[i].assets.split(',')
        compressed.forEach(function (item, index, array) {
          array[index] = url + item.replace(".", "_thumb.");
        })
        logItems[i].compressed = compressed
      }

      var logsArray = refresh ? logItems : that.data.array.concat(logItems);
      var nextUrl = log_data._links.next ? log_data._links.next.href : that.data.initialLogsLink;
      var loglinks = log_data._extra
      that.setData({
        array: logsArray,
        logsLink: nextUrl,
        loglinks: loglinks,
        searchLoading: log_data._links.next ? true : false,
        searchLoadingComplete: log_data._links.next ? false : true,
        batchLoadingComplete: true
      })
    })
  },

  searchScrollLower: function () {
    if (this.data.batchLoadingComplete && this.data.searchLoading && !this.data.searchLoadingComplete) {
      this.setData({
        batchLoadingComplete: false
      });
      this.fetchSearchList(false);
    }
  },

  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  addLog: function () {
    wx.setStorage({
      key: "logaddLinks",
      data: this.data.loglinks.create
    }),
      wx.setStorage({
        key: "logEditStatus",
        data: 'Add'
      })
    wx.navigateTo({
      url: '../logedit/logedit'
    })
  },

  logEdit: function (event) {
    wx.setStorage({
      key: "loglistLinks",
      data: event.currentTarget.dataset.links
    })
    var stamp = event.currentTarget.dataset.stamp
    if(stamp==0)
    {
      wx.setStorage({
        key: "logEditStatus",
        data: 'Edit'
      })
      wx.navigateTo({
        url: '../logedit/logedit'
      })
    }
    else{
      wx.navigateTo({
      url: '../mylogdetail/mylogdetail'
      })
    }
  },

  yulan: function (event) {
    console.log(event)
    var currentUrl = event.currentTarget.dataset.url.replace("_thumb","")
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

function getData(url, params, callback) {
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json'
    },
    data: params,
    complete: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
      else {
        console.log(res.data.message);
        callback();

      }
    }
  })
}