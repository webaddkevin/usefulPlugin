/**
 * Created by jcf on 2017/7/24.
 */
$(function(){
    var windowW = window.innerWidth>750?375:window.innerWidth;
    $('.three_box').height(windowW*0.86 +'px').css({
        background:"url('https://metadata.zhutech.net/o_1blp6pko799amt3dlbvem2llr.png')  no-repeat center center",
        backgroundSize:'cover'
    });
    $('.draw_main').css({
        height:windowW*0.86*0.86+'px',
        width:'86%',
        left:'7%',
        top:windowW*0.86*0.06+'px'
    });

    var lottery = {
        drawData:[
            {
                img:'resources/img/pspplay.png',
                text:'psp3000'
            },
            {
                img:'resources/img/travelticket.png',
                text:'千元旅游卡'
            },
            {
                img:'resources/img/movieticket.png',
                text:'格拉瓦电影票'
            },
            {
                img:'resources/img/onlineinvite.png',
                text:'妹子线上陪玩一局'
            },

            {
                img:'resources/img/goldticket.png',
                text:'英雄联盟点券1000'
            },

            {
                img:'resources/img/10money.png',
                text:'10元网费'
            },
            {
                img:'resources/img/80ticket.png',
                text:'80积分'
            },
            {
                img:'resources/img/120ticket.png',
                text:'120积分'
            }
        ],
        btnUrl:'resources/img/clickBtnDraw.png',
        index:-1,	//当前转动到哪个位置，起点位置
        count:0,	//总共有多少个位置
        timer:0,	//setTimeout的ID，用clearTimeout清除
        speed:20,	//初始转动速度
        times:0,	//转动次数
        cycle:50,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
        prize:-1,	//中奖位置
        rollObj:'.draw_main',
        init:function(){
            var lottery = this.rollObj;
            if ($(lottery).find(".draw_li").length>0) {
                $units = $(lottery).find(".draw_li");
                this.count = $units.length;
                $(lottery).find(".draw_li-"+this.index).addClass("active");
            };
        },
        roll:function(){
            var index = this.index;
            var count = this.count;
            var lottery = this.rollObj;
            $(lottery).find(".draw_Li-"+index).removeClass("active");
            index += 1;
            if (index>count-1) {
                index = 0;
            };
            $(lottery).find(".draw_Li-"+index).addClass("active");
            this.index=index;
            return false;
        },
        stop:function(index){
            this.prize=index;
            return false;
        },
        creatDrawBox:function(){
            var self = this;
            $.each(this.drawData,function(index,obj){
                switch (index){
                    case 3:index=7;
                    break;
                    case 4:index=3;
                        break;
                    case 5:index=6;
                        break;
                    case 6:index=5;
                        break;
                    case 7:index=4;
                        break;
                }
                var drawLi = $('<li class="draw_li draw_Li-'+index+'">'+
                    '<dl>'+
                    '<dt>'+
                    '<img src="'+obj.img+'">'+
                    '</dt>'+
                    '<dd>'+obj.text+'</dd>'+
                    '</dl>'+
                    '</li>');
                if(index==3){
                    drawLi = $(' <li id="clickBtn">'+
                        '<img src="'+self.btnUrl+'">'+
                        '</li>'+
                        '<li  class="draw_li draw_Li-'+index+'">'+
                        '<dl>'+
                        '<dt>'+
                        '<img src="'+obj.img+'">'+
                        '</dt>'+
                        '<dd>'+obj.text+'</dd>'+
                        '</dl>'+
                        '</li>'
                    );
                }
                $('.draw_main').append(drawLi);
            });
            $('.draw_main li').css({
                height:windowW*0.86*0.86*0.32+'px'
            });
            $('.draw_main li').eq(3).css({
                marginTop:windowW*0.86*0.86*0.02+'px',
                marginBottom:windowW*0.86*0.86*0.02+'px'
            });
            $('.draw_main li').eq(4).css({
                marginTop:windowW*0.86*0.86*0.02+'px',
                marginBottom:windowW*0.86*0.86*0.02+'px'
            });
            $('.draw_main li').eq(5).css({
                marginTop:windowW*0.86*0.86*0.02+'px',
                marginBottom:windowW*0.86*0.86*0.02+'px'
            });
        }
    }
    function goroll(){
        lottery.times +=1;
        lottery.roll();
        if(lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index){
            clearTimeout(lottery.timer);
            lottery.prize = -1;
            lottery.times = 0;
            click = false;
        }else{
            if (lottery.times<lottery.cycle) {
                lottery.speed -= 10;
            }else if(lottery.times==lottery.cycle) {
                //var index = Math.random()*(lottery.count)|0;
                //lottery.prize = index;
            }else{
                if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
                    lottery.speed += 110;
                }else{
                    lottery.speed += 20;
                }
            }
            if (lottery.speed<40) {
                lottery.speed=40;
            };
            // console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
            lottery.timer = setTimeout(goroll,lottery.speed);
        }
        return false;
    }
    var click = false;
    lottery.creatDrawBox();
    lottery.init('.draw_main');
    $('.draw_main').delegate('#clickBtn','click',function(){
        //中奖位置
        lottery.stop(1);
        if (click) {
            return false;
        }else{
            lottery.speed=100;
            goroll();
            click=true;
            return false;
        }
    });


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
    if($('.js-slide-list').children('li').length>7){
        var timer = setInterval(function(){doscroll()}, 2000);
    }
    $('.js-slide-list').mouseover(function(){
        clearInterval(timer);
        timer = null;
    }).mouseout(function(){
        timer = setInterval(function(){doscroll()}, 2000)
    })

});