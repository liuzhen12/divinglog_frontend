Page({
  data: {
    storesArray: [],
    inputShowed: false,
    inputVal: "",
    initialStoreLink: "",
    storeLink: "",
    isFromSearch: true,
    searchLoading: false,
    searchLoadingComplte: false,
    languageArray: [],
    actionSheetHidden: true,
    sortBy: 0,
    actionSheetItems: [
      { 'id': '1', 'name': 'Rate ' },
      { 'id': '2', 'name': 'Instructor amount ' }],
    searchKeyword: "",
    inputShowed: false,
    filteredLocationArray: [],
  },
  showInput: function () {
    var that = this;
    var token = wx.getStorageSync('access_token');
    var indexLinks = wx.getStorageSync('indexLinks');
    var locationUrl = indexLinks['divestores-location'].href;
    var params = { 'access-token': token };
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
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        that.setData({
          view: {
            Height: res.windowHeight
          }
        })
      }
    })
    var token = wx.getStorageSync('access_token');
    var indexLinks = wx.getStorageSync('indexLinks');
    var params = { 'access-token': token };
    getData(indexLinks.language.href, params, function (data) {
      that.setData({
        languageArray: data,
        initialStoreLink: indexLinks.divestores.href,
        storeLink: indexLinks.divestores.href
      })
      that.fetchSearchList();
    })
  },

  fetchSearchList: function (refresh=true) {
    let that = this,
      keyword = that.data.searchKeyword,
      token = wx.getStorageSync('access_token'),
      languageArray = this.data.languageArray,
      selectedLanguage = [];
    //get selected language
    for (var i = 0; i < languageArray.length; i++) {
      if (languageArray[i]['isSelected']) {
        selectedLanguage.push(languageArray[i]['id']);
      }
    }
    var selectedLanguageStr = selectedLanguage.join(',');
    var keywordArray = keyword.split(',').reverse();
    var params = {
      'access-token': token,
      'country': keywordArray[0],
      'province': keywordArray.length > 1 ? keywordArray[1] : '',
      'city': keywordArray.length > 2 ? keywordArray[2] : '',
      'language': selectedLanguageStr,
      'evaluation_score': that.data.sortBy == 1 ? 2 : '',
      'coach_count': that.data.sortBy == 2 ? 2 : ''
    };

    getData(that.data.storeLink, params, function (store_data) {
      if (store_data.items.length != 0) {
        var storesArray = that.data.isFromSearch || refresh ? store_data.items : that.data.storesArray.concat(store_data.items);
        var url = store_data._links.next ? store_data._links.next.href : that.data.initialStoreLink;
        that.setData({
          storesArray: storesArray,
          storeLink: url,
          searchLoading: store_data._links.next ? true : false,
          searchLoadingComplete: store_data._links.next ? false : true,
        })
      }
    })

  },
  listClick: function (event) {
    var url = event.currentTarget.dataset.url;
    console.log(url);
    wx.navigateTo({
      url: "../storeinfo/storeinfo?url=" + url
    })
  },
  searchClick: function (event) {
    var keyword = event.currentTarget.dataset.keyword;
    this.setData({
      usersArray: [],
      isFromSearch: true,
      searchLoading: true,
      SearchLoadingComplete: false,
      searchKeyword: keyword
    })
    this.fetchSearchList();
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
      })
    }.bind(this), 200)
  },

  showFilter: function () {
    this.setData({
      showModalStatus: true
    })
  },

  changeColor: function (e) {
    var languageArray = this.data.languageArray;
    for (var i = 0; i < languageArray.length; i++) {
      if (e.target.id == languageArray[i]['id']) {
        languageArray[i]['isSelected'] = !languageArray[i]['isSelected'];
      }
    }
    this.setData({
      languageArray: languageArray
    })
  },
  filterConfirm: function (e) {
    this.fetchSearchList();
    this.hideModal();
  },

  showSort: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  sortConfirm: function (e) {
    var sortIdx = e.currentTarget.id;
    this.setData({
      sortBy: e.currentTarget.id,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    this.fetchSearchList();
  },

  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false 
      });
      that.fetchSearchList(false);
    }
  }
});


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