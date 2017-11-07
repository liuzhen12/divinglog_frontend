// pages/evaluatecoach/evaluatecoach.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token:'',
    links: '',
    array: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('access_token')
    var links = wx.getStorageSync('evaluatecoachLinks')
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
        console.log(resArray.data.items)
        that.setData({
          array: resArray.data.items
        })
      }
    })
  },

  chooseicon: function (e) {
    var that = this
    var strnumber = e.target.dataset.id;
    var idx = e.target.dataset.idx;
    that.data.array[idx].score = strnumber
    that.setData({
      array : that.data.array
    });
  },

  commentsInput: function(e){
    console.log(e)
    var that = this
    var value = e.detail.value;
    var idx = e.target.dataset.idx;
    that.data.array[idx].remarks = value
    that.setData({
      array: that.data.array
    });
  },

  btnSave:function(e){
    wx.showLoading({
      title: 'Saving',
    })
    var that = this;
    for(var i=0; i<this.data.array.length;i++){
      wx.request({
        url: array[i]._links.edit.href + "?access-token=" + this.data.access_token,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT",
        data: Util.json2Form({
          score: array[i].score,
          remarks: array[i].remarks
        }),
        complete: function (res){
          if (res == null || res.statusCode != 200){
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
            return;
          }
        }
      })
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