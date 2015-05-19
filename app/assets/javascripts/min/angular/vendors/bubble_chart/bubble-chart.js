!function(a,b){"function"==typeof define&&define.amd?define(["microplugin"],b):"object"==typeof exports?module.exports=b(require("microplugin")):a.BubbleChart=b(a.MicroPlugin)}(this,function(a){var b=2*Math.PI;return d3.svg.BubbleChart=function(a){var b=this;if(a.isCommunityPage())var c=a.size,d=a.size/3,e=a.size/2,f=a.size/10;else var c=a.size,d=a.size/2,e=a.size/1,f=a.size/1;b.options={},$.extend(b.options,{plugins:[],container:".bubbleChart",viewBoxSize:c,innerRadius:d,outerRadius:e,radiusMin:f,index:a.getIndex(),isCommunityPage:a.isCommunityPage(),intersectDelta:0,transitDuration:1e3},a),$.extend(b.options,{radiusMax:(b.options.outerRadius-b.options.innerRadius)/2,intersectInc:b.options.intersectDelta},a),b.initializePlugins(b.options.plugins),b.setup(),b.registerClickEvent(b.getNodes()),b.moveToCentral(d3.select(".node"))},$.extend(d3.svg.BubbleChart.prototype,{getTransition:function(){return this.transition},getClickedNode:function(){return this.clickedNode},getCentralNode:function(){return this.centralNode},getOptions:function(){return this.options},randomCirclesPositions:function(a){for(var c=this,d=[],e=0,f=c.options;d.length<c.items.length&&++e<c.intervalMax;){var g=c.values[d.length],h=Math.max(g*f.radiusMax/c.valueMax,f.radiusMin),i=c.innerRadius+h+Math.random()*(c.outerRadius-c.innerRadius-2*h),j=Math.random()*b,k=c.centralPoint+i*Math.cos(j),l=c.centralPoint+i*Math.sin(j),m=!1;$.each(d,function(b,c){var d=c.cx-k,e=c.cy-l,f=c.r+h;return d*d+e*e<Math.pow(f-a,2)?(m=!0,!1):void 0}),m||d.push({cx:k,cy:l,r:h,item:c.items[d.length]})}if(d.length<c.items.length){if(a===f.radiusMin)throw{message:"Not enough space for all bubble. Please change the options.",options:f};return c.randomCirclesPositions(a+f.intersectInc)}return d.shuffle()},getValues:function(){var a=[],b=this;return $.each(b.items,function(c,d){a.push(b.options.data.eval(d))}),a},setup:function(){var a=this,b=a.options;if(a.innerRadius=b.innerRadius,a.outerRadius=b.outerRadius,a.centralPoint=b.size/2,a.intervalMax=b.size*b.size,a.items=b.data.items,a.values=a.getValues(),a.valueMax=a.values.max(),b.isCommunityPage())var c=d3.select(b.container);else var c=d3.select(d3.selectAll(b.container).filter("div")[0][b.index]);a.svg=c.append("svg").attr({preserveAspectRatio:"xMidYMid",width:b.size,height:b.size,"class":"bubbleChart"}).attr("viewBox",function(a){return["0 0",b.viewBoxSize,b.viewBoxSize].join(" ")}),a.circlePositions=a.randomCirclesPositions(b.intersectDelta);var d=a.svg.selectAll(".node").data(a.circlePositions).enter().append("g").attr("class",function(a){return["node",b.data.classed(a.item)].join(" ")}),e=(d3.scale.category20(),d.append("clipPath").attr("id",function(a){return b.data.classed(a.item)}));e.append("circle").attr({r:function(a){return a.r},cx:function(a){return a.cx},cy:function(a){return a.cy}}).style("fill",function(a){return"#ffffff"}).attr("opacity","1"),d.append("image").attr("clip-path",function(a){return"url(#"+b.data.classed(a.item)+")"}).attr("x",function(a){return a.cx-a.r}).attr("y",function(a){return a.cy-a.r}).attr("height",function(a){return 2*a.r}).attr("width",function(a){return 2*a.r}).attr("xlink:href",function(a){return a.item.image_url}),d.sort(function(a,c){return b.data.eval(c.item)-b.data.eval(a.item)}),a.transition={},a.event=$.microObserver.get($.misc.uuid()),b.supportResponsive&&($(window).resize(function(){var c=$(b.container).width();a.svg.attr("width",c),a.svg.attr("height",c)}),$(window).resize())},getCirclePositions:function(){return this.circlePositions},moveToCentral:function(a){var b=this,c=d3.svg.transform().translate(function(c){var d=(a.select("circle").attr("cx"),b.centralPoint-c.cx),e=b.centralPoint-c.cy;return[d,e]});b.centralNode=a,b.transition.centralNode=a.classed({active:!0}).transition().duration(b.options.transitDuration),b.transition.centralNode.attr("transform",c).select("circle").attr("r",function(a){return b.options.innerRadius}),b.transition.centralNode.attr("transform",c).select("image").attr("x",function(a){return a.cx-b.options.innerRadius}).attr("y",function(a){return a.cy-b.options.innerRadius}).attr("height",function(a){return 2*b.options.innerRadius}).attr("width",function(a){return 2*b.options.innerRadius})},moveToReflection:function(a,b){var c=this,d=d3.svg.transform().translate(function(a){var b=2*(c.centralPoint-a.cx),d=2*(c.centralPoint-a.cy);return[b,d]});a.transition().duration(c.options.transitDuration).delay(function(a,b){return 10*b}).attr("transform",b?"":d).select("circle").attr("r",function(a){return a.r}),a.transition().duration(c.options.transitDuration).delay(function(a,b){return 10*b}).attr("transform",b?"":d).select("image").attr("height",function(a){return 2*a.r}).attr("width",function(a){return 2*a.r}).attr("x",function(a){return a.cx-a.r}).attr("y",function(a){return a.cy-a.r})},reset:function(a){a.classed({active:!1})},registerClickEvent:function(a){var b=this,c=!1;a.style("cursor","pointer").on("click",function(a){d3.select(this)[0][0].innerHTML==b.centralNode[0][0].innerHTML?(b.clickedNode=d3.select(this),b.event.send("click",b.clickedNode)):(b.options.clickEvent(a.item),b.clickedNode=d3.select(this),b.event.send("click",b.clickedNode),b.reset(b.centralNode),b.moveToCentral(b.clickedNode),b.moveToReflection(b.svg.selectAll(".node:not(.active)"),c),c=!c)})},getNodes:function(){return this.svg.selectAll(".node")},get:function(){return this.svg}}),a.mixin(d3.svg.BubbleChart),d3.svg.BubbleChart});