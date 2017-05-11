Page({
    data: {
    array1:["PADI","SSI","STI","SDI"],
    array2:["OW","AOW","DM","DK"],
    index:0
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
    onLoad: function(){
        
    }
});