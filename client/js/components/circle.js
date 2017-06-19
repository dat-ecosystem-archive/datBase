const html = require('choo/html')
const css = require('sheetify')

const circle = (prog) => {
  const prefix = css`
    .dat-progress-circle {
      margin-right: 10px;
      margin-top: 10px;
      position: relative;
      display: inline-block;
      width: 90px;
      height: 90px;
      line-height: 90px;
      border-radius: 50%;
      background: #394b5b;
      background-image: -webkit-linear-gradient(left, transparent 50%, #2980B9 0);
      background-image: linear-gradient(to right, transparent 50%, #2980B9 0);
      color: transparent;
      text-align: center;
      -webkit-animation: done 100.1s linear infinite;
              animation: done 100.1s linear infinite;
      -webkit-animation-play-state: paused;
              animation-play-state: paused;
    }

    .dat-progress-circle:hover {
      box-shadow: 0 1px 1rem rgba(0, 0, 0, 0.3);
    }

    @-webkit-keyframes spin {
      to {
        -webkit-transform: rotate(0.5turn);
                transform: rotate(0.5turn);
      }
    }

    @keyframes spin {
      to {
        -webkit-transform: rotate(0.5turn);
                transform: rotate(0.5turn);
      }
    }

    @-webkit-keyframes bg {
      50% {
        background: #2980B9;
      }
    }

    @keyframes bg {
      50% {
        background: #2980B9;
      }
    }

    @-webkit-keyframes done {
      0% {
        background-color: #394b5b;
      }
      99% {
        background-color: #394b5b;
      }
      100% {
        background-color: #35B44F;
      }
    }

    @keyframes done {
      0% {
        background-color: #394b5b;
      }
      99% {
        background-color: #394b5b;
      }
      100% {
        background-color: #35B44F;
      }
    }

    @keyframes bounce-once {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }

    .bounce-once {
      animation: bounce-once 0.5s cubic-bezier(0.320, -0.280, 0.760, 1.310) forwards;
    }

    .dat-progress-circle::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      border-radius: 0 100% 100% 0 / 50%;
      background-color: inherit;
      -webkit-transform-origin: left;
              transform-origin: left;
      -webkit-animation: spin 50s linear infinite, bg 100s step-end infinite;
              animation: spin 50s linear infinite, bg 100s step-end infinite;
      -webkit-animation-play-state: paused;
              animation-play-state: paused;
      -webkit-animation-delay: inherit;
              animation-delay: inherit;
    }

    .dat-progress-circle__progress {
      position: absolute;
      background-color: #65737F;
      width: 78px;
      height: 78px;
      top: 6px;
      left: 6px;
      z-index: 3;
      border-radius: 50%;
      overflow: hidden;
      color: white;
    }

    .dat-progress-circle__progress span {
      position: relative;
      top:-7px;
    }
  `

  return html`
    <div class="${prefix} dat-progress-circle" style="animation-delay: ${-prog}s">
      <div class="dat-progress-circle__progress">
        <span class="f4">${prog === 100 ? 100 : prog.toFixed(2)}%</span>
      </div>
    </div>
  `
}

module.exports = circle
