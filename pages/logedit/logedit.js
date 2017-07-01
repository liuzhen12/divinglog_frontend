var Util = require('../../utils/util.js')
Page({
    data: {
        access_token: '',
        id: '',
        date: '',
        starttime: '12:00',
        endtime: '12:00',
        switch1Checked: false,
        location: '',
        divepoint: '',
        depth1: '',
        tiem1: '',
        depth2: '',
        tiem2: '',
        depth3: '',
        tiem3: '',
        nitrox: '0',
        startbar: '',
        endbar: '',
        weight: '',
        comments: '',
        files: []
    },
    bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
    },
    bindStartTimeChange: function(e) {
        this.setData({
          starttime: e.detail.value
        })        
    },
    bindEndTimeChange: function (ex) {
      this.setData({
        endtime: ex.detail.value
      })
    },
    locationInput: function (e){
        this.data.location= e.detail.value
    },
    divePointInput: function (e){
        this.data.divepoint=e.detail.value
    },
    depthInput1: function (e) {
      this.data.depth = e.detail.value
    },
    tiemInput1: function (e){
        this.data.tiem = e.detail.value
    },
    depthInput2: function (e) {
      this.data.depth = e.detail.value
    },
    tiemInput2: function (e) {
      this.data.tiem = e.detail.value
    },
    depthInput3: function (e) {
      this.data.depth = e.detail.value
    },
    tiemInput3: function (e) {
      this.data.tiem = e.detail.value
    },
    switch1Change: function(e){
      this.setData({
        switch1Checked: e.detail.value
      })
    },
    nitroxInput: function (e){
        this.data.niturox = e.detail.value
    },
    startBarInput: function (e){
        this.data.startbar = e.detail.value
    },
    endBarInput: function (e){
        this.data.endbar = e.detail.value
    },
    weightInput: function (e){
        this.data.weight = e.detail.value
    },
    commentsInput: function (e){
        this.data.comments = e.detail.value
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                  files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },

    previewImage: function (e) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
      })
    },

    btnSave: function(){
      wx.showLoading({
        title: '提交中',
      })
      console.log(this.data.code);
      that = this;
      wx.request({
        url: "https://log.fundiving.com/diving-logs",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: Util.json2Form({
          access_token: this.data.access_token,
          user_id: this.data.id,
          day: this.data.date,
          time_in: this.data.starttime,
          time_out: this.data.endtime,
          location_longitude: "0.000000",
          location_latitue: "0.000000",
          location_name: this.data.location,
          location_address: "",
          depth1: this.data.depth1,
          time1: this.data.tiem1,
          depth2: this.data.depth2,
          time2: this.data.tiem2,
          depth3: this.data.depth3,
          time3: this.data.tiem3,
          gas: this.data.nitrox,
          barometer_start: this.data.startbar,
          barometer_end: this.data.endbar,
          weight: this.data,weight,
          comments: this.data.comments,
          assets: this.data.files,
          stamp: 0,
          divestore_id: 0,
          divestore_score: 0

        }),
        complete: function (res) {
          if (res == null || res.statusCode != 201) {
            console.error(res.statusCode);
            // that.setData({
            //   hiddenLoading: true,
            // }); 
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
            wx.showToast({
              title: '提交失败',
              icon: 'fail',
              duration: 2000
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
            return;
          }
          console.log(res)
          // that.setData({
          //   hiddenLoading: true,
          // }); 
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          // wx.setStorageSync('access_token', res.data.access_token)
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },

    onLoad: function (options){
      var that = this
      wx.getStorage({
        key: 'id',
        success: function (res1) {
          that.setData({
            id: res1.data,
            })
        }
      });
      wx.getStorage({
        key: 'access_token',
        success: function (res2) {
          that.setData({
            access_token: res2.data,
          });
        }
      });
      // that.setData({
      //   id: wx.getStorageSync('id')||null,
      //   access_token: wx.getStorageSync('access_token') || null
      // })
      this.setData({
        date: formatDate(new Date)
      })      
    }    
});

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}