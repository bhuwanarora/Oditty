/**
 * central-click.js
 */
d3.svg.BubbleChart.define("central-click", function (options) {
  var self = this;

  self.setup = (function (node) {
    var original = self.setup;
    return function (node) {
      var fn = original.apply(this, arguments);
      self.event.on("click", function(node) {
        if (node.selectAll("text.central-click")[0].length === 1) {
          options.centralClick();
        }
      });
      return fn;
    };
  })();

  self.reset = (function (node) {
    var original = self.reset;
    return function (node) {
      var fn = original.apply(this, arguments);
      node.select("text.central-click").remove();
      return fn;
    };
  })();

  self.moveToCentral = (function (node) {
    var original = self.moveToCentral;
    return function (node) {
      var fn = original.apply(this, arguments);
      var transition = self.getTransition().centralNode;
      transition.each("end", function() {
        node.append("text").classed({"central-click": true})
          .attr(options.attr)
          .style(options.style)
          .attr("x", function (d) {return d.cx;})
          .attr("y", function (d) {return d.cy;})
          .text(options.text)
          .style("opacity", 0).transition().duration(self.getOptions().transitDuration / 2).style("opacity", "0.8");

          var config = {
            "avatar_size" : 200
          }

          // node.append('svg:defs')
          //     .append("svg:pattern")
          //     .attr("id", "grump_avatar")
          //     .attr("width", config.avatar_size)
          //     .attr("height", config.avatar_size)
          //     .attr("patternUnits", "userSpaceOnUse")
          //     .append("svg:image")
          //     .attr("xlink:href", 'http://www.thecitizen.in/NewsImages/328387Arvind%20Kejriwal%20.jpg')
          //     .attr("width", config.avatar_size)
          //     .attr("height", config.avatar_size)
          //     .attr("x", 0)
          //     .attr("y", 0);
          // node.append("circle")
          //     .attr("cx", config.avatar_size)
          //     .attr("cy", config.avatar_size)
          //     .attr("r", config.avatar_size/2)
          //     .attr("x", 0)
          //     .attr("y", 0)
          //     .style("fill", "#fff")
              // .style("fill", "url(#grump_avatar)");
        // node.append("image")
        //   .attr("xlink:href", "http://www.thecitizen.in/NewsImages/328387Arvind%20Kejriwal%20.jpg")
        //   .attr("x", function (d) {return d.cx - 5*d.r;})
        //   .attr("y", function (d) {return d.cy - 5*d.r;})
        //   .attr("width", function (d) {return 10*d.r;})
        //   .attr("height", function (d) {return 10*d.r;});
      });
      return fn;
    };
  })();
});