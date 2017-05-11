Page({
  data: {
    
  },
  chooseicon:function(e){
    
  var strnumber=e.target.dataset.id;
   var _obj={};
    _obj.curHdIndex=strnumber;
    this.setData({
     tabArr: _obj
    });    
 },
});