/**
 * 管道类：
 *   @upImg，downIme    上下管道图片
 *   @speed             运动速度
 *   @x                 初始时的横坐标，（画布的宽度），要从画布的右侧进入
 *   @height            地面距离空洞的高度
 *
 * **/
function Pipe(upImg, downImg, speed, x, height) {
    this.upImg = upImg;
    this.downImg = downImg;
    this.speed = speed;
    this.x = x;
    this.height = height;
    // 初始化的位置就是画布的宽度
    this.width = x;
    //上下管道的高度,至少为10，并且管道之间至少留出150px的空隙
    this.upHeight = 10 + (height - 150 - 20) * Math.random();
    this.downHeight = height - 150 - this.upHeight;
}
//创建管道的方法
Pipe.prototype.createPipe = function () {
    // 创建管道
    return new Pipe(this.upImg, this.downImg, this.speed, this.width, this.height)
}