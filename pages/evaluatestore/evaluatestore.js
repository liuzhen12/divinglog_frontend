// pages/evaluatestore/evaluatestore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: '',
    links: '',
    array: '',
    score: 0,
    comments:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('access_token')
    var links = wx.getStorageSync('evaluatestoreLinks')
    that.setData({
      access_token: token,
      links: links
    });
    console.log(token)
    wx.request({
      url: links.href + "?access-token=" + token,
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resArray) {
        console.log(resArray.data)
        that.setData({
          array: resArray.data
        })
      }
    })
  },

  chooseicon: function (e) {
    var strnumber = e.target.dataset.id;
    var _obj = {};
    _obj.curHdIndex = strnumber;
    that.setData({
      tabArr: _obj,
      score: strnumber
    });
    console.log(_obj)
  },

  InputComments:function(e){
    var that = this
    var value = e.detail.value;
    that.setData({
      comments: value
    });
  },

  btnSave:function(e){
    wx.showLoading({
      title: 'Saving',
    })
    wx.request({
      url: this.data.array._links.edit.href + "?access-token=" + this.data.access_token,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "PUT",
      data: Util.json2Form({
        divestore_score: this.data.score,
      }),
      complete: function (res) {
        if (res == null || res.statusCode != 200) {
          console.error(res.statusCode);
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title: '提交失败',
            icon: 'fail',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
        wx.navigateBack({
          delta: 1
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})