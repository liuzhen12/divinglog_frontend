// pages/mycourses/mycourses.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: '',
    array: []
  },

  coursesEdit: function (event) {
    console.log(event)
    wx.setStorage({
      key: "mycourseLinks",
      data: event.currentTarget.dataset.links
    })
    wx.setStorage({
      key: "mycourseStatus",
      data: "Edit"
    })
    wx.navigateTo({
      url: '../mycoursesedit/mycoursesedit'
    })
  },
  addCourse: function () {
    wx.setStorage({
      key: "mycourseStatus",
      data: "Add"
    })
    wx.navigateTo({
      url: '../mycoursesedit/mycoursesedit'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'access_token',
      success: function (res) {
        that.setData({
          access_token: res.data,
        });
        wx.getStorage({
          key: 'meLinks',
          success: function (resLinks) {
            console.log(resLinks.data)
            wx.request({
              url: resLinks.data.coachCourse.href + '?access-token=' + res.data,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})