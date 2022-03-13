## 如何使用
1. 引入文件
```html
<link rel="stylesheet" type="text/css" href="./Swiper.css">
<script src="./Swiper.js"></script>
```
2. 实例化 Swiper 对象，绑定 DOM 容器，配置参数，轮播图会自动填满容器
```JavaScript
const swiper = new Swiper(root, {
    //imgList：图片数组，必填，src 图片所在位置，alt 图片代替文字
    imgList: [
        { src: "./picture1", alt: "picture1" },
        { src: "./picture2", alt: "picture2" },
        { src: "./picture3", alt: "picture3" },
        { src: "./picture4", alt: "picture4" }
    ],
    //delay: 轮播图多久切换一次，选填，默认为 3000ms
    delay: 3000,
    //interval: 切换图片过渡时间，选填，默认 1.5s
    interval: 1.5
});
```
## 功能
- 对传入的图片轮播
- 向左、向右切换按钮
- 移动端支持滑动切换图片
- 页面进入后台停止轮播，节约性能
## 如何实现
### 布局
1. 设轮播图组件为一个图片大小，将超出的内容隐藏
2. 组件中需要有一个图片列表容器，根据传入的图片数量动态生成大小，比如传了 4 张图片，那就是 4 张图片宽，图片依次水平排列
3. 因为最外层轮播图组件只展示一个图片大小的内容，所以其余图片会被隐藏
4. 每次切换图片只需要让图片列表容器移动，比如从第一张图片切换第二张图片，只需要将图片列表容器向左偏移一个图片的宽度
### 无缝切换与边界判断
>轮播图到达最后一张图片如果直接回到第一张图片会倒退回去，视觉体验差
1. 将图片列表容器里的图片再复制一组加到第一组后面
2. 当图片到达第一张的时候让他到第二组第一张，当图片到达最后一张的时候转到第一组最后一张，这个过程中禁用过渡
3. 这样每张图片左右都有图片切换，且过渡动画更合理
### 移动端触摸事件
1. 在 touchstart 事件中记录手指坐标，在 touchmove 事件中用当前手指坐标减去 touchstart 事件中的手指坐标就得到了一个偏移量
2. 当前图片列表容器总偏移量加上这个偏移量实现图片来回滑动效果
3. 在 touchend 事件中判断当偏移量达到多少时切换下一张，否则回弹回原位置
### 页面禁用后台停止播放
1. 使用 **requestAnimationFrame** 代替 setInterval ,该 API 会在浏览器下一次渲染前调用，页面进入后台后会停止
2. 浏览器渲染频率为每秒 60 次，所以调用一次 requestAnimationFrame 走过 1000/60 ms
3. 在外部记录调用次数，调用次数乘以 1000/60 就是经过的时间，当经过时间达到轮播图切换时间，就执行切换逻辑
```JavaScript
const timer = () => {
    this.time++;
    this.animationId = requestAnimationFrame(timer);
    if ((1000 / 60) * this.time >= this.delay) {
        this.time = 0;
        this.next();
    }
}
this.animationId = requestAnimationFrame(timer);
```
## 遇到的坑
当图片到最后一张的时候我们需要禁用过渡，跳转到第一组最后一张图片，然后开启过渡播放到下一张，但浏览器渲染队列优化导致合并了连续修改的过渡
### 如何解决？
通过读取**计算属性**强制刷新浏览器渲染队列，如 offsetWidth , offsetHeight
