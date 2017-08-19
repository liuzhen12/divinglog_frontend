//logs.js
var app = getApp()
Page({
    data: {
        array:[{
      image:"logs2.png",
      title:"我的日志",
      url: "../myloglist/myloglist"
    },{
      image:"equipment1.png",
      title:"我的装备",
      url: "../equipment/equipment"
    }, {
      image:"level1.png",
      title:"等级专长",
      url: "../melevel/melevel"
    }, {
      image:"feedback1.png",
      title:"意见反馈",
      url: ""
    }, {
      image:"info.png",
      title:"当前版本",
      url: ""
    }, {
      image:"service1.png",
      title:"联系客服",
      url: ""
    }
    ],
        userInfo: {},
        role: '',
    },
    //事件处理函数
    bindViewTap: function() {

    },
    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
            userInfo:userInfo
        })
        })
        wx.getStorage({
          key: 'indexLinks',
          success: function(resLinks) {
            console.log(resLinks)
            wx.getStorage({
              key: 'access_token',
              success: function(resToken) {
                console.log(resToken.data)
                wx.getStorage({
                  key: 'role',
                  success: function (resrole) {
                    that.setData({
                      role: resrole.data
                    })
                    wx.request({
                      url: resLinks.data.me.href + "?access-token=" + resToken.data,
                      data: {
                        
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      method: "GET",
                      success: function (res) {
                        console.log(res)
                        wx.setStorage({
                          key: 'meLinks',
                          data: res.data._links,
                        })
                        wx.setStorage({
                          key:'hasStore',
                          data: res.data.hasDiveStore
                        })
                      }
                    })
                  },
                })
              },
            })
            
          },
        })
        
    },
    onLaunch: function () {

    },
    // getUserInfo:function(cb){
    //     var that = this
    //     if(this.globalData.userInfo){
    //     typeof cb == "function" && cb(this.globalData.userInfo)
    //     }else{
    //     //调用登录接口
    //     wx.login({
    //         success: function () {
    //         wx.getUserInfo({
    //             success: function (res) {
    //             that.globalData.userInfo = res.userInfo
    //             typeof cb == "function" && cb(that.globalData.userInfo)
    //             }
    //         })
    //         }
    //     })
    //     }
    // },
    // globalData:{
    //     userInfo:null
    // }
})