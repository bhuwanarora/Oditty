homeApp.controller("rdContainerController",["websiteService","$scope","$rootScope","$document","sharedService","$timeout",function(a,b,c,d,e,f){b.render_page=function(a){e.render_page(a)},b.goto_page=function(a){window.open(a.full_url,"_blank").focus()},b.remove_container=function(a){var b=c.containers;b.splice(a,1),delete c.containers,c.containers=[],f(function(){angular.forEach(b,function(a){this.push(a)},c.containers)},100)};(function(){c.pages=!0,c.containers=[];var a=function(){var a={url:"author",id:2343423,full_url:"author",header:"Author"};c.containers.push(a)};a()})()}]),document.onclick=function(a){a=a||window.event;var b=a.target||a.srcElement,c=String(b.textContent).replace(/^\s+|\s+$/g,"");return"A"==b.tagName?(a.preventDefault(),!1):"FIGCAPTION"==b.tagName?(a.preventDefault(),b=b.getElementsByClassName("no_anchor"),!1):b.classList.contains("no_anchor")?(a.preventDefault(),!1):"Go to Book"==c?(a.preventDefault(),!1):void 0},String.prototype.toCamel=function(){return this.replace(/(\_[a-z])/g,function(a){return a.toUpperCase().replace("_","")})};