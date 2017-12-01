// pages/mycourses/mycourses.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: '',
    array: [],
    extra:[]
  },

  coursesEdit: function (event) {
    wx.setStorageSync('mycourseLinks', event.currentTarget.dataset.links)
    wx.setStorageSync('mycourseStatus','Edit')
    wx.navigateTo({
      url: '../mycoursesedit/mycoursesedit'
    })
  },
  addCourse: function () {
    wx.setStorageSync('mycourseAddLinks', this.data.extra)
    wx.setStorageSync('mycourseStatus', 'Add')
    wx.navigateTo({
      url: '../mycoursesedit/mycoursesedit'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var token = wx.getStorageSync('access_token')
    that.setData({
      access_token: token,
    })
    var links = wx.getStorageSync('meLinks')
    wx.request({
      url: links.coachCourse.href + '?access-token=' + token,
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resArray) {
        console.log(resArray)
        that.setData({
          array: resArray.data.items,
          extra: resArray.data._extra
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})