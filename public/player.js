var player1;
var useHLS = false;
var uuid;
var pmode;
var defaultres = 0;
var noreload = false;
var resOptions = [];
var onbuffer = false;
var source;
var slow = false;

console.log('script loaded');

window.addEventListener("hashchange", function(){
    console.log('hash changed');
    var data =  window.location.href.split('#')[1];
    if(dec64(data) !== false){
        location.reload();
    }
});

document.addEventListener("DOMContentLoaded", function(){
    document.title = 'Stream';
    const video = document.querySelector("video");
    var data =  window.location.href;
    var splitted = data.split('#');
    source = splitted[1];

    uuid = source;  //fallback value

    for(var i=2; i<splitted.length; i++){
        if(splitted[i].indexOf('uid=') === 0){
            uuid = splitted[i].split('uid=')[1];
        }else if(splitted[i].indexOf('pmode=') === 0){
            pmode = splitted[i].split('pmode=')[1];
        }else if(splitted[i].indexOf('res=') === 0){
            var res = parseInt(splitted[i].split('res=')[1]);
            if(!isNaN(res)){
                defaultres = res;
            }
        }else if(splitted[i].indexOf('t=') === 0 && uuid !== source && isStorage('localStorage')){
            localStorage.setItem("playback-" + uuid, splitted[i].replace('t=', ''));
        }else if(splitted[i].indexOf('noreload=') === 0){
            noreload = splitted[i].split('noreload=')[1];
        }else if(splitted[i].indexOf('options=') === 0){
            var rawOptions = splitted[i].split('options=')[1];
        }else if(splitted[i].indexOf('onbuffer=') === 0){
            onbuffer = splitted[i].split('onbuffer=')[1];
        }else if(splitted[i].indexOf('slow=') === 0){
            slow = true;
        }
    }

    if(typeof rawOptions === 'string'){
        rawOptions = rawOptions.split(',');
        for(var i = 0; i < rawOptions.length; i++){
            resOptions[i] = parseInt(rawOptions[i]);
        }
    }

    if(typeof source === 'undefined'){
        shownotif('No video specified');
        return;
    }

    source = dec64(source);
    if(source === false){
        shownotif('URL Invalid');
        return;
    }

    if(typeof replacement !== 'undefined'){
        source = source.replace('bestanimescdn', replacement);
    }

    useHLS = source.includes('.m3u8');

    var tooltips = { 
        controls: true, 
        seek: true 
    }
    if(!isTouch()){    //NOT TOUCHSCREEN
        var controls = [
        //    'restart',
        //    'rewind',
            'play',
        //    'fast-forward',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
        //    'captions',
            'settings',
            'pip',
            'airplay',
        //    'download',
            'fullscreen'
        ];
    }else if(window.innerWidth > 935){  //WIDE & TOUCHSCREEN
        var controls = [
        //    'restart',
            'rewind',
            'play',
            'fast-forward',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
        //    'captions',
            'settings',
            'pip',
            'airplay',
        //    'download',
            'fullscreen'
        ];
    }else{  //SMALL TOUCHSCREEN
        tooltips.controls = false;
        var controls = [
        //    'restart',
            'rewind',
            'play',
            'fast-forward',
            'progress',
            'current-time',
            'duration',
        //    'mute',
        //    'volume',
        //    'captions',
            'settings',
            'pip',
            'airplay',
        //    'download',
            'fullscreen'
        ];
    }
    
    const defaultOptions = { 
        i18n : {
            play: 'Play (K)',
            pause: 'Pause (K)',
            mute: 'Mute (M)',
            unmute: 'Unmute (M)',
            enterFullscreen: 'Enter fullscreen (F)',
            exitFullscreen: 'Exit fullscreen (F)',
            qualityLabel: {
                0: 'Auto',
            }
        },
        iconUrl : '/lib/plyr3.6.9.svg',
        controls : controls,
        tooltips : tooltips,
        seekTime : 5,
        keyboard : { 
            focused: true,
            global: true
        },
        fullscreen : {
            iosNative: true
        }
    };

    setTimeout(function(){
        var vidcont = document.getElementById('videocontainer');
        if('block' !== vidcont.style.display && videxpired === false){
            if(typeof player1 === 'undefined'){
                var vid = document.createElement('video');
                if(noreload === false){
                    location.replace(location.href + '#noreload=true');
                }else if(!Hls.isSupported() && !vid.canPlayType('application/vnd.apple.mpegURL')){
                    shownotif('Your browser not support HLS. please update your browser');
                }else if(!videxpired){
                    shownotif('If video doesn\'t load, try reload or clear cache');
                }
            }else{
                vidcont.style.display = 'block';
            }
        }
    }, 15000);

    if (Hls.isSupported() && useHLS) {

        const hls = new Hls();
        hls.loadSource(source);
        console.log('loading hls...');

        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            console.log('hls parsed');
            if(typeof player1 === 'undefined'){
                var availableQualities = hls.levels.map((l) => l.height);
                availableQualities.push(0);
                const reversedQualities = availableQualities.reverse();

                defaultOptions.quality = {
                    default: 0,
                    options: reversedQualities,
                    forced: true,
                    onChange: (e) => updateQuality(e),
                }

                skipStore = true;

                player1 = new Plyr(video, defaultOptions);
                plyrSetup();

                skipStore = false;

                if(noreload === false){
                    setTimeout(function(){
                        if(player1.currentTime === 0 && player1.buffered === 0){
                            location.replace(location.href + '#noreload=true');
                        }
                    }, 17000);
                }
            }else{
                player1.play();
            }
        });

        var failFrag;
        var failFragCount = 0;

        hls.on(Hls.Events.ERROR, function (event, data) {
            if(data.fatal === true){
                if(data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    console.log("network error on hls load, retrying...");
                    trycount++;
                    if(trycount < 11){
                        setTimeout(function(){
                            checkvideo(source);
                        }, 500);
                        var prev = hls.currentLevel;
                        hls.loadLevel = -1;
                        hls.startLoad();
                        setTimeout(() => {
                            hls.loadLevel = prev;
                        }, 1000);
                    }else if(pmode === 'fallback'){
                        window.parent.postMessage('proxy#off', '*');    //Fallback to external
                    }else if(pmode === 'alt'){
                        window.parent.postMessage('proxy#error#force', '*');  //Fallback to goplyr.html
                    }else if(typeof player1 === 'undefined' || !player1.playing){
                        shownotif('Network error. Try reload or use other stream', 600000);
                    }
                }else if(data.type === Hls.ErrorTypes.MEDIA_ERROR){
                    console.log("media error, recovering...");
                    hls.recoverMediaError();
                    player1.play();
                }
            }else if(data.details === Hls.ErrorDetails.FRAG_LOAD_ERROR && typeof data.frag.relurl === 'string'){
                if(hls.autoLevelEnabled === false){
                    var prev = hls.currentLevel;
                    hls.stopLoad();
                    hls.loadLevel = -1;
                    hls.startLoad();
                    setTimeout(() => {
                        hls.loadLevel = prev;
                    }, 1000);
                }
            }
        });
        hls.attachMedia(video);
        window.hls = hls;
    } else {
        console.log('use native hls player');
        player1 = new Plyr(video, defaultOptions);

        if(resOptions.length > 1 && !isNaN(resOptions[0])){
            var arr = [];
            if(defaultres === 0){
                defaultres = 720;
            }
            for(var i = 0; i < resOptions.length; i++){
                var cur = resOptions[i];
                if(!isNaN(cur)){
                    arr.push({
                        src: source.replace('.m3u8', '.' + cur + '.m3u8'),
                        size: cur
                    });
                }
            }
            player1.source = {
                type: 'video',
                sources: arr
            };
            if(resOptions.includes(defaultres)){
                player1.quality = defaultres;
            }
        }else{
            player1.source = {
                type: 'video',
                sources: [
                    {
                        src: source
                    }
                ]
            };
        }
    
        plyrSetup();

        var sourceEl = document.getElementsByTagName("source");
        for(var i = 0; i < sourceEl.length; i++){
            sourceEl[i].addEventListener('error', nativeErr);
        }
    }

    function updateQuality(newQuality) {
        window.hls.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
                window.hls.nextLevel = levelIndex;
            }else if(newQuality === 0){
                window.hls.loadLevel = -1;
            }
        });
        if(isStorage('sessionStorage') && !skipStore){
            var oldQuality = sessionStorage.getItem('quality');
            if(newQuality !== oldQuality){
                sessionStorage.setItem('quality', newQuality);
                sessionStorage.setItem('timeq', Date.now());
            }
        }
    }

    setTimeout(function(){
        if(slow){
            shownotif("Temporarily using slow server, normal server not available yet", 15000);
        }else if(isStorage('localStorage') === false && !player1.playing){
            shownotif("your browser deny localstorage, player can't remember playback progress", 10000);
        }
    }, 4000);
    window.addEventListener("message", handleMsg, false);
});
var skipStore = false;
var trycount = 0;
var tryAttempt = 0;

//Native HTML5 player error handling
function nativeErr(){
    if(player1.media.error !== null && player1.media.error.code === 4){
        tryAttempt++;
    }else{
        trycount++;
    }
    if(tryAttempt < 16){    //15x media error it will fallback
        if(trycount < 16){  //15x other error it stop retry
            var vidplayer = document.querySelector("video");
            console.log('Reloading video...');
            var tmp = player1.currentTime;
            vidplayer.load();
            vidplayer.play();
            vidplayer.currentTime = tmp;
        }else{
            tryAttempt = 17;
        }
    }else if(pmode === 'fallback'){
        window.parent.postMessage('proxy#off', '*');
    }else if(pmode === 'alt'){
        window.parent.postMessage('proxy#error#force', '*');  //Fallback to goplyr.html
    }else if(!player1.playing){
        shownotif('Your browser fail to play, try reload or change player', 600000);
    }
}

//SETUP
function plyrSetup(){
    var videocontainer = document.getElementById('videocontainer');
    videocontainer.style.display = 'block';

    window.addEventListener("orientationchange", function() {
        if(Math.abs(window.orientation) > 45 && Math.abs(window.orientation) < 135){
            player1.fullscreen.enter();
        }else{
            player1.fullscreen.exit();
        }
    });

    player1.on('seeking', event => {
        if(isTouch() && window.innerWidth < 935){
            var dataset = document.activeElement.dataset;
            var trigger = ['fast-forward', 'rewind'];
            if(typeof dataset === 'object' && trigger.includes(dataset.plyr)){
                if(player1.playing && dataset.plyr === 'rewind'){
                    player1.pause();
                }
                seekFast();
            }
        }
    });
    if(typeof screen.orientation !== 'undefined'){
        player1.on('enterfullscreen', event => {
            screen.orientation.lock('landscape').catch(function(error) {
                // whatever
            });
        });
        player1.on('exitfullscreen', event => {
            screen.orientation.unlock();
        });
    }
    player1.on('ended', event => {
        if(player1.duration > 300 && player1.currentTime > player1.duration - 1){
            window.parent.postMessage('episode#forward', '*');
        }
    });
    if(!useHLS || !Hls.isSupported()){
        player1.on('error', nativeErr);
    }

    if(!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)){
        player1.on('enterfullscreen', event => {
            window.parent.postMessage('fallback#fullscreen', '*');
        });
        player1.on('exitfullscreen', event => {
            window.parent.postMessage('fallback#exitfull', '*');
        });
    }else{
        player1.on('enterfullscreen', event => {
            if(player1.fullscreen.forceFallback === true){
                window.parent.postMessage('fallback#fullscreen', '*');
            }
        });
        player1.on('exitfullscreen', event => {
            if(player1.fullscreen.forceFallback === true){
                player1.fullscreen.forceFallback = false;
                window.parent.postMessage('fallback#exitfull', '*');
            }
        });
    }

    document.addEventListener('keyup', e => {
        if (e.shiftKey && e.key === 'ArrowRight'){
            player1.forward(85);
        } else if (e.shiftKey && e.key === 'ArrowLeft'){
            player1.rewind(85);
        } else if (e.key === ']' || (e.shiftKey && e.key.toLowerCase() === 'n')){
            window.parent.postMessage('episode#forward', '*');
        } else if (e.key === '[' || (e.shiftKey && e.key.toLowerCase() === 'b')){
            window.parent.postMessage('episode#backward', '*');
        } else if (e.key === 'l' || e.key === 'L') {
            window.parent.postMessage('light#toggle', '*');
        } else if (e.key === '.'){
            player1.pause();
            player1.currentTime += 0.04;
        } else if (e.key === ','){
            player1.pause();
            player1.currentTime -= 0.04;
        }
    }, false);

    player1.on('playing', event => {
        if(playfirsttime){
            playfirsttime = false;

            if(isStorage('localStorage')){
                var playback = localStorage.getItem("playback-" + uuid);
                if(playback !== null){
                    playback = parseFloat(playback);
                    if(player1.duration - 60 > playback){
                        player1.currentTime = playback;
                    }
                }
            }

            if(isStorage('sessionStorage')){
                var storedQuality = sessionStorage.getItem('quality');
                var age = Date.now() - parseInt(sessionStorage.getItem('timeq'));
                if(!isNaN(storedQuality) && age < 43200000){    //12h max age
                    defaultres = parseInt(storedQuality);
                    console.log('use stored quality ' + storedQuality);
                }
            }
            skipStore = true;
            player1.quality = defaultres;
            setTimeout(() => {
                skipStore = false;
            }, 500);
        }
        if(SSdisplayed){
            screenshoot();
        }
        document.getElementById('notif').style.display = 'none';
    });
    timeMonitor();

    if(player1.touch){
        var el = player1.elements;
        el.poster.addEventListener('click', function(){
            if(getComputedStyle(el.controls).opacity === '1'){
                player1.togglePlay();
            }
        }, true);
    }

    if(player1.muted || player1.volume < 0.1){
        player1.muted = false;
        player1.volume = 1;
    }
    player1.speed = 1;

    //SKIP TOUCH CONTROL
    if('ontouchstart' in window){
        var poster = player1.elements.poster;
        poster.addEventListener('touchstart', handleTouchStart);
        poster.addEventListener('touchmove', handleTouchMove);
        poster.addEventListener('touchend', handleTouchEnd);

        //SKIP TOUCH INFO ELEMENT
        var infoEl = document.createElement('div');
        infoEl.style.cssText = 'position:fixed;top:5%;width:54px;background-color:#00000073;text-align:center;color:white;display:none';
        infoEl.id = 'skiptinfo';
        player1.elements.container.appendChild(infoEl);
    }

    console.log('plyr setup done');

    if(onbuffer !== false){
        checkBuffering(onbuffer);
    
        setInterval(function(){
            if(bufferCount > 0){
                bufferCount--;
            }
        }, 2000);
    }
};

var xDown = null;
var skipTmove = 0;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
};

function handleTouchEnd(evt) {
    if(skipTmove !== 0){
        player1.forward(skipTmove);
    }
    document.getElementById('skiptinfo').style.display = 'none';
    xDown = null;
    skipTmove = 0;
}

function handleTouchMove(evt) {
    if (!xDown) {
        return;
    }
    var xDiff = evt.touches[0].clientX - xDown;
    var abs = Math.abs(xDiff);
    if(abs > 270){
        var adjusted = abs - 270;
        adjusted = 10 + parseInt(adjusted / 5);

        if(xDiff < 0){
            skipTmove = -adjusted;
        }else{
            skipTmove = adjusted;
        }
    }else if(abs > 180){
        var adjusted = abs - 180;
        adjusted = 4 + parseInt(adjusted / 15);

        if(xDiff < 0){
            skipTmove = -adjusted;
        }else{
            skipTmove = adjusted;
        }
    }else{
        skipTmove = parseInt(xDiff / 30);
        if(skipTmove > 1){
            skipTmove -= 2;
        }else if(skipTmove < -1){
            skipTmove += 2;
        }else{
            skipTmove = 0;
        }
    }

    var el = document.getElementById('skiptinfo');
    if(skipTmove === 0){
        el.style.display = 'none';
        return;
    }
    el.innerHTML = skipTmove + 's';
    el.style.display = 'block';
};

var pPaused = true;
var buffering = false;
var bufferCount = 0;
var checkingBuffer = false;
function checkBuffering(time){
    if(checkingBuffer){
        return;
    }
    checkingBuffer = true;
    var offset = 0.05;
    var lastPlayPos = 0;
    var currentPlayPos = 0;
    var target = parseInt(time) * 2;
    if(isNaN(target)){
        target = 40;
    }

    setInterval(function(){
        currentPlayPos = player1.currentTime;

        if(!player1.paused && !pPaused && !player1.seeking && currentPlayPos > 1){
            if (!buffering && currentPlayPos < lastPlayPos){
                console.log("buffering");
                buffering = true;
            }
    
            if (buffering && currentPlayPos > lastPlayPos){
                console.log("not buffering anymore");
                buffering = false;
            }
        }else{
            buffering = false;
        }

        if(player1.paused){
            pPaused = true;
        }else{
            pPaused = false;
        }
        if(buffering){
            bufferCount++;
        }

        if(bufferCount === target){
            window.parent.postMessage('proxy#off', '*');
            bufferCount++;
        }

        lastPlayPos = currentPlayPos + offset;
    }, 500);
}

var playfirsttime = true;

var monitorInterval;
function timeMonitor(){
    if(isStorage('localStorage')){
        monitorInterval = setInterval(function(){
            if(!playfirsttime && player1.playing){
                localStorage.setItem("playback-" + uuid, player1.currentTime);
            }
        }, 2000);
    }
}

var seeking = 0;
var seekLastTime;
function seekFast(){
    var seekTime = 75;
    if(iOS()){
        seekTime = 50;
    }
    if(seekLastTime < player1.currentTime){
        if(seeking === 1){
            player1.forward(seekTime);
        }
        seeking = 1;
    }else if(seekLastTime > player1.currentTime){
        if(seeking === 2){
            player1.rewind(seekTime);
        }
        seeking = 2;
    }
    seekLastTime = player1.currentTime;
    setTimeout(function(){
        seeking = 0;
    }, 400);
}

var videxpired = false;
var videochecked = false;
function checkvideo(src){
    if(videochecked || typeof player1 !== 'undefined' || !navigator.onLine){
        return;
    }
    videochecked = true;
    var x = new XMLHttpRequest();
    x.open("GET", src);
    x.timeout = 15000;
    x.onloadend = function(){
        if(this.status === 200){
            return;
        }
        videxpired = true;
        if(noreload === false){
            setTimeout(function(){
                location.replace(location.href + '#noreload=true');
            }, 1000);
            return;
        }else if(pmode === 'fallback'){
            window.parent.postMessage('proxy#off', '*');
            setTimeout(function(){
                shownotif('Video expired. Please use newer link');
            }, 5000);
            return;
        }else if(pmode === 'alt'){
            window.parent.postMessage('proxy#error#force', '*');  //Fallback to goplyr.html
            return;
        }
        shownotif('Video expired. Please wait about 10 seconds...', 120000);
        if(uuid.length < 20){
            window.parent.postMessage('episode#report#' + uuid, '*');
            setTimeout(function(){
                window.parent.postMessage('episode#reload', '*');
            }, 10000);
        }
    };
    x.send();
}

var doneload = false;
var alreadyLoaded = false;
function handleMsg(evt){
    if(evt.data === 'screenshot'){
        screenshoot();
    }else if(evt.data === 'usewidescreen'){
        player1.fullscreen.forceFallback = true;
        player1.fullscreen.enter();
    }else if(evt.data === 'autoplay' && !doneload){
        doneload = true;
        var vid = document.querySelector("video");
        vid.autoplay = true;
        evt.source.postMessage("status#autoplaying", '*');
    }else if(evt.origin === location.origin && evt.data.includes('load#')){
        window.parent.postMessage('status#loaded', '*');   //tell parent don't send anymore
        if(!alreadyLoaded){
            alreadyLoaded = true;                                   //tell self not re-add again
            var payload = evt.data.split('#')[1];
            if(payload.includes('//')){
                var sc1 = window.document.createElement("script");
                sc1.src = payload;
                document.head.appendChild(sc1);
            }
        }
    }
}

var SSdisplayed = false;
var SSlocked = false;
function screenshoot(){
    if(SSlocked){
        return;
    }
    SSlocked = true;
    var info, canvas;

    //REMOVE IF DISPLAYED
    if(SSdisplayed){
        info = document.getElementById('howtosave');
        canvas = document.getElementsByTagName("canvas")[0];
        canvas.style.opacity = '0';
        info.style.opacity = '0';
        setTimeout(function(){
            canvas.remove();
            info.remove();
            SSlocked = false;
        }, 500);
        SSdisplayed = false;
        return;
    }

    var vid = document.querySelector("video");
    if(vid.videoWidth < 10){
        SSlocked = false;
        return;
    }

    var size = '30%';
    if(window.innerWidth < 800){
        size = '50%';
    }

    //CREATE OTHERWISE
    info = document.createElement('a');
    info.style.cssText = 'opacity:0;text-decoration:none;position:fixed;width:'+size+';bottom:5px;right:5px;transition:all 0.4s ease;background-color:rgba(0,0,0,0.5);text-align:center;color:white;z-index:99;font-size:12px;';
    info.innerHTML = 'Right click image to save';
    info.id = 'howtosave';
    document.body.appendChild(info);

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed; width:100%; box-shadow:0px 2px 5px 2px #131313c7; bottom:0; right:0; transition: all 0.4s ease; opacity:1';
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    document.body.appendChild(canvas);
    setTimeout(function(){
        canvas.style.width = size;
        canvas.style.bottom = '5px';
        canvas.style.right = '5px';
    }, 50);
    setTimeout(function(){
        info.style.opacity = '1';
        var imgUrl = '';
        try{
            imgUrl = canvas.toDataURL("image/jpeg");
        } catch (err) {
            console.log("can't convert img");
        }
        if(imgUrl !== ''){
            info.innerHTML = 'click here to save';
            info.style.padding = '5px 0';
            info.href = imgUrl;
            info.download = uuid + '_' + Math.floor(Math.random()*10000) +'.jpg';
        }
        SSlocked = false;
    }, 450);
    SSdisplayed = true;
}

function shownotif(html, time = 400000){
    var element = document.getElementById('notif');
    element.innerHTML = html;
    element.style.display = 'block';
    setTimeout(function(){
        element.style.display = 'none';
    }, time);
}

function isTouch() {
    return ('ontouchstart' in window || (navigator.maxTouchPoints > 0 && navigator.maxTouchPoints < 200));
}

function iOS(){
    return [
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function isStorage(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}

function dec64(str) {
    if (typeof str === 'undefined' || str.trim() === ''){ return false; }
    try {
        return atob(str);
    } catch (err) {
        return false;
    }
}