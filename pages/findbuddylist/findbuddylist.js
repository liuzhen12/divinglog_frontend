// pages/findbuddylist/findbuddylist.js
Page({
  data:{
    array: []
  },
  onLoad: function (options) {
    var that = this
    var link = wx.getStorageSync('findbuddyMineLinks')
    var token = wx.getStorageSync('access_token')
    wx.request({
      url: link.href + '?access-token=' + token,
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
  },

  findbuddyEdit: function(e){
    console.log(e);
    wx.setStorage({
      key: "findbuddydetailLinks",
      data: e.currentTarget.dataset.links
    })
    wx.navigateTo({
      url: '../findbuddydetail/findbuddydetail'
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