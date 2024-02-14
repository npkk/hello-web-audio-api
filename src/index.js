const baseFreq = 500;
let isPlaying = false;

let ctx;
let oscillator1;
let oscillator2;
let oscillator3;
let gain1;
let gain2;
let gain3;
let intervalId;

let count = 0;


window.onload = () => {
    document.querySelector("#play")?.addEventListener("click", async function() {
        play();
        intervalId = setInterval(tick, 1000);
    });
    
    document.querySelector("#stop")?.addEventListener("click", () => {
        stop();
    });
};

const play = () => {
    if (isPlaying) return;
    ctx = new window.AudioContext();

    // create merger node
    let merger = ctx.createChannelMerger();

    // create 2000hz oscillator
    oscillator1 = new OscillatorNode(ctx, {
        frequency: 2000,
        type: 'sine',
    });
    gain1 = new GainNode(ctx, {
        gain: 0
    });
    let pan1 = new StereoPannerNode(ctx, {
        pan: -1,
    })
    oscillator1.connect(gain1);
    gain1.connect(pan1);
    pan1.connect(merger);

    // create 500hz oscillator
    oscillator2 = new OscillatorNode(ctx, {
        frequency: 500,
        type: 'sine',
    });
    gain2 = new GainNode(ctx, {
        gain: 0
    });
    let pan2 = new StereoPannerNode(ctx, {
        pan: 1,
    })
    oscillator2.connect(gain2);
    gain2.connect(pan2);
    pan2.connect(merger);

    // create 1000hz oscillator
    oscillator3 = new OscillatorNode(ctx, {
        frequency: 1000,
        type: 'sine',
    });
    gain3 = new GainNode(ctx, {
        gain: 0
    });
    let pan3 = new StereoPannerNode(ctx, {
        pan: 0,
    })
    oscillator3.connect(gain3);
    gain3.connect(pan3);
    pan3.connect(merger);

    // connect to destination
    merger.connect(ctx.destination);

    // play
    oscillator1.start();
    oscillator2.start();
    oscillator3.start();

    count = 0;

    isPlaying = true;
}

const stop = () => {
    clearInterval(intervalId);
    oscillator1?.stop();
    oscillator2?.stop();
    oscillator3?.stop();
    ctx?.close();
    isPlaying = false;
}

let tick = () => {
    count = (count + 1) % 60;
    
    if(gain1 instanceof GainNode){
        gain1.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.05);
        setTimeout(() => {gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)}, 50);
    }
    if(gain2 instanceof GainNode && (count % 10) >= 7){
        gain2.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.05);
        setTimeout(() => {gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)}, 50);
    }
    if(gain3 instanceof GainNode && (count % 10) == 0){
        gain3.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.05);
        setTimeout(() => {gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.9)}, 50);
    }
}