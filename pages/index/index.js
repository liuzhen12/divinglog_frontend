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

  },
  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      path: 'pages/index/index'
    }
  }
})




