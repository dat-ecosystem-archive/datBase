const html = require('choo/html')

module.exports = function (state, prev, send) {
  return html`
    <form style="border:1px solid #ccc;padding:3px;text-align:center;" action="https://tinyletter.com/datdata" method="post" target="popupwindow" onsubmit="window.open('https://tinyletter.com/datdata', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true">
    <h1>Get access to datproject.org</h1>
    <p>We are currently in development and will be inviting users one at a time to get a user account and publish datasets.</p>
    <p><label for="tlemail">Enter your email address to get invited</label></p>
    <p><input type="text" style="width:140px" name="email" id="tlemail" /></p><input type="hidden" value="1" name="embed"/><input type="submit" value="Subscribe" />
    </form>
  `
}
