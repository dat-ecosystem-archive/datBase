module.exports = {
  namespace: 'appRehydrator',
  state: {},
  subscriptions: [
    function (send) {
      Object.keys(window.dl.init__dehydratedAppState).forEach((prop) => {
        const sendTo = prop + ':update'
        send(sendTo, window.dl.init__dehydratedAppState[prop], function () {
          console.log('[appRehydrator] rehydration complete for model: ' + prop)
        })
      })
    }
  ]
}
