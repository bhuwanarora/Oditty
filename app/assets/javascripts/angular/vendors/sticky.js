angular.module("sticky",[]).directive("sticky",function(e){return{link:function(t,n,r){var i=angular.element(e);if(t._stickyElements===undefined){t._stickyElements=[];i.bind("scroll.sticky",function(e){var n=i.scrollLeft();console.log(n);for(var r=0;r<t._stickyElements.length;r++){var s=t._stickyElements[r];if(!s.isStuck&&n>s.start){s.element.addClass("stuck");s.isStuck=true;if(s.placeholder){s.placeholder=angular.element("<div></div>").css({height:s.element.outerWidth()+"px",display:"inline-block","float":"left"}).insertBefore(s.element)}}else if(s.isStuck&&n<s.start){s.element.removeClass("stuck");s.isStuck=false;if(s.placeholder){s.placeholder.remove();s.placeholder=true}}}});var s=function(){for(var e=0;e<t._stickyElements.length;e++){var n=t._stickyElements[e];if(!n.isStuck){n.start=n.element.offset().top}else if(n.placeholder){n.start=n.placeholder.offset().top}}};i.bind("load",s);i.bind("resize",s)}var o={element:n,isStuck:false,placeholder:r.usePlaceholder!==undefined,start:n.offset().top};t._stickyElements.push(o)}}})