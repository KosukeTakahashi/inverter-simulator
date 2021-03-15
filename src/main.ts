import p5 from 'p5'

const WIDTH = 800
const HEIGHT = 600
const DURATION = 0.05

function triwave(x: number) {
    const stride = 2 * Math.PI
    const half = Math.PI / 2
    const tilt = 2 / Math.PI

    while (x <= -half) {
        x += stride
    }

    while (half <= x) {
        x -= stride
    }

    if (-half < x && x <= half) {
        return tilt * x
    }
    else if (x <= -half) {
        return -tilt * x - 2
    }
    else {
        return -tilt * x + 2
    }
}

function generateTriwave(len: number, omega: number, theta: number): Float32Array {
    const arr = new Float32Array(len)

    for (let i = 0; i < len; i++) {
        const x = i * 2 * Math.PI / len * DURATION * omega + theta
        arr[i] = triwave(x)
    }

    return arr
}

function generateSinwave(len: number, omega: number, theta: number): Float32Array {
    const arr = new Float32Array(len)

    for (let i = 0; i < len; i++) {
        const x = i * 2 * Math.PI / len * DURATION * omega + theta
        arr[i] = Math.sin(x)
    }

    return arr
}

const initButton = document.querySelector<HTMLButtonElement>('#init')!
const playButton = document.querySelector<HTMLButtonElement>('#play')!
const volumeControl = document.querySelector<HTMLInputElement>('#volume')!
const freqControl = document.querySelector<HTMLInputElement>('#freq')!
const freqValue = document.querySelector<HTMLSpanElement>('#freq-val')!
const modeLabel = document.querySelector<HTMLSpanElement>('#mode')!

const audioContext = new AudioContext()
const nFrames = audioContext.sampleRate * DURATION
const arrayBuffer = audioContext.createBuffer(1, nFrames, audioContext.sampleRate)
// const srcNode = audioContext.createBufferSource()
const gainNode = audioContext.createGain()

// srcNode.connect(gainNode)
gainNode.gain.value = volumeControl.valueAsNumber / 100
gainNode.connect(audioContext.destination)

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT)
    }

    p.draw = () => {
        p.background(100)
        p.stroke(255, 255, 255)

        const buffer = arrayBuffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
            if (i == 0) {
                const x = i * WIDTH / buffer.length
                const y = HEIGHT * (0.5 - buffer[i] / 2)

                p.point(x, y)
            }
            else {
                const x1 = (i - 1) * WIDTH / buffer.length
                const y1 = HEIGHT * (0.5 - buffer[i - 1] / 2)
                const x2 = i * WIDTH / buffer.length
                const y2 = HEIGHT * (0.5 - buffer[i] / 2)

                p.line(x1, y1, x2, y2)
            }
        }
    }
}

volumeControl.oninput = () => {
    gainNode.gain.value = volumeControl.valueAsNumber / 100
}

let freq = freqControl.valueAsNumber

freqControl.oninput = () => {
    freq = freqControl.valueAsNumber
    freqValue.innerHTML = freqControl.value
    playButton.click()
}

initButton.onclick = () => {
    new p5(sketch)
    initButton.disabled = true
    playButton.disabled = false
}

playButton.onclick = () => {
    playButton.disabled = true

    // 147 156 175 197 223 234 262 294 312 350 400 [Hz]
    // 0.0 0.5 1.0 1.6 2.0 2.5 3.0 3.7 4.2 4.5 5.0 [Hz]
    // sync11 sync9 sync7 sync5 sync3 sync1
    // 40     44    46.5  63.5  77.5  84.5
    // ~160[Hz]

    const proc = () => {
        let carrier = 1
        if (freq < 7.3) {
            carrier = 781.25
            modeLabel.innerText = `非同期 ${carrier} Hz`
        }
        else if (freq < 24) {
            carrier = 39 * freq
            modeLabel.innerText = `同期 39パルス`
        }
        else if (freq < 26.5) {
            carrier = 27 * freq
            modeLabel.innerText = `同期 27パルス`
        }
        else if (freq < 37.5) {
            carrier = 15 * freq
            modeLabel.innerText = `同期 15パルス`
        }
        else if (freq < 57.5) {
            carrier = 7 * freq
            modeLabel.innerText = `同期 7パルス`
        }
        else if (freq < 64.5) {
            carrier = 3 * freq
            modeLabel.innerText = `同期 3パルス`
        }
        else {
            carrier = freq
            modeLabel.innerText = `同期 1パルス`
        }

        // if (freq < 0.5) {
        //     carrier = 147
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 1.0) {
        //     carrier = 156
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 1.6) {
        //     carrier = 175
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 2.0) {
        //     carrier = 197
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 2.5) {
        //     carrier = 223
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 3.0) {
        //     carrier = 234
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 3.7) {
        //     carrier = 262
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 4.2) {
        //     carrier = 294
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 4.5) {
        //     carrier = 312
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 5.0) {
        //     carrier = 350
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 40) {
        //     carrier = 400
        //     modeLabel.innerText = `非同期 ${carrier}`
        // }
        // else if (freq < 44) {
        //     carrier = 11 * freq
        //     modeLabel.innerText = `同期 11パルス`
        // }
        // else if (freq < 46.5) {
        //     carrier = 9 * freq
        //     modeLabel.innerText = `同期 9パルス`
        // }
        // else if (freq < 63.5) {
        //     carrier = 7 * freq
        //     modeLabel.innerText = `同期 7パルス`
        // }
        // else if (freq < 77.5) {
        //     carrier = 5 * freq
        //     modeLabel.innerText = `同期 5パルス`
        // }
        // else if (freq < 84.5) {
        //     carrier = 3 * freq
        //     modeLabel.innerText = `同期 3パルス`
        // }
        // else {
        //     carrier = freq
        //     modeLabel.innerText = `同期 1パルス`
        // }

        // carrier *= 2

        const triwave = generateTriwave(nFrames, carrier, 0)
        const sinwave = generateSinwave(nFrames, freq, 0)

        const buf = arrayBuffer.getChannelData(0)
        for (let i = 0; i < buf.length; i++) {
            // const diff = triwave[i] - sinwave[i]
            // if (0.5 < diff) {
            //     buf[i] = 1.0
            // }
            // else if (-0.5 <= diff && diff <= 0.5) {
            //     buf[i] = 0.0
            // }
            // else {
            //     buf[i] = -1.0
            // }
            if (sinwave[i] < triwave[i]) {
                buf[i] = 0.6
            }
            else if (sinwave[i] === triwave[i]) {
                buf[i] = i === 0 ? -0.6 : buf[i - 1]
            }
            else {
                buf[i] = -0.6
            }
        }

        // const k = 0.4
        // for (let i = 1; i < buf.length; i++) {
        //     buf[i] = (1 - k) * buf[i - 1] + k * buf[i]
        // }

        const srcNode = audioContext.createBufferSource()
        srcNode.buffer = arrayBuffer

        srcNode.connect(gainNode)
        srcNode.start()

        setTimeout(() => {
            proc()
        }, DURATION * 1000)
    }

    proc()

    // setTimeout(() => {
    //     srcNode.stop()
    //     srcNode.disconnect()
    //     playButton.disabled = false
    //     playButton.click()
    // }, DURATION * 1000);
}
