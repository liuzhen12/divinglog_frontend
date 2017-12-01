var Util = require('../../utils/util.js')
Page({
    data: {
        access_token: '',
        id: '',
        links: '',
        editStatus: '',
        equiptype: '',
        brand: '',
        model: ''
    },
    typeInput: function(e){
        this.setData({
          equiptype : e.detail.value
        })
    },
    brandInput: function(e){
        this.setData({
          brand: e.detail.value
        })
    },
    modelInput: function(e){
        this.setData({
          model: e.detail.value
        })
    },
    onLoad: function(options){
      var that = this;
      var token = wx.getStorageSync('access_token')
      var id = wx.getStorageSync('id')
      var status = wx.getStorageSync('equipStatus')
      that.setData({
        access_token: token,
        id: id,
        editStatus: status
      });
      if (status == 'Edit'){
        var links = wx.getStorageSync('equipLinks')
        that.setData({
          links: links
        });
        if (links != null || typeof (links) != 'undefined') {
          wx.request({
            url: links.self.href + "?access-token=" + token,
            data: {

            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (resList) {
              console.log(resList.data)
              if (resList.data != null) {
                that.setData({
                  equiptype: resList.data.type,
                  brand: resList.data.brand,
                  model: resList.data.model
                });
              }
              else {
                console.log('errer')
              }
            }
          })
        }
      }   
    },
    btnSave: function(){
      wx.showLoading({
        title: 'Saving',
      })
      if (this.data.editStatus == 'Edit'){
        wx.request({
          url: this.data.links.edit.href + "?access-token=" + this.data.access_token,
          data: Util.json2Form({
            brand: this.data.brand,
            type: this.data.equiptype,
            model: this.data.model,
            user_id: this.data.id
            })
          ,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "PUT",
          complete: function (res1) {
            if (res1 == null || res1.statusCode != 200) {
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
              title: 'save success',
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
      }
      else{
        var that = this;
        var melinks = wx.getStorageSync('meLinks')
        wx.request({
          url: melinks.equip.href + "?access-token=" + that.data.access_token,
          data: Util.json2Form({
            brand: that.data.brand,
            type: that.data.equiptype,
            model: that.data.model,
            user_id: that.data.id
          })
          ,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          complete: function (res2) {
            console.log(res2)
            if (res2 == null || res2.statusCode != 201) {
              console.error(res2.statusCode);
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
            console.log(res2)
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
            wx.showToast({
              title: 'save success',
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
      }
    },
    btnDelete: function(){
      wx.showLoading({
        title: 'Deleting',
      })
      wx.request({
        url: this.data.links.delete.href + "?access-token=" + this.data.access_token,
        data: Util.json2Form({
          brand: this.data.brand,
          type: this.data.equiptype,
          model: this.data.model,
          user_id: this.data.id
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
    }
});