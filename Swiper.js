class Swiper {
    constructor(options) {
        this.root = options.root;
        this.imgList = options.imgList;
        this.delay = options.delay || 3000;
        this.interval = options.interval || 1.5;
        this.animationId = null;
        this.time = 0;
        this.width = 0;
        this.height = 0;
        this.oImgList = null;
        this.oNavList = null;
        this.index = 0;
        this.startX = 0;
    }

    init() {
        const swiper = document.createElement("div");
        swiper.className = "swiper";
        this.root.appendChild(swiper);
        this.width = swiper.getBoundingClientRect().width;
        this.height = swiper.getBoundingClientRect().height;
        //创建左右切换按钮
        const leftButton = document.createElement("div");
        leftButton.className = "left-btn";
        const rightButton = document.createElement("div");
        rightButton.className = "right-btn";
        leftButton.style.border = `solid ${this.width * 0.04}px`;
        leftButton.style.borderColor = `transparent gray transparent transparent`;
        leftButton.style.opacity = "0.5";
        rightButton.style.border = `solid ${this.width * 0.04}px`;
        rightButton.style.borderColor = `transparent transparent transparent gray`;
        rightButton.style.opacity = "0.5";
        //创建图片列表、下方导航列表
        this.oImgList = document.createElement("div");
        this.oImgList.className = "imgList";
        this.oNavList = document.createElement("div");
        this.oNavList.className = "navList";
        this.oImgList.style.width = `${this.imgList.length * 2}00%`;
        swiper.appendChild(this.oImgList);
        swiper.appendChild(this.oNavList);
        swiper.appendChild(leftButton);
        swiper.appendChild(rightButton);
        //创建并初始化图片列表导航列表子元素
        for (let img of this.imgList) {
            const oImg = document.createElement("img");
            const oNav = document.createElement("span");
            oImg.src = img.src;
            oImg.alt = img.alt;
            oImg.style.width = `${this.width}px`;
            oImg.style.height = `${this.height}px`;
            oNav.style.width = `${this.width / this.imgList.length / 10}px`;
            oNav.style.height = `${this.height / this.imgList.length / 20}px`;
            oNav.style.margin = `${this.width / this.imgList.length / 15}px`;
            this.oImgList.appendChild(oImg);
            this.oNavList.appendChild(oNav);
        }
        //复制一组图片实现无缝切换
        this.oImgList.innerHTML += this.oImgList.innerHTML;
        this.oNavList.childNodes[0].className += " active";
        //移动端触摸滑动事件绑定
        this.oImgList.addEventListener("touchstart", this.handleTouchStart);
        this.oImgList.addEventListener("touchmove", this.handleTouchMove);
        this.oImgList.addEventListener("touchend", this.handleTouchEnd);
        //左右切换按钮事件绑定
        leftButton.addEventListener("click", this.handleLeft);
        leftButton.addEventListener("mouseover", () => leftButton.style.opacity = "1");
        leftButton.addEventListener("mouseleave", () => leftButton.style.opacity = "0.5");
        rightButton.addEventListener("click", this.handleRight);
        rightButton.addEventListener("mouseover", () => rightButton.style.opacity = "1");
        rightButton.addEventListener("mouseleave", () => rightButton.style.opacity = "0.5");
    }

    start() {
        const timer = () => {
            this.time++;
            this.animationId = requestAnimationFrame(timer);
            if ((1000 / 60) * this.time >= this.delay) {
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
        this.ifArrivedLast();
        this.oImgList.style.transition = `${this.interval}s`;
        this.index++;
        this.oImgList.style.transform = `translate3D(${-this.index * this.width}px,0px,0px)`;
        this.setNavActive();
    }

    setNavActive() {
        this.oNavList.childNodes.forEach((nav, index) => {
            nav.className = "";
            if (this.index % this.imgList.length === index) {
                nav.className += " active";
            }
        })
    }

    handleTouchStart = (e) => {
        this.startX = e.changedTouches[0].pageX;
        this.end();
        this.ifArrivedFirst();
        this.ifArrivedLast();
    }

    handleTouchMove = (e) => {
        const offsetX = e.changedTouches[0].pageX - this.startX;
        this.oImgList.style.transform = `translate3D(${-this.index * this.width + offsetX}px,0px,0px)`;
    }

    handleTouchEnd = (e) => {
        const offsetX = e.changedTouches[0].pageX - this.startX;
        if (Math.abs(offsetX) > 0.3 * this.width) {
            this.index -= offsetX / Math.abs(offsetX);
            this.setNavActive();
        }
        this.oImgList.style.transition = `${this.interval / 1.5}s`;
        this.oImgList.style.transform = `translate3D(${-this.index * this.width}px,0px,0px)`;
    }

    handleLeft = () => {
        this.end();
        this.ifArrivedFirst();
        this.index--;
        this.oImgList.style.transition = `${this.interval}s`;
        this.oImgList.style.transform = `translate3D(${-this.index * this.width}px,0px,0px)`;
        this.setNavActive();
        this.start();
    }

    handleRight = () => {
        this.end();
        this.next();
        this.start();
    }

    ifArrivedFirst() {
        if (this.index === 0) {
            this.index = this.imgList.length;
            this.oImgList.style.transition = "none";
            this.oImgList.style.transform = `translate3D(${-this.index * this.width}px,0px,0px)`;
            //强制刷新浏览器渲染队列
            this.oImgList.offsetWidth;
        }
    }

    ifArrivedLast() {
        if (this.index === this.imgList.length * 2 - 1) {
            this.index = this.imgList.length - 1;
            this.oImgList.style.transition = "none";
            this.oImgList.style.transform = `translate3D(${-this.index * this.width}px,0px,0px)`;
            this.oImgList.offsetWidth;
        }
    }
}