Page({
    data: {
        date: '2016-09-01',
        time: '12:01',
    },
    bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
    },
    bindTimeChange: function(e) {
        this.setData({
        time: e.detail.value
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
            }
        })
    },
    onLoad: function(){
        
    }
});