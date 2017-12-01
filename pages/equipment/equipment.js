Page({
  data: {
    access_token: '',
    array: []
  },
  equipEdit: function(event){
    wx.setStorageSync('equipLinks', event.currentTarget.dataset.links)
    wx.setStorageSync('equipStatus', 'Edit')
    wx.navigateTo({
      url: '../equipmentedit/equipmentedit'
    })
  },
  addEquipment: function(){
    wx.setStorageSync('equipStatus', 'Add')
    wx.navigateTo({
      url: '../equipmentedit/equipmentedit'
    })
  },
  onLoad: function () {
    var that = this
    var token = wx.getStorageSync('access_token')
    var links = wx.getStorageSync('meLinks')
    that.setData({
      access_token: token,
    });
    wx.request({
      url: links.equip.href + '?access-token=' + res.data,
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resArray) {
        that.setData({
          array: resArray.data.items
        })
      }
    })
  }
});