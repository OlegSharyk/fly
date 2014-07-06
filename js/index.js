; (function (d3) {

    /**
     * Function to kick of all fancy download circles
     */
    function visualizeCircles(selector, percent) {
        var d3items = d3.selectAll(selector),
            d3graphics = d3items.select('.progress-box__graphic');

        // remove old svg for the case there was one
        d3graphics.select('svg').remove();

        

        d3items.each(function (svg) {
            var d3item = d3.select(this);

            drawCircle(d3item, percent);
        });
    }
    /**
     * Function to draw one particular 
     * download circle
     */


//    var small = {
//        scale: 0.12,
//        translateX: 20,
//        translateY: 20,
//        isShowCompleted: false,
//        fontSize: "110px",
//        textXpos: 0,
//        textYpos: 38
//    };
//
//    var large = {
//        scale: 1,
//        translateX: 138.5,
//        translateY: 140,
//        isShowCompleted: true,
//        fontSize: "48px",
//        textXpos: -23,
//        textYpos: 0,
//        width: 280,
//        height: 280
//    };

    function drawCircle(d3item, percents) {
        var d3container = d3item.select('.progress-box__graphic'),
            width = d3container.attr('data-width'),
            height = d3container.attr('data-height'),
            percents = typeof (percents) == "undefined" ? d3item.attr('data-value') : percents,
            isShowCompleted = d3container.attr('data-isshowcompleted') === "true",
            // circle stuff
            twoPi = 2 * Math.PI,
            minSide = Math.min(width, height),
            radius = minSide / 2 - 5,

			arcBackground = d3.svg.arc()
                              .startAngle(0)
                              .endAngle(function (d) { return d.value * twoPi; })
                              .outerRadius(radius - 0.018 * minSide)
                              .innerRadius(radius - 0.161 * minSide),
            arcForeground = d3.svg.arc()
                              .startAngle(0)
                              .endAngle(function (d) { return d.value * twoPi; })
                              .outerRadius(radius)
                              .innerRadius(radius - 0.132 * minSide),

            // animation stuff,
            duration = 2000;
        
        // string to number
        percents = +percents;

		if (isShowCompleted) {

		} else {
			arcBackground = d3.svg.arc()
				.startAngle(0)
				.endAngle(function (d) { return d.value * twoPi; })
				.outerRadius(radius - 0.02 * minSide)
				.innerRadius(radius - 0.111 * minSide);
			arcForeground = d3.svg.arc()
				.startAngle(0)
				.endAngle(function (d) { return d.value * twoPi; })
				.outerRadius(radius)
				.innerRadius(radius - 0.08 * minSide);
		}

        // append new svg
        var svg = d3container.append('svg')
                              .attr('width', width)
                              .attr('height', height)
                              .append('g')
                              .attr(
                                'transform',
                                'translate(' + width / 2 + ',' + height / 2 + ')'
                              );

        // filter stuff
        /* For the drop shadow filter... */
        var defs = svg.append('defs');

        var filter = defs.append('filter')
                          .attr('id', 'dropshadow');
		filter.append('feGaussianBlur')
			.attr('in', 'SourceAlpha')
			.attr('stdDeviation', 2)
			.attr('result', 'blur');
		filter.append('feOffset')
			.attr('in', 'blur')
			.attr('dx', 2)
			.attr('dy', 3)
			.attr('result', 'offsetBlur');


		if (isShowCompleted) {
			filter.append('feGaussianBlur')
				.attr('in', 'SourceAlpha')
				.attr('stdDeviation', 2)
				.attr('result', 'blur');
			filter.append('feOffset')
				.attr('in', 'blur')
				.attr('dx', 2)
				.attr('dy', 3)
				.attr('result', 'offsetBlur');
		} else {
			filter.append('feGaussianBlur')
				.attr('in', 'SourceAlpha')
				.attr('stdDeviation',0.5)
				.attr('result', 'blur');
			filter.append('feOffset')
				.attr('in', 'blur')
				.attr('dx', 0.5)
				.attr('dy', 0.5)
				.attr('result', 'offsetBlur');
		}


        var feMerge = filter.append('feMerge');

        feMerge.append('feMergeNode')
                .attr('in", "offsetBlur');
        feMerge.append('feMergeNode')
                .attr('in', 'SourceGraphic');
        // end filter stuff

        // gradient stuff    
        var gradientBackground = defs.append('linearGradient')
                                        .attr('id', 'gradientBackground')
                                        .attr('x1', '0')
                                        .attr('x2', '0')
                                        .attr('y1', '0')
                                        .attr('y2', '1');
        gradientBackground.append('stop')
                            .attr('class', 'BackgroundStop1')
                            .attr('offset', '0%');

        gradientBackground.append('stop')
                            .attr('class', 'BackgroundStop2')
                            .attr('offset', '100%');
        var gradientForeground = defs.append('linearGradient')
                                        .attr('id', 'gradientForeground')
                                        .attr('x1', '0')
                                        .attr('x2', '0')
                                        .attr('y1', '0')
                                        .attr('y2', '1');
        gradientForeground.append('stop')
                            .attr('class', 'ForegroundStop1')
                            .attr('offset', '0%');

        gradientForeground.append('stop')
                            .attr('class', 'ForegroundStop2')
                            .attr('offset', '100%');
        // end gradient stuff



        var meter = svg.append('g')
                        .attr('class', 'progress-meter');

        meter.data(
                [
                  { value: .0, index: .5 }
                ]
              )
              .append('path')
              .attr('class', 'ui__backgroundCircle')
              .attr('d', arcBackground)
              .attr('filter', 'url(#dropshadow)')
              .transition()
              .duration(duration)
              .attrTween('d', tweenArcBackground({ value: 1 }));


        var foreground = meter.data(
                                [
                                  { value: .0, index: .5 }
                                ]
                              )
                              .append('path')
                              .attr('stroke', '#fff')
                              .attr('class', 'ui__foregroundCircle')
                              .attr('d', arcForeground)
                              .attr('filter', 'url(#dropshadow)')
                              .transition()
                              .attr('stroke', '#aaa')
                              .delay(1000)
                              .duration(duration)
                              .attrTween('d', tweenArcForeground({ value: percents / 100 }));


        var fontCoef = isShowCompleted ? 1 : 1.8;
        var fontSize = fontCoef * 0.171 * minSide;
        var fontSizeStr = "" + fontSize + "px";


        var percentText = meter.data([0])
            .append('text')
            .text(0);
              percentText.attr('font-size', fontSizeStr)
              .attr('x', -23)
              .attr('y', 0)
              .attr('fill', '#fff')
              .style('text-anchor', 'middle')
              //.attr('style', 'text-anchor: middle; dominant-baseline: middle;')
              //.attr('text-anchor', 'middle')
    //          .attr( 'filter', 'url(#dropshadow)' )
              .transition()
              .delay(1000)
              .duration(duration)
              .tween('text', tweenText(percents));

        if (isShowCompleted) {
            meter.append('text')
                 .attr('fill', '#fff')
                 .attr('font-size', fontSizeStr)
                 .attr('x', 23)
                 .attr('y', 0)
                 .attr('text-anchor', 'middle')
    //          .attr( 'filter', 'url(#dropshadow)' )
                 .text('%');
            meter.append('text')
                  .attr('fill', '#fff')
                  .attr('x', 0)
                  .attr('y', 30)
                  .attr('text-anchor', 'middle')
        //          .attr( 'filter', 'url(#dropshadow)' )
                  .text('COMPLETED');
        } else {
            percentText
                .attr('x', 0)
                .attr('y', 0)
                .style("dominant-baseline", "middle");
        }



        // Helper functions!!!
        function tweenArcForeground(b) {
            return function (a) {
                var i = d3.interpolate(a, b);

                return function (t) {
                    return arcForeground(i(t));
                };
            };
        }

        function tweenArcBackground(b) {
            return function (a) {
                var i = d3.interpolate(a, b);

                return function (t) {
                    return arcBackground(i(t));
                };
            };
        }

        function tweenText(b) {
            return function (a) {
                var i = d3.interpolateRound(a, b);

                return function (t) {
                    this.textContent = i(t);
                };
            }
        }
    }

    function start() {
        visualizeCircles('.progress-box');
    }

    // yeah, let's kick things off!!!
    start();
})(d3);