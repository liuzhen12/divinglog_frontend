Page({
  data: {
    storeInfo: [],
    instructors: [],
    language: ''
  },
  onLoad: function (option) {
    var that = this;
    var token = wx.getStorageSync('access_token');
    var languageNames = wx.getStorageSync('languageNames');
    var params = { 'access-token': token };
    getData(option.url, params, function (storeInfo) {
      if (storeInfo) {
        console.log(storeInfo)
        var language_arr = storeInfo.language_detail.split(',');
        for(var i=0; i<language_arr.length;i++){
          language_arr[i] = languageNames[language_arr[i]];
        }
        that.setData({
          storeInfo: storeInfo,
          languageNames: languageNames,
          language: language_arr.toString()
        })
        getData(storeInfo._links.coach.href, params, function (instructors) {
          if (instructors) {
            that.setData({
              instructors: instructors
            })
          }
        })

      }
    })
  },
  showMap: function () {
    wx.navigateTo({
      url: "../storemap/storemap?longitude=" + this.data.storeInfo.location_longitude + "&latitude=" + this.data.storeInfo.location_latitude
    })
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