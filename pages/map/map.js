// map.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scale:5,
    width:0,
    height:0,
    markers: [{
        iconPath: "../../images/map_marker_pink.png",
        id: 0,
        width: 25,
        height: 25,
        callout: {content:'choose',borderRadius:2,display:'BYCLICK'}
      }],
    showMarkers: false,
    longitude:0,
    latitude:0,
    northeast: null,
    southwest: null,
    triggerOnLoad: false,
    getNortheast: false,
    getSouthwest: false,
    getLongitude: false,
    getLatitude: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mapCtx = wx.createMapContext('myMap');
    var that = this;

    wx.getSystemInfo({
      success: function(res){
          that.setData({
            width: res.windowWidth,
            height: res.windowHeight,
            controls: [
              {
                id: 1,
                iconPath: '../../images/map_backcenter.jpg',
                position: {
                  left: 10,
                  top: res.windowHeight- 55,
                  width: 26,
                  height: 26
                },
                clickable: true
              },
              {
                id: 2,
                iconPath: '../../images/map_plus.jpg',
                position: {
                  left: res.windowWidth - 40,
                  top: res.windowHeight - 91,
                  width: 30,
                  height: 30
                },
                clickable: true
              },
              {
                id: 3,
                iconPath: '../../images/map_minus.jpg',
                position: {
                  left: res.windowWidth - 40,
                  top: res.windowHeight - 60,
                  width: 30,
                  height: 30
                },
                clickable: true
              }
            ]
          });
      }
    });


    if(null == options.longitude || null == options.latitude){
        // 获取当前定位
        wx.getLocation({
          success: function(res){
            that.setData({
              longitude: res.longitude,
              latitude: res.latitude
            });
          }
        });
      } else {
        this.setData({
              longitude: options.longitude,
              latitude: options.latitude
        });
      };

    if(null != options.showMarkers){
      this.setData({
        showMarkers: options.showMarkers
      });
    } 

    if(null != options.triggerOnLoad){
      this.setData({
        triggerOnLoad: options.triggerOnLoad
        });
    }

    if(null != options.getNortheast){
      this.setData({
        getNortheast: options.getNortheast
        });
    }

    if(null != options.getSouthwest){
      this.setData({
        getSouthwest: options.getSouthwest
        });
    }

    if(null != options.getLongitude){
      this.setData({
        getLongitude: options.getLongitude
        });
    }

    if(null != options.getLatitude){
      this.setData({
        getLatitude: options.getLatitude
        });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;

    // mark 在地图中央
    this.mapCtx.getCenterLocation({
        success: function(res){
          that.translateMarker(res.latitude,res.longitude);
        }
    }); 
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
  
  },

  controltap: function (e) {
     console.log(e.controlId);
     var that = this;
     switch(e.controlId){
       case 1: 
        this.mapCtx.moveToLocation();
        break;
       case 2:
        this.mapCtx.getScale({
          success: function(res){
            that.setData({
              scale:  res.scale + 1
            }); 
          }
        });
        break;
       case 3:
        this.mapCtx.getScale({
          success: function(res){
            that.setData({
              scale:  res.scale - 1
            }); 
          }
        });
        break;
     }
  },

  regionchange: function (e) {
    if(!this.data.showMarkers){
      return;
    }
    var that = this;
    this.mapCtx.getCenterLocation({
        success: function(res){
          that.translateMarker(res.latitude,res.longitude);
        }
    }); 
  },

  translateMarker: function(latitude,longitude) {
    var that = this;
    this.mapCtx.translateMarker({
            markerId: 0,
            // autoRotate: true,
            duration: 10,
            destination: {
              latitude: latitude,
              longitude: longitude
            }
    });
    this.mapCtx.getRegion({
      success: function(res){
        console.log(res.northeast);
        console.log(res.southwest);
        that.setData({
          northeast: res.northeast,
          southwest: res.southwest
        });
      }
    });
    this.setData({
      latitude: latitude,
      longitude: longitude
    });
  },

  markertap: function(e){
  },

  callouttap: function(e){
    var arr = getCurrentPages(); 
    var refererPage = arr[arr.length-2];console.log(this.data.triggerOnLoad);
    if(this.data.getNortheast) refererPage.data.northeast = this.data.northeast;
    if(this.data.getSouthwest) refererPage.data.southwest = this.data.southwest;
    if(this.data.getLongitude) refererPage.data.longitude = this.data.longitude;
    if(this.data.getLatitude) refererPage.data.latitude = this.data.latitude;
    if(this.data.triggerOnLoad) refererPage.onLoad();
    wx.navigateBack({
      delta:1,
      success: function(res){
      }
    });
  }
})