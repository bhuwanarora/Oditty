d3.svg.BubbleChart.define("central-click",function(a){var b=this;b.setup=function(c){var d=b.setup;return function(c){var e=d.apply(this,arguments);return b.event.on("click",function(b){1===b.selectAll("text.central-click")[0].length&&a.centralClick()}),e}}(),b.reset=function(a){var c=b.reset;return function(a){var b=c.apply(this,arguments);return a.select("text.central-click").remove(),b}}(),b.moveToCentral=function(c){var d=b.moveToCentral;return function(c){var e=d.apply(this,arguments),f=b.getTransition().centralNode;return f.each("end",function(){c.append("text").classed({"central-click":!0}).attr(a.attr).style(a.style).attr("x",function(a){return a.cx}).attr("y",function(a){return a.cy}).text(a.text).style("opacity",0).transition().duration(b.getOptions().transitDuration/2).style("opacity","0.8")}),e}}()});