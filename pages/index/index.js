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
        subTitle:"潜水日志",
        ur:'../../pages/loglist/loglist'
      },
      {
        id:"airline",
        color:"#31A4FF",
        image:"../../images/buddy1.png",
        title:"约伴",
        subTitle:"约伴潜水",
        ur:'../../pages/findbuddy/findbuddy'
      },
      {
        id:"train",
        color:"#2FC4FD",
        image:"../../images/instructor1.png",
        title:"找教练",
        subTitle:"专业教练",
        ur:'../../pages/instructorsearch/instructorsearch'
      },
      {
        id:"bus",
        color:"#20D4E8",
        image:"../../images/store1.png",
        title:"找潜店",
        subTitle:"潜店信息",
        ur:'../../pages/storesearch/storesearch'
      }
    ]
  },

  onLoad: function () {
    wx.login({
      success: function (res) {
        if (res.code) {console.log(res.code);return;
          //发起网络请求
          wx.request({
            url: 'https://log.fundiving.com/login',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res)
              if (res.data.hasOwnProperty('id'))
              {
                wx.setStorageSync('id', res.data.id)
                wx.setStorageSync('access_token', res.data.access_token)
                wx.setStorageSync('indexLinks', res.data._links)
                wx.setStorageSync('role', res.data.role)
                console.log('true')
                console.log(res.data.access_token)
              }                
              else {
                wx.navigateTo({ url: '/pages/registerrole/registerrole'})
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




