var dateUtils = require("../../utils/dateUtils.js");

Page({
    data: {
        inputShowed: false,
        inputVal: "",
        start_date: "",
        end_date: "",
        array: [],
        content_height:"",
        northeast: {
          latitude:null,
          longitude:null
        },
        southwest: {
          latitude:null,
          longitude:null
        }
    },
    onShow: function(){
        console.log(this.data.northeast);
        console.log(this.data.southwest);
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
      let nowDate = new Date();

      this.setData({
          start_date: dateUtils.formatDate(nowDate),
          end_date: dateUtils.formatDate(dateUtils.addDays(nowDate,7))
      });

      this.setData({
        start_date_short: this.data.start_date.substring(5),
        end_date_short: this.data.end_date.substring(5)
      });

      this.getActivityList();
    },

    selectLocation: function(e) {
        wx.navigateTo({
          url: '../map/map?showMarkers=true&getNortheast=true&getSouthwest=true&triggerOnLoad=true',
          success: function(res){
            console.log(res);
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        });
    },

    startDatePickerBindchange: function(e) {
        this.setData({
          start_date: e.detail.value,
          start_date_short: e.detail.value.substring(5)
        });
        this.getActivityList();
    }, 

    endDatePickerBindchange: function(e) {
        this.setData({
          end_date: e.detail.value,
          end_date_short: e.detail.value.substring(5)
        });
        this.getActivityList();
    },

    findbuddyEdit: function(e){
        console.log(e);
    },

    getActivityList: function(){
      let that = this;
      wx.getStorage({
        key: 'access_token',
        success: function (res) {
          that.setData({
            access_token: res.data,
          });
          wx.getStorage({
            key: 'indexLinks',
            success: function (resLinks){
              let reqData = {
                start_date: that.data.start_date,
                end_date: that.data.end_date
              };
              if(null != that.data.northeast.longitude){
                reqData.northeast_longitude = that.data.northeast.longitude;
              }
              if(null != that.data.northeast.latitude){
                reqData.northeast_latitude = that.data.northeast.latitude;
              }
              if(null != that.data.southwest.longitude){
                reqData.southwest_longitude = that.data.southwest.longitude;
              }
              if(null != that.data.southwest.latitude){
                reqData.southwest_latitude = that.data.southwest.latitude;
              }console.log(reqData);
              wx.request({
                url: resLinks.data.activity.href + '?access-token=' + res.data,
                data: reqData,
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (resArray) {
                  for(let i = 0; i < resArray.data.items.length; i++){
                      let d = new Date(resArray.data.items[i].start_date);
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
    }
  
});