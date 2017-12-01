Page({
    data:{
      access_token: '',
      array: []
    },
    levelEdit: function (event) {
      wx.setStorageSync('melevelLinks', event.currentTarget.dataset.links)
      wx.setStorageSync('melevelStatus', 'Edit')
      wx.navigateTo({
        url: '../meleveledit/meleveledit'
      })
    },
    addLevel: function () {
      wx.setStorageSync('melevelStatus', 'Add')
      wx.navigateTo({
        url: '../meleveledit/meleveledit'
      })
    },
    onLoad: function(){
      var that = this;
      var token = wx.getStorageSync('access_token')
      var links = wx.getStorageSync('meLinks')
      that.setData({
        access_token: token,
      });
      wx.request({
        url: links.level.href + "?access-token=" + token,
        data: {

        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (resArray) {
          console.log(resArray)
          that.setData({
            array: resArray.data.items
          })
        }
      })
    }
});