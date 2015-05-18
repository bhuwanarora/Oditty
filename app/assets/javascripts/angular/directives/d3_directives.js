homeApp.directive('d3ClickCircles', ['$window', '$timeout', 'd3Service', 
  function($window, $timeout, d3Service) {
    return {
        restrict: 'E',
        scope: {
            newsTags: '=',
            onCenterClick: '&',
            onClick: '&',
            newsId: '=',
            index: '=',
            communityPage: "="
        },
        link: function(scope, ele, attrs){
            // console.debug(scope.newsTags);
            var bubbleChart = new d3.svg.BubbleChart({
                supportResponsive: true,
                //container: => use @default
                size: 600,
                //viewBoxSize: => use @default
                innerRadius: 600 / 3.5,
                //outerRadius: => use @default
                radiusMin: 50,
                clickEvent: function(item){
                    scope.onClick({"active_item": item});
                },
                getNewsId: function(){
                    return scope.newsId;
                },
                getIndex: function(){
                    return scope.index;
                },
                isCommunityPage: function(){
                    return scope.communityPage;
                },
                //radiusMax: use @default
                //intersectDelta: use @default
                //intersectInc: use @default
                //circleColor: use @default
                data: {
                    items: scope.newsTags,
                    eval: function (item) {return item.view_count;},
                    classed: function (item) {
                        return item.name.split(" ").join("");
                    },
                    image: function(item){return item.image_url;}
                },
                plugins: [
                    {
                        name: "central-click",
                        options: {
                            text: "Explore Topic",
                            style: {
                                "font-size": "15px",
                                "font-style": "italic",
                                "font-family": "Source Sans Pro, sans-serif",
                                "text-anchor": "middle",
                                "fill": "white"
                            },
                            attr: {dy: "65px"},
                            centralClick: function(event){
                                scope.onCenterClick();
                            }
                        }
                    },
                    {
                        name: "lines",
                        options: {
                            format: [
                                {// Line #0
                                    textField: "view_count",
                                    classed: {count: true},
                                    style: {
                                        "font-size": "28px",
                                        "font-family": "Source Sans Pro, sans-serif",
                                        "text-anchor": "middle",
                                        fill: "white"
                                    },
                                    attr: {
                                        dy: "0px",
                                        x: function (d) {return d.cx;},
                                        y: function (d) {return d.cy;}
                                    }
                                },
                                {// Line #1
                                    textField: "name",
                                    classed: {text: true},
                                    style: {
                                        "font-size": "14px",
                                        "font-family": "Source Sans Pro, sans-serif",
                                        "text-anchor": "middle",
                                        fill: "white"
                                    },
                                    attr: {
                                        dy: "20px",
                                        x: function (d) {return d.cx;},
                                        y: function (d) {return d.cy;}
                                    }
                                }
                            ],
                        centralFormat: [
                            {// Line #0
                                style: {"font-size": "50px"},
                                attr: {}
                            },
                            {// Line #1
                                style: {"font-size": "30px"},
                                attr: {dy: "40px"}
                            }
                        ]
                    }
                }]
            }
        );
    }}
}]);


// homeApp.directive('d3Circles', ['$window', '$timeout', 'd3Service', 
//   function($window, $timeout, d3Service) {
//     return {
//         restrict: 'E',
//         scope: {
//         },
//         link: function(scope, ele, attrs){
//             var diameter = 960,
//                 format = d3.format(",d"),
//                 color = d3.scale.category20c();

//             var bubble = d3.layout.pack()
//                             .sort(null)
//                             .size([diameter, diameter])
//                             .padding(1.5);

//             var svg = d3.select(ele[0]).append("svg")
//                         .attr("width", diameter)
//                         .attr("height", diameter)
//                         .attr("class", "bubble");

//             d3.json("assets/flare.json", function(error, root){
//                 var filter_node = svg.selectAll(".filter_node")
//                                 .data(bubble.nodes(classes(root))
//                                         .filter(function(d) { 
//                                             return !d.children; }))
//                                 .enter().append("filter")
//                                 .attr("class", "filter_node")
//                                 .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

//                 var node = svg.selectAll(".node")
//                                 .data(bubble.nodes(classes(root))
//                                         .filter(function(d) { 
//                                             return !d.children; }))
//                                 .enter().append("g")
//                                 .attr("class", "node")
//                                 .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

//               node.append("title")
//                   .text(function(d) { return d.className + ": " + format(d.value); });

//               node.append("circle")
//                   .attr("r", function(d) { return d.r; })
//                   .style("fill", function(d) { return color(d.packageName); });

//               node.append("text")
//                   .attr("dy", ".3em")
//                   .style("text-anchor", "middle")
//                   .text(function(d) { return d.className.substring(0, d.r / 3); });

//                 /* append image to node */
                
//             });

//             // Returns a flattened hierarchy containing all leaf nodes under the root.
//             function classes(root) {
//                 var classes = [];

//                 function recurse(name, node) {
//                     if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
//                     else classes.push({packageName: name, className: node.name, value: node.size});
//                 }

//                 recurse(null, root);
//                 return {children: classes};
//             }

//             d3.select(self.frameElement).style("height", diameter + "px");
//         }
//     }
// }]);


// homeApp.directive('d3Bars', ['$window', '$timeout', 'd3Service', 
//   function($window, $timeout, d3Service){
//     return {
//         restrict: 'E',
//         scope: {
//             data: '=',
//             label: '@',
//             onClick: '&'
//         },
//         link: function(scope, ele, attrs) {
//             var renderTimeout;
//             var margin = parseInt(attrs.margin) || 20,
//                 barHeight = parseInt(attrs.barHeight) || 20,
//                 barPadding = parseInt(attrs.barPadding) || 5;

//             var svg = d3.select(ele[0])
//                         .append('svg')
//                         .style('width', '100%');

//             $window.onresize = function(){
//                 scope.$apply();
//             };

//             scope.$watch(function(){
//                 return angular.element($window)[0].innerWidth;
//             }, function(){
//                 scope.render(scope.data);
//             });

//             scope.$watch('data', function(newData) {
//                 scope.render(newData);
//             }, true);

//             scope.render = function(data) {
//                 svg.selectAll('*').remove();

//                 if (!data) return;
//                 if (renderTimeout) clearTimeout(renderTimeout);

//                 renderTimeout = $timeout(function() {
//                     var width = d3.select(ele[0])[0][0].offsetWidth - margin,
//                         height = scope.data.length * (barHeight + barPadding),
//                         color = d3.scale.category20(),
//                         xScale = d3.scale.linear()
//                                     .domain([0, d3.max(data, function(d) {
//                                         return d.score;
//                                     })])
//                                     .range([0, width]);

//                     svg.attr('height', height);

//                     svg.selectAll('rect')
//                         .data(data)
//                         .enter()
//                         .append('rect')
//                         .on('click', function(d,i) {
//                             return scope.onClick({item: d});
//                         })
//                         .attr('height', barHeight)
//                         .attr('width', 140)
//                         .attr('x', Math.round(margin/2))
//                         .attr('y', function(d,i) {
//                             return i * (barHeight + barPadding);
//                         })
//                         .attr('fill', function(d) {
//                             return color(d.score);
//                         })
//                         .transition()
//                         .duration(1000)
//                         .attr('width', function(d) {
//                             return xScale(d.score);
//                         });

//                     svg.selectAll('text')
//                         .data(data)
//                         .enter()
//                         .append('text')
//                         .attr('fill', '#fff')
//                         .attr('y', function(d,i) {
//                             return i * (barHeight + barPadding) + 15;
//                         })
//                         .attr('x', 15)
//                         .text(function(d) {
//                             return d.name + " (scored: " + d.score + ")";
//                         });
//                 }, 200);
//             };
//         }
//     }
// }]);