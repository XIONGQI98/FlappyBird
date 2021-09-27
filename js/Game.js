/**
 * 游戏类
 *   @ctx   画布上下文对象
 *   @bird  小鸟对象
 *   @pipe  管道对象
 *   @land  地面对象
 *   @mountain 山脉对象
 * **/
function Game(ctx, bird, pipe, land, mountain) {
    this.ctx = ctx;
    this.bird = bird;
    //存储多个管道
    this.pipeArr = [pipe];
    this.land = land;
    this.mountain = mountain;
    //循环定时器句柄
    this.timebar = null;
    // console.log(ctx);
    //存储画布宽高
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    //计数
    this.frame = 0;
    //计分
    this.score = 0;
    //游戏状态
    this.state = '';
}

//启动方法
Game.prototype.init = function () {
    //启动定时器
    this.startGame();
    //绑定事件
    this.bindEvent();
}

//启动游戏、
Game.prototype.startGame = function () {
    //缓存this
    var me = this;
    //启动定时器绘制页面
    this.timebar = setInterval(function () {
        //增加一帧
        me.frame++;
        //检测像素
        me.check();
        //绘制前清空原有内容
        me.ctx.clearRect(0, 0, me.width, me.height)
        //绘制背景
        me.renderMountain();
        //绘制地面
        me.moveLand();
        me.renderLand();
        //绘制小鸟
        me.moveBird();
        me.renderBird();
        //绘制管道
        me.movePipe();
        me.renderPipe();
        //创建管道
        me.createPipe();
        //删除管道
        me.removePipe();
        // //碰撞检测--地面检测
        // me.checkLand();
        // //碰撞检测--管道检测
        // me.checkPipe();
        //检测游戏是否结束
        me.checkGameOver();

    }, 20)
}

//绘制山
Game.prototype.renderMountain = function () {
    //让山向左移动
    this.mountain.x -= this.mountain.speed;
    //移出画布要重置
    if (this.mountain.x <= -this.mountain.img.width) {
        //重置
        this.mountain.x = 0;
    }
    //绘制
    this.ctx.drawImage(this.mountain.img, this.mountain.x, this.mountain.y)
    //右侧设置一个猫腻图,间隔一个画布宽度
    this.ctx.drawImage(this.mountain.img, this.mountain.x + this.mountain.img.width, this.mountain.y)
    this.ctx.drawImage(this.mountain.img, this.mountain.x + this.mountain.img.width * 2, this.mountain.y)
}

//移动陆地
Game.prototype.moveLand = function () {
    //缓存land
    var land = this.land;
    //让地面向左移动
    land.x -= land.speed;
    //移出画布要重置(全部移出再重置)
    if (land.x <= -land.img.width) {
        //重置
        land.x = 0;
    }
}

//绘制地面
Game.prototype.renderLand = function () {
    // //缓存land
    var land = this.land;
    // //让地面向左移动
    // land.x -= land.speed;
    // //移出画布要重置(全部移出再重置)
    // if (land.x <= -land.img.width) {
    //     //重置
    //     land.x = 0;
    // }
    //绘制图片
    this.ctx.drawImage(land.img, land.x, land.y)
    //右侧设置一个猫腻图,间隔一个画布宽度
    this.ctx.drawImage(land.img, land.x + land.img.width, land.y)
}

//移动小鸟
Game.prototype.moveBird = function () {
    //每5帧改变一次
    if (this.frame % 10 === 0) {
        //让小鸟运动
        this.bird.fly();
    }
    //小鸟运动
    this.bird.flyDown();
}
//绘制小鸟
Game.prototype.renderBird = function () {
    // //每5帧改变一次
    // if (this.frame % 10 === 0) {
    //     //让小鸟运动
    //     this.bird.fly();
    // }
    // //小鸟运动
    // this.bird.flyDown();
    //存储状态
    this.ctx.save();
    //移动坐标系
    this.ctx.translate(this.bird.x, this.bird.y);
    //旋转
    // this.ctx.rotate(Math.PI / 6);
    this.ctx.rotate(this.bird.angle)
    //绘制:围绕新的中心点绘制，因此，左上角的点与坐标原点的距离是1/2宽高
    this.ctx.drawImage(this.bird.img, -this.bird.img.width / 2, -this.bird.img.height / 2);
    //恢复状态
    this.ctx.restore();
}

//绑定事件
Game.prototype.bindEvent = function () {
    //缓存this
    var me = this;
    //点击canvas向上飞,移动端（可以用touch事件）
    this.ctx.canvas.onclick = function () {
        //小鸟往上飞
        me.bird.flyUp();
    }
}

//移动管道
Game.prototype.movePipe = function () {
    for (var i = 0; i < this.pipeArr.length; i++) {//遍历管道
        //缓存管道
        var pipe = this.pipeArr[i];
        //改变横坐标
        pipe.x -= pipe.speed;
    }
}
//绘制管道
Game.prototype.renderPipe = function () {
    //绘制多个管道
    for (var i = 0; i < this.pipeArr.length; i++) {
        // //缓存管道
        var pipe = this.pipeArr[i];
        // //改变横坐标
        // pipe.x -= pipe.speed;
        //绘制上管道
        var upImg = pipe.upImg;
        //图片的xy坐标，以及宽高
        var upImgX = 0;
        var upImgY = upImg.height - pipe.upHeight;
        var upImgWidth = upImg.width;
        var upImgHeight = pipe.upHeight;
        //canvas中绘制时候的x，y坐标以及宽高
        var upX = pipe.x;
        var upY = 0;
        var upWidth = upImgWidth;
        var upHeight = upImgHeight;
        //绘制
        this.ctx.drawImage(upImg, upImgX, upImgY, upImgWidth, upImgHeight, upX, upY, upWidth, upHeight)

        //绘制下管道
        var downImg = pipe.downImg;
        //图片的xy坐标，以及宽高
        var downImgX = 0;
        var downImgY = 0;
        var downImgWidth = downImg.width;
        var downImgHeight = pipe.downHeight;
        //canvas中绘制时候的x，y坐标以及宽高
        var downX = pipe.x;
        var downY = pipe.height - downImgHeight;
        var downWidth = downImgWidth;
        var downHeight = downImgHeight;
        //绘制
        this.ctx.drawImage(downImg, downImgX, downImgY, downImgWidth, downImgHeight, downX, downY, downWidth, downHeight)
    }
}
//创建管道
Game.prototype.createPipe = function () {
    //每70帧绘制一份
    if (this.frame % 70 === 0) {
        //创建管道
        var pipe = this.pipeArr[0].createPipe();
        this.pipeArr.push(pipe);
    }
}
//删除管道
Game.prototype.removePipe = function () {
    //遍历所有管道，如果超出左侧边界，删除之
    // for (var i = this.pipeArr.length - 1; i >= 0; i--) {}
    //最先超出左侧边界的，永远是第一个管道，所以判断第一个管道即可
    var pipe = this.pipeArr[0];
    //判断边界
    if (pipe.x < -pipe.upImg.width) {
        //从数组前面删除成员
        this.pipeArr.shift();
        // console.log(this.pipeArr);
        //增加分数
        this.score++;
    }
}

// //碰撞地面
// Game.prototype.checkLand = function () {
//     //顶部距离地面的高度 - 鸟的y坐标 是否小于 鸟的y坐标的一半
//     if (this.land.y - this.bird.y < this.bird.img.height / 2) {
//         //游戏结束
//         this.gameOver();
//     }
// }

// //碰撞管子
// Game.prototype.checkPipe = function () {
//     //遍历管道
//     for (var i = 0; i < this.pipeArr.length; i++) {
//         //缓存pipe
//         var pipe = this.pipeArr[i];
//         //获取管道宽度的一半
//         var halfPipe = pipe.upImg.width / 2;
//         //管道中心线的横坐标
//         var centerLineX = pipe.x + halfPipe;
//         //上下管道的y坐标=上下管道高度
//         var upHeight = pipe.upHeight;
//         var downHeight = pipe.height - pipe.downHeight;
//         //小鸟的横纵坐标
//         var x = this.bird.x;
//         var y = this.bird.y;
//         //小鸟宽高的一半
//         var halfWidth = this.bird.img.width / 2;
//         var halfHeight = this.bird.img.height / 2;
//         // console.log(halfWidth, halfHeight, centerLineX, upHeight, downHeight)
//         //分别比较上下管道
//         // 比较上管道:条件：
//         // 小鸟y坐标 < 上管道高度 + 小鸟高度/2
//         // 小鸟x坐标到中心线的距离 < (管道高度 + 小鸟宽度)/2
//         //由于图片有透明区域，实际判定区域会大于小鸟实际宽高，所以-5缩小误差
//         if ((y < upHeight + halfHeight - 5) && (Math.abs(x - centerLineX) < (halfWidth + halfPipe - 5))) {
//             this.gameOver()
//         }// 比较下管道：条件
//         // 小鸟y坐标 > 地面高度 - 下管道高度 - 小鸟高度/2
//         // 小鸟x坐标到中心线的距离 < (管道高度 + 小鸟宽度)/2
//         if ((y > downHeight - halfHeight + 5) && (Math.abs(x - centerLineX) < (halfWidth + halfPipe - 5))) {
//             this.gameOver()
//         }
//     }
// }

//检测像素是否重合
Game.prototype.check = function () {
    //存储状态
    this.ctx.save();
    //清空画布
    this.ctx.clearRect(0, 0, this.width, this.height);
    //绘制陆地
    this.renderLand();
    //绘制管道
    this.renderPipe();
    //更改模式:让鸟与陆地和管道做融合；
    this.ctx.globalCompositeOperation = 'source-in';
    //绘制小鸟
    this.renderBird();
    //获取数据
    var result = this.ctx.getImageData(0, 0, this.width, this.height);
    //查找重合像素点
    for (var i = 0, len = result.data.length; i < len; i++) {
        //判断像素点是否有值
        if (result.data[i]) {
            this.state = 'over';//游戏结束
            // return;
            break;
        }
    }
    //恢复状态
    this.ctx.restore();
}

//检测游戏是否结束
Game.prototype.checkGameOver = function () {
    //判断游戏状态
    if (this.state === 'over') {
        this.gameOver();
    }
}

//游戏结束
Game.prototype.gameOver = function () {
    //清空定时器
    clearInterval(this.timebar);
    //提示分数
    console.log(this.score);
}

