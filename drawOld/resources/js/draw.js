/**
 * Created by jcf on 2017/2/6.
 */
    //抽奖
var canvasW = (window.innerWidth >= 750?375:window.innerWidth);
var canvasH = canvasW;
var r = canvasW / 2;
$('#wheelcanvas').attr('width',canvasW+'px').attr('height',canvasH+'px');
var turnplate={
    restaraunts:[],				//大转盘奖品名称
    colors:[],					//大转盘奖品区块对应背景颜色
    outsideRadius:r-26,			//大转盘外圆的半径
    textRadius:r-56,				//大转盘奖品位置距离圆心的距离
    insideRadius:r-143,			//大转盘内圆的半径
    startAngle:0,				//开始角度

    bRotate:false				//false:停止;ture:旋转
};

function resetUI(){
    var rate = canvasW/375;
    $('.drawTopBg').css({
        height:rate*354+'px',
        width:canvasH+'px'
    });

    $('.endPop').css({
        height: rate*162+'px',
        top:rate*240+'px',
        left: rate*26+'px'
    });

    // var bgH = rate*1182
    // $('.bg').css({
    //     width:'100%',
    //     height:bgH+'px',
    //     background:'rgba(0,0,0,0.49)',
    //     position:'absolute',
    //     zIndex:'999',
    //     left:0,
    //     top:0
    // })

    $('.titleTxt').css({
        left:rate*59+'px',
        top:rate*34.2+'px'
    });

    $('.nowIntegral').css({
        height:rate*44.2+'px',
        left:rate*102+'px',
        top:rate*92+'px'
    });

    $('.everyIntegral').css({
        left:rate*147+'px',
        top:rate*142+'px'
    });

    $('.turnplate').css({
        top:rate*164+'px'
    });

    $('.shadow').css({
        height:rate*21+'px',
        left:rate*103+'px',
        top:rate*438+'px'
    });

    $('.txt').css({
        top:rate*478+'px'
    });
    $('.mainContent').css('display','block')
}

$(document).ready(function(){
    resetUI();
    turnplate.restaraunts = ["1000元现金", "100元网费", "30元网费", "20元优惠券", "180积分", "80积分"];
    turnplate.colors = ["#FFF4D6", "#FFFFFF", "#FFF4D6", "#FFFFFF","#FFF4D6", "#FFFFFF"];

    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function (item, txt){
        var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
        if(angles<270){
            angles = 270 - angles;
        }else{
            angles = 360 - angles + 270;
        }
        var deflection = 360 / turnplate.restaraunts.length /2
        angles = rnd(angles-deflection,angles+deflection)
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle:0,
            animateTo:angles+1800,
            duration:8000,
            callback:function (){
                console.log(txt)
                alert(txt);
                turnplate.bRotate = !turnplate.bRotate;
            }
        });
    };

    $('.pointer').click(function (){
        if(turnplate.bRotate)return;
        turnplate.bRotate = !turnplate.bRotate;
        //获取随机数(奖品个数范围内)
        var item = rnd(1,turnplate.restaraunts.length);
        rotateFn(item, turnplate.restaraunts[item-1]);
        console.log(item);
    });
});

function rnd(n, m){
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;

}

function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length/2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0,0,canvasW,canvasW);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '16px Microsoft YaHei';
        for(var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(r, r, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(r, r, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //----绘制奖品开始----
            ctx.fillStyle = "#E5302F";
            var text = turnplate.restaraunts[i];
            var line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(r + Math.cos(angle + arc / 2) * turnplate.textRadius, r + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);


            //添加对应图标
            if(text.indexOf("优惠券")>0||text.indexOf("网费")>0){
                var img= document.getElementById("coupon");
                img.onload=function(){
                    ctx.drawImage(img,-15,10);
                };
                ctx.drawImage(img,-15,10);
            }else if(text.indexOf("现金")>0){
                var img= document.getElementById("redPacket");
                img.onload=function(){
                    ctx.drawImage(img,-15,10);
                };
                ctx.drawImage(img,-14,10);
            }else if(text.indexOf("积分")>0){
                var img= document.getElementById("integral");
                img.onload=function(){
                    ctx.drawImage(img,-15,10);
                };
                ctx.drawImage(img,-15,10);
            }
            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
            //----绘制奖品结束----
        }
    }
}

//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload=function(){
    drawRouletteWheel();
};




//    中奖公告栏
var doscroll = function(){
    var $parent = $('.js-slide-list');
    var $first = $parent.find('li:first');
    var height = $first.height();
    $first.animate({
        height: 0
    }, 1000, function() {
        $first.css('height', height).appendTo($parent);
    });
};
var timer = setInterval(function(){doscroll()}, 2000);
$('.js-slide-list').mouseover(function(){
    clearInterval(timer);
    timer = null;
}).mouseout(function(){
    timer = setInterval(function(){doscroll()}, 2000)
})
