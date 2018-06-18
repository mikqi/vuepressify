module.exports = {
  title: '<%= title %>',
  description: '<%= description %>',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about/' },
    ],
    sidebar: [
      ['/', 'Home'],
      ['/about/', 'About'],
    ]
  }
}
