// pages/subject/subject.js
const util = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    movie:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id});
    this.getMovieInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var path = '/pages/subject/subject?id=' + this.data.id,
        title = 'Douban Movie - ' + this.data.movie.titles;
    return {
      title: title,
      path: path
    }
  },
  getMovieInfo: function () {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    util.sendRequest('https://api.douban.com/v2/movie/subject/' + that.data.id, {},function (res) {
      wx.hideLoading();
      console.log(res.data);
      var movie =res.data;
      movie.titles = movie.title == movie.original_title ? movie.title : (movie.title + '/' + movie.original_title);
      movie.akas=movie.aka.join('/');
      movie.castsStr = movie.casts.map(c=>c.name).join('/');
      movie.directorsStr = movie.directors.map(d=>d.name).join('/');
      movie.countriesStr=movie.countries.join('/');
      movie.genresStr = movie.genres.join('/');
      that.setData({ movie: movie });
    });
  }
})
