/**
 * Created by jcf on 2017/2/6.
 */
    //抽奖
var canvasW = (window.innerWidth >= 750?375:window.innerWidth);
var canvasH = canvasW;
var r = canvasW / 2;
var timer;
var giftList;
var lotteryCount;

function data(){
    var urlParameters = location.search;
    var requestParameters = new Object();
    if (urlParameters.indexOf('?') != -1)
    {
        var parameters = decodeURI(urlParameters.substr(1));
        parameterArray = parameters.split('&');
        for (var i = 0; i < parameterArray.length; i++) {
            requestParameters[parameterArray[i].split('=')[0]] = (parameterArray[i].split('=')[1]);
        }
    }
    return requestParameters;
}
var lotteryId = data().lotteryId;
var userId =  data().userId;
var storeId = data().storeId;

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
$.ajax({
    type: 'POST',
    url: "https://dwdsapi.dianwandashi.com/openapi/activityBean/v1/getUserLotteryById",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify({
        lotteryId:lotteryId,
        userId:userId,
        storeId:storeId
    })
    ,
    success: function (data) {
        if (data.ret_code * 1 == 0) {
            var drawdata = data.ret_module;
            lotteryCount = drawdata.lotteryCount;
            if(lotteryCount == 0){
                $('.pointer').attr('src','https://metadata.zhutech.net/o_1bud3hk8v162m1nml1snfb97pj8r.png');
            }
            giftList = drawdata.giftList;
            $('.nowIntegral span').html(lotteryCount);
            $('.titleTxt span').html(drawdata.storeName);
            $('.chargeAmount').html(drawdata.chargeAmount);
            $.each(giftList,function(index,obj){
                var award_desc = obj.award_desc;
                if(obj.award_type==0){
                    award_desc = award_desc + '游戏币'
                }
                if(obj.award_type==1){
                    $('.redPacket').attr('src',obj.photo)
                }
                turnplate.restaraunts.push( award_desc);
                turnplate.colors.push('#ffffff')
            });
            drawRouletteWheel();
            var logList = drawdata.logList;
            $.each(logList,function(index,obj){
                var li = '<li>' +
                    '<p>幸运用户 '+obj.name+ ' 在 '+getResetTime(obj.create_time)+'</p>' +
                    '<p class="smokePrize">抽中了 '+obj.award_desc+'</p>' +
                    '</li>'
                $('.slide-list').append(li)
            });
            if(document.querySelectorAll('.slide-list li').length>5){
                timer = setInterval(function(){doscroll()}, 3000);
            }else{
                $('.slide-container').css({
                    height:document.querySelectorAll('.slide-list li').length*60+'px'
                })
            }

        }
    }
})


function resetUI(){
    var rate = canvasW/375;
    $('.drawTopBg').css({
        height:rate*354+'px',
        width:canvasH+'px'
    });

    $('.endPop').css({
        top:rate*240+'px',
    });

    $('.endPop img').css({
        marginTop:rate*27+'px',
        marginBottom:rate*51+'px'
    });
    $('.titleTxt').css({
        height:rate*74+'px',
        lineHeight:rate*82+'px'
    });

    $('.nowIntegral').css({
        height:rate*26+'px',
        top:rate*78+'px',
        lineHeight:rate*26+'px'
    });
    $('.nowIntegral span').css({
        height:rate*26+'px'
    });
    $('.everyIntegral').css({
        left:rate*147+'px',
        top:rate*142+'px'
    });

    $('.turnplate').css({
        top:rate*124+'px'
    });

    $('.pedestal').css({
        top:rate*420+'px'
    })
    $('.myPrize').css({
        top:rate*508+'px'
    })
    $('.rechargeWarn').css({
        top:rate*562+'px'
    })
    $('.item-1').css({
        top:rate*124+'px',
        left:rate*(-20)+'px'
    })
    $('.item-2').css({
        top:rate*113+'px',
        right:rate*10+'px'
    })
    $('.item-3').css({
        top:rate*392+'px',
        left:rate*10+'px'
    })
    $('.item-4').css({
        top:rate*358+'px',
        right:rate*5+'px'
    })
    $('.txt').css({
        top:rate*615+'px'
    });
    $('.mainContent').css('display','block')
}

function getResetTime(time){
    var datatime = new Date(time);
    var datatimeY = datatime.getFullYear()+'-';
    var datatimeM = (datatime.getMonth()+1 < 10 ? '0'+(datatime.getMonth()+1) : datatime.getMonth()+1) + '-';
    var datatimeD = datatime.getDate() + ' ';
    var h = (datatime.getHours()<10?'0'+datatime.getHours():datatime.getHours()) + ':';
    var m = (datatime.getMinutes()<10?'0'+datatime.getMinutes():datatime.getMinutes()) + ':';
    var s = datatime.getSeconds()<10?'0'+datatime.getSeconds():datatime.getSeconds();
    return datatimeY+datatimeM+datatimeD+h+m+s;
}
// function resetNick(nick){
//     var nick = nick+'';
//     var newNick  = nick.substring(0,3)+'****'+nick.substring(8,11);
//     return newNick
// }
$(document).ready(function(){
    resetUI();
    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function (item, txt){
        var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
        if(angles<270){
            angles = 270 - angles;
        }else{
            angles = 360 - angles + 270;
        }
        var deflection = 360 / turnplate.restaraunts.length /2
        angles = rnd(angles-deflection+5,angles+deflection-5)
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle:0,
            animateTo:angles+1800,
            duration:8000,
            callback:function (){
                $('.bg').show()
                $('.endPop').fadeIn();
                turnplate.bRotate = !turnplate.bRotate;
                $('.pointer').removeClass('disbledClick').addClass('canClick')
                if(lotteryCount != 0){
                    $('.pointer').attr('src','https://metadata.zhutech.net/o_1bua3r43v1bid5b71bvftqj14mdr.png');
                }
            }
        });
    };

    $('.pointer').click(function (){
        if($(this).hasClass('canClick')) {
            $(this).attr('src','https://metadata.zhutech.net/o_1bud3hk8v162m1nml1snfb97pj8r.png');
            $(this).removeClass('canClick').addClass('disbledClick');
            if (turnplate.bRotate)return;
            turnplate.bRotate = !turnplate.bRotate;
            //获取随机数(奖品个数范围内)

            $.ajax({
                type: 'POST',
                url: "https://dwdsapi.dianwandashi.com/openapi/activityBean/v1/lotteryDraw",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    lotteryId:lotteryId,
                    userId:userId,
                    storeId:storeId
                })
                ,
                success: function (data) {
                    console.log(data)
                    if (data.ret_code * 1 == 0) {
                        var lotteryDrawId = data.ret_module.lotteryDrawId;
                        var awardType = data.ret_module.awardType;
                        var awardDesc = data.ret_module.awardDesc;
                        if(awardType==0){
                            $('#sure').show();
                            $('#gotoH5').hide();
                            $('#copy').hide();
                            $('.copy').hide();
                            $('#receptionGet').hide();
                            $('.endPop img').show();
                            $('#canvascode').hide();
                            awardDesc = '游戏币×'+awardDesc;
                            $('.endPop img').attr('src','https://metadata.zhutech.net/o_1buapricnmnk15nv15c76cjrvum.png')
                        }else if(awardType==1){
                            if(window.__wxjs_environment === 'miniprogram'){
                                $('#sure').hide();
                                $('#gotoH5').hide();
                                $('#copy').show();
                                $('.copy').show();
                                $('#receptionGet').hide();
                                $('.endPop img').show();
                                $('#canvascode').hide();
                                $('#copy').attr('data-clipboard-text',data.ret_module.awardUrl);
                                var btn = document.getElementById('copy');
                                var clipboard = new Clipboard(btn);
                            }else{
                                $('#copy').hide();
                                $('.copy').hide();
                                $('#sure').hide();
                                $('#gotoH5').show();
                                $('#receptionGet').hide();
                                $('.endPop img').show();
                                $('#canvascode').hide();
                                $('.endPop img').attr('src',data.ret_module.photo)
                                $('#gotoH5').click(function(){
                                    clientObj.gotoUrl( awardDesc+'领取' ,data.ret_module.awardUrl);
                                })
                            }
                        }else if(awardType==2){
                            $('#copy').hide();
                            $('.copy').hide();
                            $('#sure').hide();
                            $('#gotoH5').hide();
                            $('#receptionGet').show();
                            $('.endPop img').attr('src','https://metadata.zhutech.net/o_1bud1f65g11gbbvq1epccn5t89m.png');
                            $('.endPop img').hide();
                            var scanCode = data.ret_module.scanCode;
                            JsBarcode("#canvascode", scanCode, {
                                format: "CODE39",//选择要使用的条形码类型
                                width:1,//设置条之间的宽度
                                height:100,//高度
                                displayValue:true,//是否在条形码下方显示文字
                                text:scanCode,//覆盖显示的文本
                                // fontOptions:"bold italic",//使文字加粗体或变斜体
                                font:"fantasy",//设置文本的字体
                                textAlign:"center",//设置文本的水平对齐方式
                                textPosition:"bottom",//设置文本的垂直位置
                                textMargin:5,//设置条形码和文本之间的间距
                                fontSize:15,//设置文本的大小
                                background:"#fff",//设置条形码的背景
                                lineColor:"#000",//设置条和文本的颜色。
                                margin:15//设置条形码周围的空白边距
                            });
                            $('#canvascode').show()
                        }
                        $('.artxt').html(awardDesc);
                        lotteryCount = data.ret_module.lotteryCount;
                        if(lotteryCount == 0){
                            $('.pointer').attr('src','https://metadata.zhutech.net/o_1bud3hk8v162m1nml1snfb97pj8r.png');
                        }
                        $('.nowIntegral span').html(lotteryCount)
                        $.each(giftList, function (index, obj) {
                            if (obj.id == lotteryDrawId) {
                                rotateFn(index + 1, turnplate.restaraunts[index]);
                            }
                        })

                    }else{
                        $('.pointer').removeClass('disbledClick').addClass('canClick')
                        alert(data.ret_msg);
                    }
                }
            })
        }


        // var item = rnd(1,turnplate.restaraunts.length);
        // rotateFn(item, turnplate.restaraunts[item-1]);
        // console.log(item);
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
        ctx.font = '12px Microsoft YaHei';

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
            ctx.fillStyle = '#302C85';
            var text = turnplate.restaraunts[i];
            var line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(r + Math.cos(angle + arc / 2) * turnplate.textRadius, r + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            ctx.fillText(text, -ctx.measureText(text).width / 2, 40);


            //添加对应图标
            $.each(giftList,function(index,obj){
                if(obj.award_type==1&&obj.award_desc == text){
                    var img = new Image();
                    img.onload=function(){
                    };
                    img.src = obj.photo;
                    ctx.drawImage(img,-20,-20,40,40);
                }else if(obj.award_type==2&&obj.award_desc == text){
                    var img= document.getElementById("coupon");
                        img.onload=function(){
                            ctx.drawImage(img,-20,-20,40,40);
                        };
                        ctx.drawImage(img,-20,-20,40,40);
                }else if(obj.award_type==0&&(obj.award_desc+'游戏币')==text){
                    var img= document.getElementById("integral");
                        img.onload=function(){
                            ctx.drawImage(img,-20,-20,40,40);
                        };
                        ctx.drawImage(img,-20,-20,40,40);
                }
            })


            // if(text.indexOf("优惠券")>0||text.indexOf("网费")>0){
            //     var img= document.getElementById("coupon");
            //     img.onload=function(){
            //         ctx.drawImage(img,-20,-20,40,40);
            //     };
            //     ctx.drawImage(img,-20,-20,40,40);
            // }else if(text.indexOf("现金")>0){
            //     var img= document.getElementById("redPacket");
            //     img.onload=function(){
            //         ctx.drawImage(img,-20,-20,40,40);
            //     };
            //     ctx.drawImage(img,-20,-20,40,40);
            // }else if(text.indexOf("积分")>0){
            //     var img= document.getElementById("integral");
            //     img.onload=function(){
            //         ctx.drawImage(img,-20,-20,40,40);
            //     };
            //     ctx.drawImage(img,-20,-20,40,40);
            // }
            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
            //----绘制奖品结束----
        }
    }
}

//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload=function(){
    // drawRouletteWheel();
    var bgH = parseFloat($('.txt').css('top'))+ $('.txt').height()
    $('.bg').css({
        width:'100%',
        height:bgH+'px',
        background:'rgba(0,0,0,0.49)',
        position:'absolute',
        zIndex:'999',
        left:0,
        top:0
    })
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

$('.js-slide-list').mouseover(function(){
    clearInterval(timer);
    timer = null;
}).mouseout(function(){
    timer = setInterval(function(){doscroll()}, 2000)
});

//点击关闭弹窗
$('.closeEndPop').click(function(){
    $('.bg').hide();
    $('.endPop').hide();
});
$('#sure').click(function(){
    $('.bg').hide();
    $('.endPop').hide();
});
$('#receptionGet').click(function(){
    $('.bg').hide();
    $('.endPop').hide();
});

$('.myPrize').click(function(){

    if(window.__wxjs_environment === 'miniprogram'){
        wx.miniProgram.navigateTo({url: '../drawRecordBox/drawRecordBox?lotteryId='+lotteryId+'&userId='+userId+'&storeId='+storeId})
    } else{
        clientObj.gotoUrl('我的奖品','https://dwdsapi.dianwandashi.com/draw/drawRecord.html?lotteryId='+lotteryId+'&userId='+userId+'&storeId='+storeId)
    }
});
