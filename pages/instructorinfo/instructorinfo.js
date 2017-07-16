Page({
    data: {
      userLinks: ['divestore','student'],
      userInfo: [],
      languageNames: [],
      divestore: [],
      student: []
    },
    //事件处理函数
    bindViewTap: function() {

    },
    onLoad: function (option) {
        var that = this;
        var token = wx.getStorageSync('access_token');
        var languageNames = wx.getStorageSync('languageNames');
        getData(option.url, token, function(userInfo){
          if (userInfo){
            that.setData({
              userInfo: userInfo,
              languageNames: languageNames
            })
            var divestoreLink = userInfo._links.divestore.href;
            var studentsLink = userInfo._links.student.href;
            getData(divestoreLink, token, function (storeInfo) {
              if (storeInfo) {
                that.setData({
                  divestore: storeInfo
                })
              }
            })
            getData(studentsLink, token, function (studentsInfo) {
              if (studentsInfo) {
                that.setData({
                  student: studentsInfo.items
                })
              }
            })
          }
        })
    },
    onLaunch: function () {

    },
})

function getData(url, accessToken, callback){
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json'
    },
    data: {
      'access-token': accessToken
    },
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