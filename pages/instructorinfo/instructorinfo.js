var app = getApp()
Page({
    data: {
        userInfo: {}
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
    },
    onLaunch: function () {

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