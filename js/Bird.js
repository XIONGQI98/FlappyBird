/**
 * 小鸟类
 * @imgArry 小鸟图片
 * @x，y    小鸟横纵坐标
 *
 * **/
function Bird(imgArry, x, y) {
    //存储信息
    this.imgArry = imgArry;
    this.x = x;
    this.y = y;
    //当前图片的索引值
    this.index = 0;
    this.img = this.imgArry[this.index];
    //鸟速
    this.speed = 1;
    //方向
    this.direction = 'DOWN';
    //角度
    this.angle = 0;
}
//让小鸟飞
Bird.prototype.fly = function () {
    //改变索引值
    this.index++;
    //边界处理
    if (this.index >= this.imgArry.length) {
        //重置
        this.index = 0;
    }
    //改变当前图片
    this.img = this.imgArry[this.index];
}
//让小鸟往下飞
Bird.prototype.flyDown = function () {
    //计算角度
    var deg = Math.PI / 180 * this.speed;
    // 判断方向
    if (this.direction === 'DOWN') {
        //往下飞
        //角度与方向有关系
        this.angle = deg;
        //改变速度(越来越快)
        this.speed++;
        //改变y坐标
        this.y += Math.sqrt(this.speed);
    } else {
        //向上飞
        //角度与方向有关系
        this.angle = -deg;
        //速度逐渐降低
        this.speed--;
        //降低到0的时候往下飞
        if (this.speed <= 0) {
            this.direction = 'DOWN';
            //开始往下飞，不需要执行往上飞的逻辑
            return;
        }
        this.y -= Math.sqrt(this.speed);


    }

}

//小鸟往上飞
Bird.prototype.flyUp = function () {
    //改变方向
    this.direction = 'UP';
    //一开始有一个高速度
    this.speed = 25;


}