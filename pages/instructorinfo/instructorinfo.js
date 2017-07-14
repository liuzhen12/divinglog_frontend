Page({
    data: {
        userInfo: []
    },
    //事件处理函数
    bindViewTap: function() {

    },
    onLoad: function (option) {
        var that = this;
        var token = wx.getStorageSync('access_token');
        // this.setData({
        //   'userInfo.url':option.url
        // });
        wx.request({
          url: option.url,
          header: {
            'content-type': 'application/json'
          },
          data: {
            'access-token': token
          },
          success: function (res) {
            if(res.statusCode == 200){
              console.log(res.data);
              that.setData({
                userInfo: res.data,
                // locationArray: res.data
              })
            }
            else{
              console.log(res.errMsg);
            }
          },
          fail: function (res) {
            console.log('failed to get user info')
          }
        })
    },
    onLaunch: function () {

    },
})