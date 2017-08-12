//获取应用实例
var app = getApp()
Page({
    data: {
      source: function() {
        var that = this;
        wx.chooseImage({
          count: 1,
          //original原图，compressed压缩图
          sizeType: ['original','compressed'],
          //album来源相册 camera相机
          sourceType: ['album', 'camera'],
          //成功时会回调
          success: function(res) {
          //重绘视图
          that.setData({
          source: res.tempFilePaths,
          })
          }
        })
      }
    },
    yulan:function(){
      wx.previewImage({
        current: '../../images/index1.jpg', // 当前显示图片的链接，不填则默认为 urls 的第一张
        urls: [ 
          'wxfile://tmp_470875907o6zAJs-N87n5uNv_61TlxO6ZrlCcf5708bc28a068d2c14b790b6dbd7be74.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493207030398&di=472fb4992e05c5d5f403713aac8a5f60&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F25%2F18%2F67y58PICP9a_1024.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493207030398&di=322b0eec79959422c5e70372e6158828&imgtype=0&src=http%3A%2F%2Fimg01.taopic.com%2F160628%2F240410-16062PR24866.jpg'
        ],
        success: function(res){
        },
        fail: function() {
        // fail
        },
        complete: function() {
        // complete
        }
      })
    },
});