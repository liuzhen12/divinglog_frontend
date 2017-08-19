// pages/mystore/mystore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    hasStore: false,
    links: '',
    meLinks:'',
    assets:'',
    avatar_url:'',
    city:'',
    coach_count:0,
    country:'',
    evaluation_count:0,
    evaluation_score:'',
    id:0,
    language_detail:'',
    location_address:'',
    location_latitude:'',
    location_longitude:'',
    location_name:'',
    name:'',
    province:'',
    telephone:'',
    wechat_id:'',
    locationlist: '',
    locationIndex: 0,
    locationName: '',
    Provincelist: '',
    ProvinceIndex: 0,
    ProvinceName: '',
    Citylist: '',
    CityIndex: 0,
    CityName: '',
    Storelist:'',
    StoreIndex:0,
    StoreName:'',
    storeinfo:[]
  },

  bindPickerCountryChange: function (e) {
    this.setData({
      locationIndex: e.detail.value,
      locationName: this.data.locationlist[e.detail.value].name,
      Provincelist: '',
      ProvinceIndex: 0
    })
    var that = this
    wx.request({
      url: this.data.links.location.href.replace("{", "").replace("}", "=") + this.data.locationlist[e.detail.value].id,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resProvince) {
        if (resProvince.data.length != 0) {
          that.setData({
            Provincelist: resProvince.data,
            ProvinceIndex: resProvince.data[0].id
          })
        }
      }
    })
  },

  bindPickerProvinceChange: function (e) {
    this.setData({
      ProvinceIndex: e.detail.value,
      ProvinceName: this.data.Provincelist[e.detail.value].name,
      Citylist: '',
      CityIndex: 0
    })
    var that = this
    wx.request({
      url: this.data.links.location.href.replace("{", "").replace("}", "=") + this.data.Provincelist[e.detail.value].id,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resCity) {
        if (resCity.data.length != 0) {
          that.setData({
            Citylist: resCity.data,
            CityIndex: resCity.data[0].id
          })
        }
      }
    })
  },

  bindPickerCityChange: function (e) {
    if (this.data.Citylist.length != 0) {
      this.setData({
        CityIndex: e.detail.value,
        CityName: this.data.Citylist[e.detail.value].name,
        Storelist:'',
        StoreIndex:0
      })
    }
    var that = this
    var params = { 'access-token': this.data.token, 'country': this.data.locationName, 'province': this.data.ProvinceName, 'city': this.data.Citylist[e.detail.value].name };
    wx.request({
      url: this.data.meLinks.location.href.replace("{?country,province,city}", ""),
      data: params,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resStore) {
        console.log(resStore)
        if (resStore.data.length != 0) {
          that.setData({
            Storelist: resStore.data,
            StoreIndex: resStore.data[0].id
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('access_token');
    var params = { 'access-token': token };
    var url = wx.getStorageSync('meLinks');
    var hasStore = wx.getStorageSync('hasStore');
    that.setData({
      hasStore: hasStore,
      meLinks: url,
      token: token
    })
    if (hasStore){
      wx.request({
        url: url.divestore.href,
        header: {
          'content-type': 'application/json'
        },
        data: params,
        method: "GET",
        complete: function (res) {
          if (res.statusCode == 200) {
            console.log(res)
            that.setData({
              assets: res.data.assets,
              avatar_url: res.data.avatar_url,
              city: res.data.city,
              coach_count: res.data.coach_count,
              country: res.data.country,
              evaluation_count: res.data.evaluation_count,
              evaluation_score: res.data.evaluation_score,
              id: res.data.id,
              language_detail: res.data.language_detail,
              location_address: res.data.location_address,
              location_latitude: res.data.location_latitude,
              location_longitude: res.data.location_longitude,
              location_name: res.data.location_name,
              name: res.data.name,
              province: res.data.province,
              telephone: res.data.telephone,
              wechat_id: res.data.wechat_id,
            })
          }
          else {
            console.log(res.data.message);
          }
        }
      })
    }
    else{
      var location = wx.getStorageSync('indexLinks')
      that.setData({
        links: location
      })
      wx.request({
        url: location.location.href.replace("{", "").replace("}", ""),
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (reslocation) {
          that.setData({
            locationlist: reslocation.data,
            locationIndex: reslocation.data[0].id
          })
        }
      })
    }
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