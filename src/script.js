class VideoFacade extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        video, [data-vimeo-url] {
          min-width: 100%;
          min-height: 100%;
          object-fit: cover;
          display: block;
        }
        [data-vimeo-url] {
          height: 100%;
        }
        iframe {
          width: 100%;
          height: 100%;
        }
        .standard-play-button {
          position:absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: none;
          cursor: pointer;
          padding: 0;
          margin: 0;
          width: 15%;
          aspect-ratio: 1;
          color: red;
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }
        .standard-play-button svg {
          width: 60%;
          transform: translate(8%, 5%);
        }
      </style>

      <video></video>
      <slot name="play-button">
        <button class="standard-play-button" aria-label="Play video">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#000000" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </button>
      </slot>
    `;
  }


  connectedCallback() {
    this.video = this.shadowRoot.querySelector("video");
    this.playBtn = this.getPlayButton();
    this.poster = this.getAttribute("poster");
    this.src = this.getAttribute("src");
    this.type = this.getAttribute("type") || "native";
    this.options = this.getAttribute("options")?.split(" ") || [];
    this.lazy = this.hasAttribute("lazy");
    this.autopause = this.hasAttribute("autopause");
    this.threshold = this.getAttribute("threshold");
    this.pauseOnClick = this.hasAttribute("pauseonclick") || false;

    this.style.backgroundImage = `url("${this.poster}")`;

    this.playBtn.addEventListener('click', async () => this.videoLoaded ? this.video.play() : await this.videoInit(true));
    this.pauseOnClick && this.addEventListener('click', () => this.isPlaying && this.video.pause());
    if (this.lazy || this.autopause) this.observeVideo();
  }

  play() {
    if (this.videoLoaded && !this.isPlaying) {
      this.video.play();
    }
  }

  pause() {
    if (this.videoLoaded && this.isPlaying) {
      this.video.pause();
    }
  }

  async videoInit(play) {
    if (this.videoLoaded) return;

    switch (this.type) {
      case 'vimeo':
        await this.vimeoInit();
        break;
      case 'youtube':
        await this.youtubeInit();
        break;
      default:
        this.nativeInit();
    }

    this.videoLoaded = true;
    if (play) this.video.play();
  }

  nativeInit() {
    this.video.src = this.src;
    this.video.poster = this.poster;
    for (const option of this.options) {
      this.video.setAttribute(option, "")
    }
    this.video.addEventListener('loadeddata', () => {
      this.videoLoaded = true;
    });
    this.video.addEventListener('play', () => {
      this.playBtn.style.display = 'none';
      this.isPlaying = true;
    });
    this.video.addEventListener('pause', () => {
      this.playBtn.style.display = 'block';
      this.isPlaying = false;
    });
    return;
  }

  async youtubeInit() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loadPlayer('youtube');
        const youtube = document.createElement("div");
        let ytOptions = { rel: 0, controls: 0 };
        for (const option of this.options) {
          ytOptions[option] = 1;
        }
        this.video.replaceWith(youtube);

        const onAutoplayBlocked = () => {
          this.video.muted = true;
          this.video.play();
        }
        const onPlayerReady = () => {
          if (ytOptions.autoplay) this.video.mute();
          this.video.play = this.video.playVideo;
          this.video.pause = this.video.pauseVideo;
          this.videoLoaded = true;
          resolve();
        }

        const onPlayerStateChange = (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this.playBtn.style.display = 'none';
          } else if (event.data === YT.PlayerState.PAUSED) {
            this.isPlaying = false;
            this.playBtn.style.display = 'block';
          }
        }

        this.video = new YT.Player(youtube, {
          videoId: this.src,
          playerVars: ytOptions,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onAutoplayBlocked': onAutoplayBlocked
          }
        });
      } catch (e) {
        console.error(e);
        reject(e);
      } 
    })
  }

  async vimeoInit() {
    try {
      await this.loadPlayer('vimeo');
      const vimeo = document.createElement("div");
      vimeo.setAttribute("data-vimeo-url", this.src);
      if (!this.options.includes('controls')) {
        vimeo.style.pointerEvents = 'none';
      }
      this.video.replaceWith(vimeo);
      this.video = new Vimeo.Player(vimeo, {
        autoplay: this.options.includes("autoplay"),
        muted: this.options.includes("muted"),
        controls: this.options.includes("controls"),
      });
      this.video.on('loaded', () => {
        this.videoLoaded = true;
        this.video.on('play', () => {
          this.playBtn.style.display = 'none';
          this.isPlaying = true;
        })
        this.video.on('pause', () => {
          this.playBtn.style.display = 'block';
          this.isPlaying = false;
        })
      })
    } catch (error) {
      console.log(error);
    }
  }

  getPlayButton() {
    const slot = this.shadowRoot.querySelector("slot");
    return slot.assignedElements().length ? slot.assignedElements()[0] : slot;
  }

  observeVideo() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && this.lazy) {
          this.videoLoaded ? this.options.includes("autoplay") && this.video.play() : this.videoInit();
        } else {
          if (this.autopause && this.videoLoaded && this.isPlaying) this.video.pause();
        }
      })
    }, { threshold: this.threshold || 0 })
    observer.observe(this);
    this._observer = observer;
  }

  async loadPlayer(type) {
    return new Promise((resolve, reject) => {
      if ((type === 'youtube' && window.YT) || (type === 'vimeo' && window.Vimeo)) resolve();
      const script = document.createElement('script');
      if (type === 'vimeo') {
        script.src = 'https://player.vimeo.com/api/player.js';
      } else if (type === 'youtube') {
        script.src = 'https://www.youtube.com/iframe_api';
      } else {
        reject(new Error('Unsupported player type'));
        return;
      }

      script.onload = () => {
        if (type === 'youtube') {
          window.onYouTubeIframeAPIReady = () => {
            console.log('YouTube API is ready');
            resolve();
          };
        } else {
          console.log('Vimeo player loaded successfully');
          resolve();
        }
      };

      script.onerror = () => {
        console.error(`Failed to load ${type} player.`);
        reject(new Error(`Failed to load ${type} player script.`));
      };

      document.body.appendChild(script);
    });
  }

  disconnectedCallback() {
    this._observer?.disconnect();
  }

}
customElements.define('video-facade', VideoFacade);


