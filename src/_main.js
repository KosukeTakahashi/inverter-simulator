const WIDTH = 800
const HEIGHT = 600

const initButton = document.getElementById('init')
const playButton = document.getElementById('play')
const volumeControl = document.getElementById('volume')


const audioContext = new (window.AudioContext || window.webkitAudioContext)()

function setup() {
    createCanvas(WIDTH, HEIGHT)
}

function draw() {
    background(90)
}

/**
 * 三角波を生成
 * 
 * @param {number} len - 長さ
 * @param {number} omega - 角速度
 * @param {number} theta - 位相
 * @return {Float32Array} - 結果
 */
function getTriwave(len, omega, theta) {
    const arr = new Float32Array(len)
    
    for (let i = 0; i < len; i++) {
        const j = ((i % 360) * Math.PI / 180.0) * omega + theta
        const jDeg = j * 180.0 / Math.PI
        
        if (jDeg < 90 || 270 <= jDeg) {
            arr[i] = j / (2.0 * Math.PI)
        }
        else {
            arr[i] = 1.0 - (j / (2.0 * Math.PI))
        }
    }

    return arr
}

document.getElementById('init').onclick = () => {
    const playButton = document.getElementById('play')
    const volumeControl = document.getElementById('volume')

    if (!(playButton instanceof HTMLButtonElement)) {
        return
    }

    if (!(volumeControl instanceof HTMLInputElement)) {
        return
    }

    // @ts-ignore
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const channels = 2
    const nFrames = context.sampleRate * 2.0
    const arrayBuffer = context.createBuffer(channels, nFrames, context.sampleRate)
    const gainNode = context.createGain()

    volumeControl.oninput = () => {
        gainNode.gain.value = volumeControl.valueAsNumber / 100.0
    }

    const sinwave = new Float32Array(nFrames)
    const triwave = getTriwave(nFrames, 5.0, 0.0)

    for (let i = 0; i < nFrames; i++) {
        sinwave[i] = Math.sin(i * 180 / Math.PI / 2000)
    }

    playButton.onclick = () => {
        playButton.disabled = true

        for (let ch = 0; ch < channels; ch++) {
            const buf = arrayBuffer.getChannelData(ch)

            for (let i = 0; i < nFrames; i++) {
                const k = 0.04
                const last = 0 < i ? buf[i - 1] : 0.0

                buf[i] = (1.0 - k) * last + k * (sinwave[i] < triwave[i] ? 1.0 : 0.0)
            }
        }

        const source = context.createBufferSource()
        source.buffer = arrayBuffer
        // source.connect(context.destination)
        source.connect(gainNode)
        gainNode.connect(context.destination)

        source.start()

        setTimeout(() => {
            playButton.disabled = false
        }, 2000);
    }
}
