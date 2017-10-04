const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    size:10,
    total:-1,
    showNoResult:false,
    param:{},
    movies:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page;
    this.setData({
      page:++page
    });
    this.getPageData();
  },
  getPageData:function(){
    var that=this,
        page = this.data.page,
        size = this.data.size,
        total = this.data.total,
        start = page * size,
        movies = this.data.movies;
        
    if (total>-1&&start>=total){
      console.log('there is no result');
      this.setData({showNoResult:true});
      return;
    }
    this.setData({
      param: {
        start: start,
        count: 10
      }
    });
    wx.showLoading({
      title: 'loading',
    })
    app.getInTheaters(that.data.param, function (data) {
      wx.hideLoading();
      movies = [...movies,...data.subjects];
      that.setData({total:data.total,movies:movies});
    });
  }
})