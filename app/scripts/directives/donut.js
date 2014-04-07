/*global d3*/

(function(){
    'use strict';


    angular.module('angularClientApp')
        .directive('donut', function () {
        return {
            restrict: 'E',
            link: function postLink(scope, element) {
                var data = [{type: 'incoming', value: 82}, {type: 'outgoing', value: 32},{type: 'lost', value: 32}];
                var color = d3.scale.category10();
                var el = element[0];

                var width = 200;
                var height = 200;

                var min = Math.min(width, height);
                var pie = d3.layout.pie()
                    .value(function(d){return d.value;});
//                    .sort(null);

                var arc = d3.svg.arc()
                    .outerRadius(min/2)
                    .innerRadius(min/2 * 0.5);

                var svg = d3.select(el).append('svg')
                    .attr({width: width, height: height})
                    .append('g')
                    .attr('transform','translate('+width/2+','+height/2+')');

                svg.selectAll('path').data(pie(data))
                    .enter().append('path')
                    .style('stroke', 'white')
                    .attr('d', arc)
                    .attr('fill', function (d, i) {return color(i);});
//                    .attr('text-anchor', 'middle')
//                    .text(function(d,i){ return data[i].type;});
            }
        };
    });

})();