Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeLink: '',
    storesArray: [],
    inputShowed: false,
    searchKeyword: "",
    imagePlaceholder: '../../images/image_placeholder.png'
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
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  fetchSearchList: function () {
    var that = this;
    var params = {
      'access-token': that.data.token,
      'no': that.data.searchKeyword
    };

    getData(that.data.storeLink, params, function (store_data) {
      var storesArray = store_data.items;
      that.setData({
        storesArray: storesArray.length > 1 ? [storesArray.shift()] : storesArray //only return 1
      })
    })
  },

  openConfirm: function (e) {
    var that = this;
    var storeid = e.currentTarget.dataset.storeid;
    wx.showModal({
      title: 'Choose store',
      content: 'Are you sure to choose this store?',
      confirmText: "Yes",
      cancelText: "No",
      success: function (res) {
        if (res.confirm) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            divestoreId: storeid
          })
          wx.navigateBack();
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storeLink: options.url,
      token: wx.getStorageSync('access_token')
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