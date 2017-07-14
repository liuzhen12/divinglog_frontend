// pages/registerdiver/registerdiver.js
var app = getApp()
var that;
var Util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: null,
    toastHidden: true,
    //hiddenLoading: true,
    array1: ["中文", "English", "粤语"],
    index: 0
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  listenerButton: function () {
    // this.setData({
    //   hiddenLoading: !this.data.hiddenLoading
    // })    
    wx.showLoading({
      title: '提交中',
    })
    console.log(this.data.code);
    that = this;
    wx.request({ 
      url: "https://log.fundiving.com/register",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }, 
      method: "POST",
      data: Util.json2Form({ 
        code: this.data.code, 
        avatar_url: app.globalData.userInfo.avatarUrl,
        nick_name: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender,
        city: app.globalData.userInfo.city,
        province: app.globalData.userInfo.province,
        country: app.globalData.userInfo.country,
        language: app.globalData.userInfo.language,
        language_detail: this.data.index,
        role: '1'
        }),      
      complete: function (res){
        if (res == null || res.statusCode != 201) {
          console.error(res.statusCode);
          // that.setData({
          //   hiddenLoading: true,
          // }); 
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
        console.log(res)
        // that.setData({
        //   hiddenLoading: true,
        // }); 
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
        wx.setStorageSync('access_token', res.data.access_token) 
        wx.setStorageSync('id', res.data.id)
        wx.setStorageSync('indexLinks', res.data._links)
        wx.setStorageSync('role', res.data.role)
        wx.navigateBack({
          delta: 2
        })      
      }  
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
          console.log(res.code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
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