var dateUtils = require("../../utils/dateUtils.js");

Page({
    data: {
        inputShowed: false,
        inputVal: "",
        start_date: "",
        end_date: "",
        array: [],
        content_height:"",
    },
    onLoad: function (options) {
      var that = this;
      //处理内容区域高度
      wx.getSystemInfo({
            success: function (res) {
              console.log(res);
              // 计算主体部分高度,单位为px
              that.setData({
                content_height: (res.windowHeight - 38 - 40)+"px"
              });
            }
      });
      //获取当前日期
      var nowDate = new Date();

      this.setData({
          start_date: dateUtils.formatDate(nowDate),
          end_date: dateUtils.formatDate(dateUtils.addDays(nowDate,7))
      });
      
      this.setData({
          start_date_short: this.data.start_date.substring(5),
          end_date_short: this.data.start_date.substring(5)
      });

      wx.getStorage({
        key: 'access_token',
        success: function (res) {
          that.setData({
            access_token: res.data,
          });
          wx.getStorage({
            key: 'indexLinks',
            success: function (resLinks){
              console.log(resLinks.data)
              wx.request({
                url: resLinks.data.activity.href + '?access-token=' + res.data,
                data: {

                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (resArray) {
                  for(var i = 0; i < resArray.data.items.length; i++){
                      var d = new Date(resArray.data.items[i].start_date);
                      resArray.data.items[i].timeline_month = dateUtils.getMonthsInEn(d.getMonth());
                      resArray.data.items[i].timeline_day = d.getDate();
                  }
                  that.setData({
                    array: resArray.data.items
                  })
                }
              })
            }
          })
          
        }
      });
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    selectLocation: function(e) {
        wx.navigateTo({
          url: '../map/map?longitude=20&latitude=20',
          success: function(res){
            // success
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        })
    },
    selectBeginDate: function(e) {
        wx.navigateTo({
          url: '../calendar/calendar',
          success: function(res){
            // success
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        })
    },
    selectEndDate: function(e) {
        wx.navigateTo({
          url: '../calendar/calendar',
          success: function(res){
            // success
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        })
    },

    startDatePickerBindchange: function(e) {
        this.setData({
          start_date: e.detail.value,
          start_date_short: e.detail.value.substring(5)
        })
    }, 

    endDatePickerBindchange: function(e) {
        this.setData({
          end_date: e.detail.value,
          end_date_short: e.detail.value.substring(5)
        })
    },

    findbuddyEdit: function(e){
        console.log(e);
    },
  
});