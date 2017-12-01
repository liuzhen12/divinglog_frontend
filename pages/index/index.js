//index.js
//获取应用实例
var app = getApp()
Page({
  //初始化数据
  data: {
    arr:[
      {
        id:"hotel",
        color:"#FF5F72",
        image:"../../images/logs1.png",
        title:"Logs",
        subTitle:"Scuba Dive/Free Dive",
        ur:'../../pages/loglist/loglist'
      },
      {
        id:"airline",
        color:"#31A4FF",
        image:"../../images/buddy1.png",
        title:"Activity",
        subTitle:"Find Buddy/Join Activity",
        ur:'../../pages/findbuddy/findbuddy'
      },
      {
        id:"train",
        color:"#2FC4FD",
        image:"../../images/instructor1.png",
        title:"Instrutor",
        subTitle:"Find Instrutor/Consulting Course",
        ur:'../../pages/instructorsearch/instructorsearch'
      },
      {
        id:"bus",
        color:"#20D4E8",
        image:"../../images/store1.png",
        title:"Dive Store",
        subTitle:"Find Dive Stroe",
        ur:'../../pages/storesearch/storesearch'
      }
    ]
  },

  onShow: function () {
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
              console.log(res)
              wx.setStorageSync('url', 'https://divinglog.cn/')
              if (res.data.hasOwnProperty('id'))
              {
                wx.setStorageSync('id', res.data.id)
                wx.setStorageSync('role', res.data.role)
                wx.setStorageSync('access_token', res.data.access_token)
                wx.setStorageSync('indexLinks', res.data._links)
              }                
              else {
                var register = wx.getStorageSync('registerStatus')
                if (register == true){
                  wx.setStorageSync('registerLinks', res.data._links)
                  wx.navigateTo({ url: '/pages/registerrole/registerrole' })
                }
                else{
                  wx.setStorageSync('registerStatus', true)
                }
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      path: 'pages/index/index'
    }
  }
})




