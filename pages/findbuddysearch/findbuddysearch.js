// pages/findbuddysearch/findbuddysearch.js
Page({
  data:{
    array:[],
    },

  onLoad:function(options){
    var that = this
    var link = wx.getStorageSync('findbuddysearchLinks')
    var token = wx.getStorageSync('access_token')
    wx.request({
      url: link.self.href + '?access-token=' + token,
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resArray) {
        console.log(resArray)
        that.setData({
          array: resArray.data
        })
      }
    })
  },

  btnSave: function(e){
    wx.showLoading({
      title: 'Saveing',
    })
    var links = this.data.array._links
    wx.request({
      url: links.participate.href + "?access-token=" + this.data.access_token,
      data: Util.json2Form({

      })
      ,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      complete: function (res1) {
        if (res1 == null || res1.statusCode != 201) {
          console.error(res1.statusCode);
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title: 'save fail',
            icon: 'fail',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          return;
        }
        console.log(res1)
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: 'Join Success',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
        var pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          //关键在这里
          prePage.onLoad()
        }
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})