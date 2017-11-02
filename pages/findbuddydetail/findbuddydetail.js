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
    }
});