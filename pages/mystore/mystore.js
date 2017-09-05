// pages/mystore/mystore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    hasStore: false,
    links: '',
    meLinks: '',
    assets: '',
    avatar_url: '',
    city: '',
    coach_count: 0,
    country: '',
    evaluation_count: 0,
    evaluation_score: '',
    id: 0,
    language_detail: '',
    location_address: '',
    location_latitude: '',
    location_longitude: '',
    location_name: '',
    name: '',
    province: '',
    telephone: '',
    wechat_id: '',
    locationlist: '',
    locationIndex: 0,
    locationName: '',
    Provincelist: '',
    ProvinceIndex: 0,
    ProvinceName: '',
    Citylist: '',
    CityIndex: 0,
    CityName: '',
    Storelist: '',
    StoreIndex: 0,
    StoreName: '',
    storeinfo: [],
    storesArray: [],
    inputShowed: false,
    inputVal: "",
    initialStoreLink: "",
    storeLink: "",
    searchLoading: false,
    searchLoadingComplte: false,
    batchLoadingComplete: true,
    searchKeyword: "",
    filteredLocationArray: [],
    scrollTop: 0
  },

  showInput: function () {
    var that = this;
    var locationUrl = that.data.links['divestores-location'].href;
    var params = { 'access-token': that.data.token };
    getData(locationUrl, params, function (data) {
      wx.setStorageSync('locationArray', data.items);
      that.setData({
        inputShowed: true,
      })
    })
  },
  hideInput: function () {
    this.setData({
      searchKeyword: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      searchKeyword: ""
    });
  },
  inputTyping: function (e) {
    var keyWord = e.detail.value;
    var locationArray = wx.getStorageSync('locationArray');
    var ret = [];
    var reg = new RegExp(keyWord, "i");
    for (var i = 0; i < locationArray.length; i++) {
      if (locationArray[i]['name'].match(reg)) {
        ret.push(locationArray[i]);
      }
      if (ret.length > 4) {
        break;
      }
    }
    this.setData({
      searchKeyword: keyWord,
      filteredLocationArray: ret
    });
  },
  clearFilteredLocation: function (e) {
    this.setData({
      filteredLocationArray: []
    });
  },
  fetchSearchList: function (refresh = true) {
    let that = this,
      keyword = that.data.searchKeyword;
    var keywordArray = keyword.split(',').reverse();
    var params = {
      'access-token': that.data.token,
      'country': keywordArray[0],
      'province': keywordArray.length > 1 ? keywordArray[1] : '',
      'city': keywordArray.length > 2 ? keywordArray[2] : '',
    };

    getData(that.data.storeLink, params, function (store_data) {
      var storesArray = refresh ? store_data.items : that.data.storesArray.concat(store_data.items);
      var url = store_data._links.next ? store_data._links.next.href : that.data.initialStoreLink;
      that.setData({
        storesArray: storesArray,
        storeLink: url,
        searchLoading: store_data._links.next ? true : false,
        searchLoadingComplete: store_data._links.next ? false : true,
        batchLoadingComplete: true
      })
    })
  },
  searchScrollLower: function () {
    if (this.data.batchLoadingComplete && this.data.searchLoading && !this.data.searchLoadingComplete) {
      this.setData({
        batchLoadingComplete: false
      });
      this.fetchSearchList(false);
    }
  },

  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  searchClick: function (event) {
    var keyword = event.currentTarget.dataset.keyword;
    this.setData({
      usersArray: [],
      searchLoading: true,
      SearchLoadingComplete: false,
      searchKeyword: keyword
    })
    this.fetchSearchList();
    this.goTop();
  },
  openConfirm: function (e) {
    var that = this;
    var storeid = e.currentTarget.dataset.storeid;
    wx.showModal({
      title: 'Link store',
      content: 'Are you sure to link to this store?',
      confirmText: "Yes",
      cancelText: "No",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: that.data.meLinks.self.href + '?access-token=' + that.data.token,
            header: {
              'content-type': 'application/json'
            },
            data: {
              'divestore_id': storeid
            },
            method: 'PUT',
            complete: function (res) {
              if (res.statusCode == 200) {
                wx.switchTab({
                  url: '../meinfo/meinfo',
                  success: function (e) {
                    //reload user data
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                })
              }
              else {
                console.log(res.data.message);
              }
            }
          })
        }
      }
    });
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
    if (hasStore) {
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
    else {
      var indexLinks = wx.getStorageSync('indexLinks')
      wx.getSystemInfo({
        success: function (res) {
          //设置高度，根据当前设备宽高满屏显示
          that.setData({
            view: {
              Height: res.windowHeight
            }
          })
        }
      })
      var params = { 'access-token': token };
      that.setData({
        links: indexLinks,
        initialStoreLink: indexLinks.divestores.href,
        storeLink: indexLinks.divestores.href
      })
      that.fetchSearchList();
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

function getData(url, params, callback) {
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json'
    },
    data: params,
    complete: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
      else {
        console.log(res.data.message);
        callback();
      }
    }
  })
}