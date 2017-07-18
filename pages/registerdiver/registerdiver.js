// pages/registerdiver/registerdiver.js
var app = getApp()
var that;
var Util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    links: null,
    code: null,
    checkboxItems: [],
    checkedItem: true,
    locationlist:'',
    locationIndex: 0,
    locationName:'',
    Provincelist:'',
    ProvinceIndex: 0,
    ProvinceName:'',
    Citylist:'',
    CityIndex:0,
    CityName:'',
    langlist:''
  },

  bindPickerCountryChange: function (e) {
    this.setData({
      locationIndex: e.detail.value,
      locationName: this.data.locationlist[e.detail.value].name,
      Provincelist:'',
      ProvinceIndex:0
    })
    var that = this
    wx.request({
      url: this.data.links.location.href.replace("{", "").replace("}", "=") + this.data.locationlist[e.detail.value].id,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resProvince) {
        if (resProvince.data.length!=0)
        {
          that.setData({
            Provincelist: resProvince.data,
            ProvinceIndex: resProvince.data[0].id
          })
        }        
      }
    })
  },

  bindPickerProvinceChange: function (e){
    this.setData({
      ProvinceIndex: e.detail.value,
      ProvinceName: this.data.Provincelist[e.detail.value].name,
      Citylist:'',
      CityIndex:0
    })
    var that = this
    wx.request({
      url: this.data.links.location.href.replace("{", "").replace("}", "=") + this.data.Provincelist[e.detail.value].id,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resCity) {
        if (resCity.data.length!=0){
          that.setData({
            Citylist: resCity.data,
            CityIndex: resCity.data[0].id
          })
        }       
      }
    })
  },

  bindPickerCityChange:function (e){
    if (this.data.Citylist.length!=0){
      this.setData({
        CityIndex: e.detail.value,
        CityName: this.data.Citylist[e.detail.value].name
      })
    }    
  },

  checkboxChange: function (e) {
    var checkboxItems = this.data.checkboxItems, values = e.detail.value, checkStr = '', checkFirst=true;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    for (var a = 0; a<checkboxItems.length; a++)
    {
      if (checkboxItems[a].checked==true){
        if (checkFirst)
        {
          checkStr = checkboxItems[a].id;
          checkFirst=false;
        }
        else{
          checkStr = checkStr + ',' + checkboxItems[a].id;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems,
      langlist: checkStr
    });
  },

  listenerButton: function () {   
    wx.showLoading({
      title: 'Submiting',
    })
    if(this.data.langlist.length==0){
      wx.showToast({
        title: 'Please choose language!',
        icon: 'fail',
        duration: 3000
      })
      return;
    }
    if (this.data.locationName.length == 0) {
      wx.showToast({
        title: 'Please choose country!',
        icon: 'fail',
        duration: 3000
      })
      return;
    }

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
        city: this.data.CityName,
        province: this.data.ProvinceName,
        country: this.data.locationName,
        language: app.globalData.userInfo.language,
        language_detail: this.data.langlist,
        role: '1'
        }),      
      complete: function (res){
        if (res == null || res.statusCode != 201) {

          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title: 'Submit fail',
            icon: 'fail',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          return;
        }

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: 'Submit success',
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

    wx.getStorage({
      key: 'registerLinks',
      success: function(res) {
        that.setData({
          links: res.data
        })
        wx.request({
          url: res.data.language.href.replace("{","").replace("}",""),
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (reslang) {
            that.setData({
              checkboxItems: reslang.data,           
            })
            for (var i = 0; i < that.data.checkboxItems.length;i++)
            {
              that.data.checkboxItems[i]['checked']=false
            }
          }
        })

        wx.request({
          url: res.data.location.href.replace("{","").replace("}",""),
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
      },
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