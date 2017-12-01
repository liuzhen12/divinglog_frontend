//app.js
App({
    onLaunch: function () {
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://divinglog.cn/login',
              data: {
                code: res.code
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                if (res.data.hasOwnProperty('id')) {
                  wx.setStorageSync('id', res.data.id)
                  wx.setStorageSync('role', res.data.role)
                  wx.setStorageSync('access_token', res.data.access_token)
                  wx.setStorageSync('indexLinks', res.data._links)
                }
                else {
                  wx.setStorageSync('registerStatus', false)
                  wx.setStorage({
                    key: 'registerLinks',
                    data: res.data._links,
                  })
                  wx.navigateTo({ url: '/pages/registerrole/registerrole' })
                }
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    },
    getUserInfo:function(cb){
        var that = this
        if(this.globalData.userInfo){
        typeof cb == "function" && cb(this.globalData.userInfo)
        }else{
        //调用登录接口
        wx.login({
            success: function () {
            wx.getUserInfo({
                success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
            }
        })
        }
    },
    globalData:{
        userInfo:null
    }
})