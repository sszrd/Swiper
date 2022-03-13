class Swiper {
    constructor(options) {
        this.root = options.root;
        this.imgList = options.imgList;
        this.delay = options.delay;
        this.interval = options.interval;
        this.animationId = null;
        this.time = 0;
        this.width = 0;
        this.height = 0;
        this.oImgList = null;
        this.index = 0;
    }

    init() {
        const swiper = document.createElement("div");
        swiper.className = "swiper";
        this.root.appendChild(swiper);
        this.width = swiper.getBoundingClientRect().width;
        this.height = swiper.getBoundingClientRect().height;
        this.oImgList = document.createElement("div");
        this.oImgList.className = "imgList";
        this.oImgList.style.width = `${this.imgList.length * 2}00%`;
        swiper.appendChild(this.oImgList);
        for (let img of this.imgList) {
            const oImg = document.createElement("img");
            oImg.src = img.src;
            oImg.alt = img.alt;
            oImg.style.width = `${this.width}px`;
            oImg.style.height = `${this.height}px`;
            this.oImgList.appendChild(oImg);
        }
        this.oImgList.innerHTML += this.oImgList.innerHTML;
    }

    start() {
        const timer = () => {
            this.time++;
            this.animationId = requestAnimationFrame(timer);
            if ((1000 / 60) * this.time >= this.delay) {
                const sec = new Date().getSeconds();
                this.time = 0;
                this.next();
            }
        }
        this.animationId = requestAnimationFrame(timer);
    }

    end() {
        this.time = 0;
        cancelAnimationFrame(this.animationId);
    }

    next() {
        this.oImgList.style.transition = `${this.interval}s`;
        this.index++;
        this.oImgList.style.transform = `translate3D(${-this.index * this.width}px,0px,0px)`;
        if (this.index === this.imgList.length * 2) {
            this.end();
            this.index = this.imgList.length - 1;
            this.oImgList.style.transition = "none";
            this.oImgList.style.transform = `translate3D(${-this.index * this.width}px,0px,0px)`;
            this.time = this.delay;
            this.start();
        }
    }
}