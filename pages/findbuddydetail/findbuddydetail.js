Page({
    data: {
      array: [],
    },

    onLoad: function(){
      var that = this
      var link = wx.getStorageSync('findbuddydetailLinks')
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

    btnDelete: function(e){
      wx.showLoading({
        title: 'Deleting',
      })
      var links = this.data.array._links
      wx.request({
        url: links.delete.href + "?access-token=" + this.data.access_token,
        data: Util.json2Form({

        })
        ,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "DELETE",
        complete: function (res1) {
          if (res1 == null || res1.statusCode != 204) {
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
            title: 'Delete Success',
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
    }
});