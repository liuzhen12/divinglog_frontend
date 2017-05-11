var app = getApp()  
  
var dateUtils = require("../../utils/dateUtils.js")  
  
Page({  
    data : {  
        dateTitles : [  
            "一", "二", "三", "四", "五", "六", "日"  
        ],  
        windowWidth : 0,  
        windowHeight : 0,  
        titleCellWidth : 0,  
        titleCellHeight : 60, // rpx  
        dateCellWidth : 0,  
        dateCellHeight : 120, // rpx  
        monthDatas: [],  
        swiperHeight :0,  
        noclass_icon : "../../img/noclass_icon.png",  
    },  
    onLoad: function(){  
        var that = this  
        wx.getSystemInfo({  
          success: function(res) {  
            that.setData({  
                windowWidth : res.windowWidth,  
                windowHeight : res.windowHeight,  
                titleCellWidth : res.windowWidth/7 -1.1,  
                dateCellWidth : res.windowWidth/7 -1.1  
            })  
          }  
        })  
  
        var tmp = getInitDate()  
        that.setData({  
            monthDatas : tmp,  
            swiperHeight : tmp[0].dataHarr.length * 122  
        })  
    },  
    swiperChange: function(e){  
        var page = e.detail.current  
        this.setData({  
            swiperHeight : this.data.monthDatas[page].dataHarr.length * 122  
        })  
    }  
})  
  
function getInitDate(){  
    var arr = []  
    var offset = 0 // 测试用  
    arr.push(getDataObj(dateUtils.initThisMonthDates(offset)))  
    arr.push(getDataObj(dateUtils.initNextMonthDates(offset)))  
    return arr  
}  
  
function getDataObj(arr){  
    var obj = {  
        data: arr,  
        dataHarr:dateUtils.initRowList(arr.length/7)  
    }  
    return obj  
}