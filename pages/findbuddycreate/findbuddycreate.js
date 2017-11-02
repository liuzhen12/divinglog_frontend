var Util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    title: '',
    startDate: '',
    endDate: '',    
    longitude: -1,
    latitude: -1,
    locationName: '',
    locationAddress: '',
    divePoint:'',
    maxMember: '',
    accommodation: '',
    participants:0,
    description: '',
    accommodationList: [
      {
        "ID":"1",
        "name":"Hotel"      
      },
      {
        "ID":"2",
        "name":"Liveaboard"
      }
    ],
    accommodationIndex: 0,
    accommodationID: 1,
    accommodationName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startDate: formatDate(new Date),
      endDate: formatDate(new Date)
    })
      
  },

  titleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  bindEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  selectLocation: function (e){
    wx.navigateTo({
      url: '../map/map?showMarkers=true&getLongitude=true&getLatitude=true',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },

  bindPickerAccommodationChange: function(e){
    console.log(e)
    this.setData({
      accommodationIndex: e.detail.value,
      accommodationID: this.data.accommodationList[e.detail.value].ID,
      accommodationName: this.data.accommodationList[e.detail.value].name
    })
    console.log(this.data.accommodationList[e.detail.value].ID)
  },

  locationNameInput: function(e){
    this.setData({
      locationName: e.detail.value
    })
  },

  locationAddressInput: function (e) {
    this.setData({
      locationAddress: e.detail.value
    })
  },

  divePointInput: function(e){
    this.setData({
      divePoint: e.detail.value
    })
  },

  maxMemberInput: function(e){
    this.setData({
      maxMember: e.detail.value
    })
  },

  descInput: function(e){
    this.setDate({
      description: e.detail.value
    })
  },

  btnSave:function(){
    wx.showLoading({
      title: 'Saving',
    })
    var that = this;
    var link = wx.getStorageSync('findbuddyCreateLinks')
    var token = wx.getStorageSync('access_token')
    var id = wx.getStorageSync('id')
    wx.request({
      url: link.href + "?access-token=" + token,
      data: Util.json2Form({
        type: this.data.type,        
        title: this.data.title,
        user_id: id,
        start_date: this.data.startDate,
        end_date: this.data.endDate,
        location_longitude: this.data.longitude,
        location_latitude: this.data.latitude,
        location_name: this.data.locationName,
        location_address: this.data.locationAddress,
        dive_point: this.data.divePoint,
        max_member: this.data.maxMember,
        accommodation: this.data.accommodationID,
        participants_count: this.data.participants,
        description: this.data.description
      })
      ,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      complete: function (res){
        console.log(res)
        if (res == null || res.statusCode != 201) {
          console.error(res.statusCode);
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title: 'save fail',
            icon: 'fail',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          return;
        }
        console.log(res)
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: 'save success',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
        var pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          //关键在这里
          prePage.onLoad()
        }
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.longitude)
    console.log(this.data.latitude)
  },
})

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}