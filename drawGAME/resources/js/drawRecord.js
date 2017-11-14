/**
 * Created by jcf on 2017/11/7.
 */
$('.weui-dialog__btn').click(function(){
    $('#alert_box').hide();
    $('.weui-dialog__bd').html('');
    $('.weui-dialog__title').html('提示')
})

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
function creatTime(time){
    var timeRub = new Date(time)
    var year = timeRub.getFullYear()
    var month = timeRub.getMonth() + 1 < 10 ? '0' + (timeRub.getMonth() + 1):timeRub.getMonth() + 1;
    var date = timeRub.getDate() < 10 ? '0' + timeRub.getDate():timeRub.getDate();
    var hour = timeRub.getHours() < 10 ? '0' +  timeRub.getHours():timeRub.getHours();
    var mintues = timeRub.getMinutes() < 10 ? '0' + timeRub.getMinutes() :timeRub.getMinutes() ;
    return year+'.'+month+'.'+date+' '+hour+':'+mintues
}
var lotteryId = data().lotteryId;
var userId =  data().userId;
var storeId = data().storeId;
var page = 0;
var size = 10;
var isNodata=false;
$('#wrapper').css({
    height:window.innerHeight+'px'
});
$('#wrapper').dropload({
    domUp: {
        domClass: 'dropload-up',
        domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
        domUpdate: '<div class="dropload-update">↑释放更新</div>',
        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
    },
    domDown: {
        domClass: 'dropload-down',
        domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
        domNoData: '<div class="dropload-noData">已经到底啦</div>'
    },
    loadUpFn : function(me){
        $.ajax({
            type: 'POST',
            url: "https://dwdsapi.dianwandashi.com/openapi/activityBean/v1/getLotteryLogByUserId",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                lotteryId:lotteryId,
                userId:userId,
                storeId:storeId,
                page:page,
                pageSize:size
            }),
            success:function(res){
                if(res.ret_code*1==0){
                    $('.listContainer').html('');
                    var logList = res.ret_module.logList;
                    $.each(logList,function(index,obj){
                        var span1;
                        if(obj.award_type==0){
                            span1 = '<span>抽中了 '+obj.award_desc+'游戏币</span>';
                        }else{
                            span1 = '<span>抽中了 '+obj.award_desc+'</span>';
                        }
                        var span2 = '<span>'+creatTime(obj.create_time)+'</span>';
                        var span3;
                        if(obj.scan_code==""){
                            span3 = "<span></span>"
                        }else{
                            if(obj.status == 0){
                                span3 = "<button type='button' data-scancode='"+obj.scan_code+"'>领奖码</button>"
                            }
                        }
                        var li = '<li>' +span1+span2+span3 + '</li>';
                        $('.listContainer').append(li)
                    });
                    if(logList.length<size){
                        me.noData()
                        me.lock();
                    }

                }else if(res.ret_code==500){
                    $('.weui-dialog__bd').html(res.ret_msg);
                    $('#alert_box').show();
                }
                me.resetload();
                page=0;
                me.unlock();
                me.noData(false);

            },
            error:function(){
                $('.weui-dialog__bd').html('接口错误');
                $('#alert_box').show();
                me.resetload();

            }
        })
    },
    loadDownFn: function (me) {
        // 拼接HTML
        page++;
        $.ajax({
            type: 'POST',
            url: "https://dwdsapi.dianwandashi.com/openapi/activityBean/v1/getLotteryLogByUserId",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                lotteryId:lotteryId,
                userId:userId,
                storeId:storeId,
                page:page,
                pageSize:size
            }),
            success:function(res){
                if(res.ret_code*1==0){
                    var logList = res.ret_module.logList;

                    $.each(logList,function(index,obj){
                        var span1;
                        if(obj.award_type==0){
                            span1 = '<span>抽中了 '+obj.award_desc+'游戏币</span>';
                        }else{
                            span1 = '<span>抽中了 '+obj.award_desc+'</span>';
                        }
                        var span2 = '<span>'+creatTime(obj.create_time)+'</span>';
                        var span3;
                        if(obj.scan_code==""){
                            span3 = "<span></span>"
                        }else{
                            if(obj.status == 0){
                                span3 = "<button type='button' class='gotoscancode' data-scancode='"+obj.scan_code+"'>领奖码</button>"
                            }
                        }
                        var li = '<li>' +span1+span2+span3 + '</li>';
                        $('.listContainer').append(li)
                    })
                    if(logList.length<size){
                        me.noData()
                        me.lock();
                    }

                }else if(res.ret_code==500){
                    $('.weui-dialog__bd').html(res.ret_msg);
                    $('#alert_box').show();
                }
                me.resetload();

            },
            error:function(){
                $('.weui-dialog__bd').html('接口错误');
                $('#alert_box').show();
                me.resetload();

            }
        })

    },
    threshold: 50
});
$('.container').on('click','.gotoscancode',function(){
    var scancode = $(this).attr('data-scancode');

    JsBarcode("#canvascode", scancode, {
        format: "CODE39",//选择要使用的条形码类型
        width:0.9,//设置条之间的宽度
        height:100,//高度
        displayValue:true,//是否在条形码下方显示文字
        text:scancode,//覆盖显示的文本
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
    $('.bg').css({
        height:$('.container').height()+'px',
        display:'block'
    })
    $('.scancode').show()

})
$('#sure').click(function(){
    $('.scancode').hide();
    $('.bg').hide();
})



