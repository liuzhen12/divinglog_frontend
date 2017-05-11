Page({
    data: {
        date: '2016-09-01',
    },
    bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
    },
    onLoad: function(){
        
    }
});