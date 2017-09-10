// pages/findbuddylist/findbuddylist.js
Page({
  data:{
    array: []
  },
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'access_token',
      success: function (res) {
        that.setData({
          access_token: res.data,
        });
        wx.getStorage({
          key: 'indexLinks',
          success: function (resLinks){
            console.log(resLinks.data)
            wx.request({
              url: resLinks.data.activity.href + '?access-token=' + res.data,
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