Page({
  data: {
    access_token: '',
    array: []
  },
  equipEdit: function(event){
    console.log(event)
    wx.setStorage({
      key: "equipLinks",
      data: event.currentTarget.dataset.links
    })
    wx.setStorage({
      key: "equipStatus",
      data: "Edit"
    })
    wx.navigateTo({
      url: '../equipmentedit/equipmentedit'
    })
  },
  addEquipment: function(){
    wx.setStorage({
      key: "equipStatus",
      data: "Add"
    })
    wx.navigateTo({
      url: '../equipmentedit/equipmentedit'
    })
  },
  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'access_token',
      success: function (res) {
        that.setData({
          access_token: res.data,
        });
        wx.getStorage({
          key: 'meLinks',
          success: function (resLinks){
            console.log(resLinks.data)
            wx.request({
              url: resLinks.data.equip.href + '?access-token=' + res.data,
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
        
      }
    });

  }
});