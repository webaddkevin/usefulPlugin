## # HTML5 performance API# ##

 简介
	
Performance API用于精确度量、控制、增强浏览器的性能表现。这个API为测量网站性能，提供以前没有办法做到的精度。

   	
	1.performance.timing对象
	2.performance.now()
	3.performance.mark()
	4.performance.getRntries()  
	5.performance.navigation对象
	


- performance.timing对象 

 
performance对象的timing属性指向一个对象，它包含了各种与浏览器性能有关的时间数据，提供浏览器处理网页各个阶段的耗时。比如，performance.timing.navigationStart就是浏览器处理当前网页的启动时间  
    
    var t = performance.timing;
    var pageloadtime = t.loadEventStart - t.navigationStart;
    var dns = t.domainLookupEnd - t.domainLookupStart;
    var tcp = t.connectEnd - t.connectStart;
    var ttfb = t.responseStart - t.navigationStart; 

通过如上例子可以计算出页面加载的耗时，域名解析的耗时，TCP链接的耗时，读取页面第一个字节之前的耗时

-  performance.now()

performance.now方法返回当前网页自从performance.timing.navigationStart到当前时间之间的微秒数（毫秒的千分之一）。也就是说，它的精度可以达到100万分之一秒。

- performance.mark()

mark方法用于为相应的视点做标记

    window.performance.mark('mark_fully_loaded');

clearMarks用于清除标记，不加参数表示清除所有标记

    window.peformance.clearMarks('mark_fully_loaded');
    window.performance.clearMarks();

- performance.getEntries()

浏览器获取网页时，会对网页中每一个对象（脚本文件、样式表、图片文件等等）发出一个HTTP请求。performance.getEntries方法以数组形式，返回这些请求的时间统计信息，有多少个请求，返回数组就会有多少个成员。

- performance.navigation对象

除了时间信息，performance还可以提供一些用户行为信息，主要都存放在performance.navigation对象上面。

1. performance.navigation.type
	  
      该属性返回一个整数值，表示网页的加载来源
2. performance.navigation.redirectCount

      该属性表示当前网页经过了多少次重定向跳转。