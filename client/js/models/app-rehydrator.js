module.exports = {
  namespace: 'appRehydrator',
  state: {},
  subscriptions: [
    function (send) {
      for (const prop in window.dl.init__dehydratedAppState) {
        let sendTo = prop + ':update'
        send(sendTo, window.dl.init__dehydratedAppState[prop], function () {
          console.log('[appRehydrator] rehydration complete for model: ' + prop)
        })
      }
    }
  ]
}
