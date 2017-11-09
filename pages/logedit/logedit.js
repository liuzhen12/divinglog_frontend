var Util = require('../../utils/util.js')
Page({
    data: {
        stampLinks: '',
        loglinks:'',
        access_token: '',
        id: '',
        userId:'',
        coachId:'',
        logEditStatus: '',
        date: '',
        starttime: '12:00',
        endtime: '12:00',
        switch1Checked: false,
        location: '',
        divepoint: '',
        depth1: '0',
        tiem1: '0',
        depth2: '0',
        tiem2: '0',
        depth3: '0',
        tiem3: '0',
        gas: '0',
        nitrox: '0',
        startbar: '0',
        endbar: '0',
        weight: '0',
        divestoreNo: '0',
        comments: '',
        files: [],
        filesPath:''
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
      this.setData({
        location: e.detail.value
      })
    },
    divePointInput: function (e){
      this.setData({
        divepoint: e.detail.value
      })
    },
    depthInput1: function (e) {
      this.setData({
        depth1: e.detail.value
      })
    },
    tiemInput1: function (e){
      this.setData({
        tiem1: e.detail.value
      })
    },
    depthInput2: function (e) {
      this.setData({
        depth2: e.detail.value
      })
    },
    tiemInput2: function (e) {
      this.setData({
        tiem2: e.detail.value
      })
    },
    depthInput3: function (e) {
      this.setData({
        depth3: e.detail.value
      })
    },
    tiemInput3: function (e) {
      this.setData({
        tiem3: e.detail.value
      })
    },
    switch1Change: function(e){
      this.setData({
        switch1Checked: e.detail.value
      })
    },
    nitroxInput: function (e){
      this.setData({
        niturox: e.detail.value
      })
    },
    startBarInput: function (e){
      this.setData({
        startbar: e.detail.value
      })
    },
    endBarInput: function (e){
      this.setData({
        endbar: e.detail.value
      })
    },
    weightInput: function (e){
      this.setData({
        weight: e.detail.value
      })
    },
    divestoreNoInput:function(e){
      this.setData({
        divestoreNo: e.detail.value
      })
    },
    commentsInput: function (e){
      this.setData({
        comments: e.detail.value
      })
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

                var filePaths = res.tempFilePaths
                var uploadlink = wx.getStorageSync('loguploadLinks')
                
                console.log(filePaths.length)
                for (var i = 0; i < filePaths.length; i++) {
                  wx.uploadFile({
                    url: uploadlink.href, //仅为示例，非真实的接口地址  
                    filePath: filePaths[i],
                    name: 'UploadModel[files]',
                    formData:{  
                      thumbWidth: 100,
                      thumbHeight: 100
                    },  
                    success: function (res) {
                      console.log(res.data)
                      var path = JSON.parse(res.data)
                      var uploadPath = ''
                      uploadPath = path.filePath.toString() + ','
                      that.setData({
                        filesPath: that.data.filesPath + uploadPath
                      })
                      console.log(that.data.filesPath)
                    }
                  });
                }               
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
      var that = this;
      var status = wx.getStorageSync('logEditStatus')
      if (status=='Add'){
        
        var filepaths = ''
        if (this.data.filesPath.length > 0) {
          filepaths = this.data.filesPath.substr(0, this.data.filesPath.length - 1);
        }
        console.log(filepaths)
        var addlink = wx.getStorageSync('logaddLinks')
        wx.request({
          url: addlink.href + "?access-token=" + this.data.access_token,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          data: Util.json2Form({
            user_id: this.data.userId,
            day: this.data.date,
            time_in: this.data.starttime,
            time_out: this.data.endtime,
            location_longitude: "0.000000",
            location_latitue: "0.000000",
            location_name: this.data.location,
            location_address: "",
            dive_point: this.data.divepoint,
            depth1: this.data.depth1,
            time1: this.data.tiem1,
            depth2: this.data.depth2,
            time2: this.data.tiem2,
            depth3: this.data.depth3,
            time3: this.data.tiem3,
            gas: this.data.nitrox,
            barometer_start: this.data.startbar,
            barometer_end: this.data.endbar,
            weight: this.data.weight,
            comments: this.data.comments,
            assets: filepaths,
            stamp: 0,
            divestore_id: 0,
            divestore_score: 0
          }),
          complete: function (res) {
            if (res == null || res.statusCode != 201) {
              console.error(res.statusCode);
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
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
      else if (status == 'Edit'){
        var loglistlinks = wx.getStorageSync('loglistLinks')
        wx.request({
          url: loglistlinks.edit.href + "?access-token=" + this.data.access_token,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "PUT",
          data: Util.json2Form({
            day: this.data.date,
            time_in: this.data.starttime,
            time_out: this.data.endtime,
            location_longitude: "0.000000",
            location_latitue: "0.000000",
            location_name: this.data.location,
            location_address: "",
            dive_point: this.data.divepoint,
            depth1: this.data.depth1,
            time1: this.data.tiem1,
            depth2: this.data.depth2,
            time2: this.data.tiem2,
            depth3: this.data.depth3,
            time3: this.data.tiem3,
            gas: this.data.nitrox,
            barometer_start: this.data.startbar,
            barometer_end: this.data.endbar,
            weight: this.data.weight,
            comments: this.data.comments,
            assets: this.data.files,
          }),
          complete: function (res) {
            if (res == null || res.statusCode != 200) {
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
      }
    },

    btnDelete: function(){
      wx.showLoading({
        title: 'Deleting',
      })
      var loglistlinks = wx.getStorageSync('loglistLinks')
      wx.request({
        url: loglistlinks.delete.href + "?access-token=" + this.data.access_token,
        data: Util.json2Form({
          
        })
        ,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "DELETE",
        complete: function (res1) {
          if (res1 == null || res1.statusCode != 204) {
            console.error(res1.statusCode);
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
            wx.showToast({
              title: 'save fail',
              icon: 'fail',
              duration: 2000
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
            return;
          }
          console.log(res1)
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title: 'Delete Success',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          var pages = getCurrentPages();
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.onLoad()
          }
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },

    btnStamp:function(){
      wx.showLoading({
        title: '提交中',
      })
      var that = this;
      var token = wx.getStorageSync('access_token')
      wx.request({
        url: this.data.stampLinks.edit.href + "?access-token=" + token,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT",
        data: Util.json2Form({
          day: this.data.date,
          time_in: this.data.starttime,
          time_out: this.data.endtime,
          location_longitude: "0.000000",
          location_latitue: "0.000000",
          location_name: this.data.location,
          location_address: "",
          dive_point: this.data.divepoint,
          depth1: this.data.depth1,
          time1: this.data.tiem1,
          depth2: this.data.depth2,
          time2: this.data.tiem2,
          depth3: this.data.depth3,
          time3: this.data.tiem3,
          gas: this.data.nitrox,
          barometer_start: this.data.startbar,
          barometer_end: this.data.endbar,
          weight: this.data.weight,
          comments: this.data.comments
        }),
        complete: function (res) {
          if (res == null || res.statusCode != 200) {
            console.error(res.statusCode);
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
        }
      })
      var certificationlink = wx.getStorageSync('url')
      console.log(this.data.id)
      wx.request({
        url: certificationlink + "certifications?access-token=" + token,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: Util.json2Form({
          log_id: this.data.id,
          user_id: this.data.userId,
          coach_id: this.data.coachId
        }),
        complete: function (res) {
          if (res == null || res.statusCode != 201) {
            console.error(res.statusCode);
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
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },

    onShareAppMessage: function () {
      return {
        title: 'Stamp',
        path: '/pages/logedit?status=Stamp&selflink=' + this.data.loglinks.self.href,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    },

    onLoad: function (options){
      var that = this
      wx.getSystemInfo({
        success: function (res) {
          //设置宽度，根据当前设备宽高满屏显示
          that.setData({
            view: {
              Width: res.windowWidth - 25
            }
          })
        }
      })
      if (options.status == 'Stamp'){
        console.log(options)
        var token = wx.getStorageSync('access_token')
        var id = wx.getStorageSync('id')
        var selflink = options.selflink
        that.setData({
          logEditStatus: options.status,
          access_token: token,
          coachId: id,
        });
        wx.request({
          url: selflink + "?access-token=" + token,
          data: {

          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (resArray) {
            console.log(resArray)            
            if (resArray.data != null) {
              if (resArray.data.gas > 0) {
                that.setData({
                  switch1Checked: true,
                  nitrox: resArray.data.gas
                })
              }
              else {
                that.setData({
                  switch1Checked: false,
                  nitrox: '0'
                })
              }
              that.setData({
                stampLinks: resArray.data._links,
                id: resArray.data.id,
                userId: resArray.data.user_id,
                date: resArray.data.day,
                starttime: resArray.data.time_in,
                endtime: resArray.data.time_out,
                location: resArray.data.location_name,
                divepoint: resArray.data.dive_point,
                depth1: resArray.data.depth1,
                tiem1: resArray.data.time1,
                depth2: resArray.data.depth2,
                tiem2: resArray.data.time2,
                depth3: resArray.data.depth3,
                tiem3: resArray.data.time3,
                startbar: resArray.data.barometer_start,
                endbar: resArray.data.barometer_end,
                weight: resArray.data.weight,
                comments: resArray.data.comments
              })
              return
            }
            else {
              console.log('errer')
              return
            }
          }
        })
      }
      else{
        var id = wx.getStorageSync('id')
        var token = wx.getStorageSync('access_token')
        var status = wx.getStorageSync('logEditStatus')
        var links = wx.getStorageSync('loglistLinks')
        that.setData({
          access_token: token,
          userId: id,
          logEditStatus: status,
          loglinks: links,
          nitrox: '0'
        });
        this.setData({
          date: formatDate(new Date)
        })
        if (status == 'Edit') {          
          wx.request({
            url: links.self.href + "?access-token=" + token,
            data: {

            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (resArray) {
              console.log(resArray.data)
              if (resArray.data.gas > 0) {
                that.setData({
                  switch1Checked: true,
                  nitrox: resArray.data.gas
                })
              }
              else {
                that.setData({
                  switch1Checked: false,
                  nitrox: '0'
                })
              }
              that.setData({
                date: resArray.data.day,
                starttime: resArray.data.time_in,
                endtime: resArray.data.time_out,
                location: resArray.data.location_name,
                divepoint: resArray.data.dive_point,
                depth1: resArray.data.depth1,
                time1: resArray.data.tiem1,
                depth2: resArray.data.depth2,
                time2: resArray.data.tiem2,
                depth3: resArray.data.depth3,
                time3: resArray.data.tiem3,
                startbar: resArray.data.barometer_start,
                endbar: resArray.data.barometer_end,
                weight: resArray.data.weight,
                comments: resArray.data.comments
              })
            }
          })
        }  
      }   
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