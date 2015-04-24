!function(a,b){"object"==typeof exports?b(exports):"function"==typeof define&&define.amd?define(["exports"],b):b(a)}(this,function(a){function b(a){this._targetElement=a,this._options={nextLabel:"Next &rarr;",prevLabel:"&larr; Back",skipLabel:"Skip",doneLabel:"Done",tooltipPosition:"bottom",tooltipClass:"",exitOnEsc:!0,exitOnOverlayClick:!0,showStepNumbers:!0,keyboardNavigation:!0,showButtons:!0,showBullets:!0,scrollToElement:!0,overlayOpacity:.8}}function c(a){var b=[],c=this;if(this._options.steps)for(var e=[],i=0,k=this._options.steps.length;k>i;i++){var l=d(this._options.steps[i]);if(l.step=b.length+1,"string"==typeof l.element&&(l.element=document.querySelector(l.element)),"undefined"==typeof l.element||null==l.element){var m=document.querySelector(".introjsFloatingElement");null==m&&(m=document.createElement("div"),m.className="introjsFloatingElement",document.body.appendChild(m)),l.element=m,l.position="floating"}null!=l.element&&b.push(l)}else{var e=a.querySelectorAll("*[data-intro]");if(e.length<1)return!1;for(var i=0,n=e.length;n>i;i++){var p=e[i],q=parseInt(p.getAttribute("data-step"),10);q>0&&(b[q-1]={element:p,intro:p.getAttribute("data-intro"),step:parseInt(p.getAttribute("data-step"),10),tooltipClass:p.getAttribute("data-tooltipClass"),position:p.getAttribute("data-position")||this._options.tooltipPosition})}for(var r=0,i=0,n=e.length;n>i;i++){var p=e[i];if(null==p.getAttribute("data-step")){for(;;){if("undefined"==typeof b[r])break;r++}b[r]={element:p,intro:p.getAttribute("data-intro"),step:r+1,tooltipClass:p.getAttribute("data-tooltipClass"),position:p.getAttribute("data-position")||this._options.tooltipPosition}}}}for(var s=[],t=0;t<b.length;t++)b[t]&&s.push(b[t]);if(b=s,b.sort(function(a,b){return a.step-b.step}),c._introItems=b,o.call(c,a)){f.call(c);{a.querySelector(".introjs-skipbutton"),a.querySelector(".introjs-nextbutton")}c._onKeyDown=function(b){27===b.keyCode&&1==c._options.exitOnEsc?(h.call(c,a),void 0!=c._introExitCallback&&c._introExitCallback.call(c)):37===b.keyCode?g.call(c):(39===b.keyCode||13===b.keyCode)&&(f.call(c),b.preventDefault?b.preventDefault():b.returnValue=!1)},c._onResize=function(){j.call(c,document.querySelector(".introjs-helperLayer"))},window.addEventListener?(this._options.keyboardNavigation&&window.addEventListener("keydown",c._onKeyDown,!0),window.addEventListener("resize",c._onResize,!0)):document.attachEvent&&(this._options.keyboardNavigation&&document.attachEvent("onkeydown",c._onKeyDown),document.attachEvent("onresize",c._onResize))}return!1}function d(a){if(null==a||"object"!=typeof a||"undefined"!=typeof a.nodeType)return a;var b={};for(var c in a)b[c]=d(a[c]);return b}function e(a){this._currentStep=a-2,"undefined"!=typeof this._introItems&&f.call(this)}function f(){if(this._direction="forward","undefined"==typeof this._currentStep?this._currentStep=0:++this._currentStep,this._introItems.length<=this._currentStep)return"function"==typeof this._introCompleteCallback&&this._introCompleteCallback.call(this),void h.call(this,this._targetElement);var a=this._introItems[this._currentStep];"undefined"!=typeof this._introBeforeChangeCallback&&this._introBeforeChangeCallback.call(this,a.element),k.call(this,a)}function g(){if(this._direction="backward",0===this._currentStep)return!1;var a=this._introItems[--this._currentStep];"undefined"!=typeof this._introBeforeChangeCallback&&this._introBeforeChangeCallback.call(this,a.element),k.call(this,a)}function h(a){var b=a.querySelector(".introjs-overlay");if(null!=b){b.style.opacity=0,setTimeout(function(){b.parentNode&&b.parentNode.removeChild(b)},500);var c=a.querySelector(".introjs-helperLayer");c&&c.parentNode.removeChild(c);var d=document.querySelector(".introjsFloatingElement");d&&d.parentNode.removeChild(d);var e=document.querySelector(".introjs-showElement");e&&(e.className=e.className.replace(/introjs-[a-zA-Z]+/g,"").replace(/^\s+|\s+$/g,""));var f=document.querySelectorAll(".introjs-fixParent");if(f&&f.length>0)for(var g=f.length-1;g>=0;g--)f[g].className=f[g].className.replace(/introjs-fixParent/g,"").replace(/^\s+|\s+$/g,"");window.removeEventListener?window.removeEventListener("keydown",this._onKeyDown,!0):document.detachEvent&&document.detachEvent("onkeydown",this._onKeyDown),this._currentStep=void 0}}function i(a,b,c,d){var e,f,g,h="";if(b.style.top=null,b.style.right=null,b.style.bottom=null,b.style.left=null,b.style.marginLeft=null,b.style.marginTop=null,c.style.display="inherit","undefined"!=typeof d&&null!=d&&(d.style.top=null,d.style.left=null),this._introItems[this._currentStep]){e=this._introItems[this._currentStep],h="string"==typeof e.tooltipClass?e.tooltipClass:this._options.tooltipClass,b.className=("introjs-tooltip "+h).replace(/^\s+|\s+$/g,"");var h=this._options.tooltipClass;switch(currentTooltipPosition=this._introItems[this._currentStep].position,currentTooltipPosition){case"top":b.style.left="15px",b.style.top="-"+(p(b).height+10)+"px",c.className="introjs-arrow bottom";break;case"right":b.style.left=p(a).width+20+"px",c.className="introjs-arrow left";break;case"left":1==this._options.showStepNumbers&&(b.style.top="15px"),b.style.right=p(a).width+20+"px",c.className="introjs-arrow right";break;case"floating":c.style.display="none",f=p(b),b.style.left="50%",b.style.top="50%",b.style.marginLeft="-"+f.width/2+"px",b.style.marginTop="-"+f.height/2+"px","undefined"!=typeof d&&null!=d&&(d.style.left="-"+(f.width/2+18)+"px",d.style.top="-"+(f.height/2+18)+"px");break;case"bottom-right-aligned":c.className="introjs-arrow top-right",b.style.right="0px",b.style.bottom="-"+(p(b).height+10)+"px";break;case"bottom-middle-aligned":g=p(a),f=p(b),c.className="introjs-arrow top-middle",b.style.left=g.width/2-f.width/2+"px",b.style.bottom="-"+(f.height+10)+"px";break;case"bottom-left-aligned":case"bottom":default:b.style.bottom="-"+(p(b).height+10)+"px",c.className="introjs-arrow top"}}}function j(a){if(a){if(!this._introItems[this._currentStep])return;var b=this._introItems[this._currentStep],c=p(b.element),d=10;"floating"==b.position&&(d=0),a.setAttribute("style","width: "+(c.width+d)+"px; height:"+(c.height+d)+"px; top:"+(c.top-5)+"px;left: "+(c.left-5)+"px;")}}function k(a){"undefined"!=typeof this._introChangeCallback&&this._introChangeCallback.call(this,a.element);{var b=this,c=document.querySelector(".introjs-helperLayer");p(a.element)}if(null!=c){var d=c.querySelector(".introjs-helperNumberLayer"),e=c.querySelector(".introjs-tooltiptext"),k=c.querySelector(".introjs-arrow"),o=c.querySelector(".introjs-tooltip"),q=c.querySelector(".introjs-skipbutton"),r=c.querySelector(".introjs-prevbutton"),s=c.querySelector(".introjs-nextbutton");if(o.style.opacity=0,null!=d){var t=this._introItems[a.step-2>=0?a.step-2:0];(null!=t&&"forward"==this._direction&&"floating"==t.position||"backward"==this._direction&&"floating"==a.position)&&(d.style.opacity=0)}j.call(b,c);var u=document.querySelectorAll(".introjs-fixParent");if(u&&u.length>0)for(var v=u.length-1;v>=0;v--)u[v].className=u[v].className.replace(/introjs-fixParent/g,"").replace(/^\s+|\s+$/g,"");var w=document.querySelector(".introjs-showElement");w.className=w.className.replace(/introjs-[a-zA-Z]+/g,"").replace(/^\s+|\s+$/g,""),b._lastShowElementTimer&&clearTimeout(b._lastShowElementTimer),b._lastShowElementTimer=setTimeout(function(){null!=d&&(d.innerHTML=a.step),e.innerHTML=a.intro,i.call(b,a.element,o,k,d),c.querySelector(".introjs-bullets li > a.active").className="",c.querySelector('.introjs-bullets li > a[data-stepnumber="'+a.step+'"]').className="active",o.style.opacity=1,d&&(d.style.opacity=1)},350)}else{var x=document.createElement("div"),y=document.createElement("div"),z=document.createElement("div"),A=document.createElement("div"),B=document.createElement("div"),C=document.createElement("div");x.className="introjs-helperLayer",j.call(b,x),this._targetElement.appendChild(x),y.className="introjs-arrow",A.className="introjs-tooltiptext",A.innerHTML=a.intro,B.className="introjs-bullets",this._options.showBullets===!1&&(B.style.display="none");for(var D=document.createElement("ul"),v=0,E=this._introItems.length;E>v;v++){var F=document.createElement("li"),G=document.createElement("a");G.onclick=function(){b.goToStep(this.getAttribute("data-stepnumber"))},0===v&&(G.className="active"),G.href="javascript:void(0);",G.innerHTML="&nbsp;",G.setAttribute("data-stepnumber",this._introItems[v].step),F.appendChild(G),D.appendChild(F)}if(B.appendChild(D),C.className="introjs-tooltipbuttons",this._options.showButtons===!1&&(C.style.display="none"),z.className="introjs-tooltip",z.appendChild(A),z.appendChild(B),1==this._options.showStepNumbers){var H=document.createElement("span");H.className="introjs-helperNumberLayer",H.innerHTML=a.step,x.appendChild(H)}z.appendChild(y),x.appendChild(z);var s=document.createElement("a");s.onclick=function(){b._introItems.length-1!=b._currentStep&&f.call(b)},s.href="javascript:void(0);",s.innerHTML=this._options.nextLabel;var r=document.createElement("a");r.onclick=function(){0!=b._currentStep&&g.call(b)},r.href="javascript:void(0);",r.innerHTML=this._options.prevLabel;var q=document.createElement("a");q.className="introjs-button introjs-skipbutton",q.href="javascript:void(0);",q.innerHTML=this._options.skipLabel,q.onclick=function(){b._introItems.length-1==b._currentStep&&"function"==typeof b._introCompleteCallback&&b._introCompleteCallback.call(b),b._introItems.length-1!=b._currentStep&&"function"==typeof b._introExitCallback&&b._introExitCallback.call(b),h.call(b,b._targetElement)},C.appendChild(q),this._introItems.length>1&&(C.appendChild(r),C.appendChild(s)),z.appendChild(C),i.call(b,a.element,z,y,H)}0==this._currentStep&&this._introItems.length>1?(r.className="introjs-button introjs-prevbutton introjs-disabled",s.className="introjs-button introjs-nextbutton",q.innerHTML=this._options.skipLabel):this._introItems.length-1==this._currentStep||1==this._introItems.length?(q.innerHTML=this._options.doneLabel,r.className="introjs-button introjs-prevbutton",s.className="introjs-button introjs-nextbutton introjs-disabled"):(r.className="introjs-button introjs-prevbutton",s.className="introjs-button introjs-nextbutton",q.innerHTML=this._options.skipLabel),s.focus(),a.element.className+=" introjs-showElement";var I=l(a.element,"position");"absolute"!==I&&"relative"!==I&&(a.element.className+=" introjs-relativePosition");for(var J=a.element.parentNode;null!=J&&"body"!==J.tagName.toLowerCase();){var K=l(J,"z-index"),L=parseFloat(l(J,"opacity"));(/[0-9]+/.test(K)||1>L)&&(J.className+=" introjs-fixParent"),J=J.parentNode}if(!n(a.element)&&this._options.scrollToElement===!0){var M=a.element.getBoundingClientRect(),N=m().height,O=M.bottom-(M.bottom-M.top),P=M.bottom-N;0>O||a.element.clientHeight>N?window.scrollBy(0,O-30):window.scrollBy(0,P+100)}"undefined"!=typeof this._introAfterChangeCallback&&this._introAfterChangeCallback.call(this,a.element)}function l(a,b){var c="";return a.currentStyle?c=a.currentStyle[b]:document.defaultView&&document.defaultView.getComputedStyle&&(c=document.defaultView.getComputedStyle(a,null).getPropertyValue(b)),c&&c.toLowerCase?c.toLowerCase():c}function m(){if(void 0!=window.innerWidth)return{width:window.innerWidth,height:window.innerHeight};var a=document.documentElement;return{width:a.clientWidth,height:a.clientHeight}}function n(a){var b=a.getBoundingClientRect();return b.top>=0&&b.left>=0&&b.bottom+80<=window.innerHeight&&b.right<=window.innerWidth}function o(a){var b=document.createElement("div"),c="",d=this;if(b.className="introjs-overlay","body"===a.tagName.toLowerCase())c+="top: 0;bottom: 0; left: 0;right: 0;position: fixed;",b.setAttribute("style",c);else{var e=p(a);e&&(c+="width: "+e.width+"px; height:"+e.height+"px; top:"+e.top+"px;left: "+e.left+"px;",b.setAttribute("style",c))}return a.appendChild(b),b.onclick=function(){1==d._options.exitOnOverlayClick&&(h.call(d,a),void 0!=d._introExitCallback&&d._introExitCallback.call(d))},setTimeout(function(){c+="opacity: "+d._options.overlayOpacity.toString()+";",b.setAttribute("style",c)},10),!0}function p(a){var b={};b.width=a.offsetWidth,b.height=a.offsetHeight;for(var c=0,d=0;a&&!isNaN(a.offsetLeft)&&!isNaN(a.offsetTop);)c+=a.offsetLeft,d+=a.offsetTop,a=a.offsetParent;return b.top=d,b.left=c,b}function q(a,b){var c={};for(var d in a)c[d]=a[d];for(var d in b)c[d]=b[d];return c}var r="0.9.0",s=function(a){if("object"==typeof a)return new b(a);if("string"==typeof a){var c=document.querySelector(a);if(c)return new b(c);throw new Error("There is no element with given selector.")}return new b(document.body)};return s.version=r,s.fn=b.prototype={clone:function(){return new b(this)},setOption:function(a,b){return this._options[a]=b,this},setOptions:function(a){return this._options=q(this._options,a),this},start:function(){return c.call(this,this._targetElement),this},goToStep:function(a){return e.call(this,a),this},nextStep:function(){return f.call(this),this},previousStep:function(){return g.call(this),this},exit:function(){h.call(this,this._targetElement)},refresh:function(){return j.call(this,document.querySelector(".introjs-helperLayer")),this},onbeforechange:function(a){if("function"!=typeof a)throw new Error("Provided callback for onbeforechange was not a function");return this._introBeforeChangeCallback=a,this},onchange:function(a){if("function"!=typeof a)throw new Error("Provided callback for onchange was not a function.");return this._introChangeCallback=a,this},onafterchange:function(a){if("function"!=typeof a)throw new Error("Provided callback for onafterchange was not a function");return this._introAfterChangeCallback=a,this},oncomplete:function(a){if("function"!=typeof a)throw new Error("Provided callback for oncomplete was not a function.");return this._introCompleteCallback=a,this},onexit:function(a){if("function"!=typeof a)throw new Error("Provided callback for onexit was not a function.");return this._introExitCallback=a,this}},a.introJs=s,s});