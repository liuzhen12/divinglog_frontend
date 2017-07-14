Page({
    data:{
      access_token: '',
      array: []
    },
    levelEdit: function (event) {
      console.log(event)
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
      wx.getStorage({
        key: 'access_token',
        success: function (resToken) {
          console.log(resToken.data)
          that.setData({
            access_token: resToken.data,
          });
          wx.getStorage({
            key: 'meLinks',
            success: function (resLinks) {
              console.log(resLinks)
              wx.request({
                url: resLinks.data.level.href + "?access-token=" + resToken.data,
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
          })
        },
      })
    }
});