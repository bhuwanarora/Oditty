homeApp.controller("rdContainerController",["websiteService","$scope","$rootScope","$document","sharedService","$timeout",function(a,b,c,d,e,f){b.render_page=function(a){e.render_page(a)},b.goto_page=function(a){window.open(a.full_url,"_blank").focus()},b.remove_container=function(a){delete c.containers[a],f(function(){c.containers.splice(a,1)},100)};(function(){c.pages=!0,c.containers=[];var a=function(){var a=[{url:"rooms",full_url:"rooms",header:"Rooms"},{url:"news_group",full_url:"news_group",header:"News Group"},{url:"books",full_url:"books",header:"Books"},{url:"spaces",full_url:"spaces",header:"Spaces"}];c.containers=a.sample_range(2)};a()})()}]),document.onclick=function(a){a=a||window.event;var b=a.target||a.srcElement,c=String(b.textContent).replace(/^\s+|\s+$/g,"");if("A"==b.tagName){if(!b.classList.contains("anchor"))return a.preventDefault(),!1}else{if("FIGCAPTION"==b.tagName)return a.preventDefault(),b=b.getElementsByClassName("no_anchor"),!1;if(b.classList.contains("no_anchor"))return a.preventDefault(),!1;if("Go to Book"==c)return a.preventDefault(),!1}},String.prototype.toCamel=function(){return this.replace(/(\_[a-z])/g,function(a){return a.toUpperCase().replace("_","")})},Array.prototype.sample_range=function(a){for(var b=[],c=0;a>c;c++)b=b.concat(this.splice(Math.random()*this.length,1));return b};