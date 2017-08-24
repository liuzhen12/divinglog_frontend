Page({
    data:{
      access_token: '',
      array: []
    },
    levelEdit: function (event) {
      wx.setStorage({
        key: "melevelLinks",
        data: event.currentTarget.dataset.links
      })
      wx.setStorage({
        key: "melevelStatus",
        data: "Edit"
      })
      wx.navigateTo({
        url: '../meleveledit/meleveledit'
      })
    },
    addLevel: function () {
      wx.setStorage({
        key: "melevelStatus",
        data: "Add"
      })
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