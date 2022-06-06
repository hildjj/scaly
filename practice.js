let player;

let STATES = {};
let done = false;

function onPlayerReady(event) {
  console.log('onPlayerReady')
  player.playVideo();
}

function onPlayerStateChange(event) {
  console.log('onPlayerStateChange', STATES[event.data])
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
}

function onYouTubeIframeAPIReady() {
  STATES = {
    [YT.PlayerState.UNSTARTED]: 'UNSTARTED',
    [YT.PlayerState.ENDED]: 'ENDED',
    [YT.PlayerState.PLAYING]: 'PLAYING',
    [YT.PlayerState.PAUSED]: 'PAUSED',
    [YT.PlayerState.BUFFERING]: 'BUFFERING',
    [YT.PlayerState.CUED]: 'CUED',
  };

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'bYRk0NscoEk',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
