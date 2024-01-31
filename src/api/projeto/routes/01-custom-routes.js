

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/projeto/:slug',
      handler: 'projeto.getPlusInfo'
    }
  ]
}