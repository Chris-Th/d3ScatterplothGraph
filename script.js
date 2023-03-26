let jsonUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

let req = new XMLHttpRequest();

let values = [];

let xScale;
let yScale;

let xAxis;
let yAxis;

let minYear;
let maxYear;

let minMilSecs;
let maxMilSecs;

let padding = 60;
let width = 900;
let height = 650; 

let radius = 5;

let tooltip = d3.select('#tooltip')

let svg = d3.select('#canvas')

let drawCanvas = () => {
	svg
		.attr('width', width)
		.attr('height', height)
		.append('text')
		.text('Doping amongst Top Cyclists')
		.attr('id', 'title')
		.attr('x', '150')
		.attr('y', '20')
}

let makeScales = () => {

	minYear = d3.min(values, (item) => {
		return item['Year']
	})

	maxYear = d3.max(values, (item) => {
		return item['Year']
	})

	minMilSecs = d3.min(values, (item) => {
		return item['Seconds'] * 1000
	})

	maxMilSecs = d3.max(values, (item) => {
		return item['Seconds'] * 1000
	})

	
	xScale = d3.scaleLinear()
				.domain([minYear -1, maxYear +1])
				.range([padding, width-padding]);


	yScale = d3.scaleTime()
				.domain([minMilSecs, maxMilSecs])
				.range([height-padding, padding])

	
}

let drawDots = () => {
	
	svg.selectAll('circle')
		.data(values)
		.enter()
		.append('circle')
		.attr('class', 'dot')
		.attr('r', radius)
		.attr('data-xvalue', (item) => {
			return item['Year']
		})
		.attr('data-yvalue', (item) => {
			return new Date(item['Seconds'] * 1000)
		})
		.attr('cx', (item) => {
			return xScale(item['Year'])
		})
		.attr('cy', (item) => {
			return yScale(new Date(item['Seconds'] * 1000))
		})
		.attr('fill', (item) => {
			if (item['URL'] === "") {
				return 'lightgreen'
			} else {
				return 'orange'
			}
		})
		.on('mouseover', (item) => {
				tooltip.transition()
				.style('visibility', 'visible')

				if (item['Doping'] != "") {
					tooltip.text(`${item["Year"]} - 
							${item["Name"]} - 
							${item["Name"]} - 
							${item["Doping"]}`)
				} else {
					tooltip.text(`${item["Year"]} - 
					${item["Name"]} - 
					${item["Name"]} - 
					No Doping Allegations`)
				}
				tooltip.attr('data-year', item['Year'])
		})
		.on('mouseout', (item) => {
			tooltip.transition()
			.style('visibility', 'hidden')
		})
}


let drawAxes = () => {
	
	yAxis = d3.axisLeft(yScale)
			.tickFormat(d3.timeFormat('%M:%S'))

	xAxis = d3.axisBottom(xScale)
			.tickFormat(d3.format('d'));

	svg.append('g')
	.call(xAxis)
	.attr('id', 'x-axis')
	.attr('transform', `translate(0, ${height-padding})`)

	svg.append('g')
	.call(yAxis)
	.attr('id', 'y-axis')
	.attr('transform', `translate(${padding}, 0)`)
}


req.open('GET', jsonUrl, true);

req.onload = () => {
	values = JSON.parse(req.responseText)
	console.log(values)
	drawCanvas()
	makeScales()
	drawDots()
	drawAxes()
}
req.send();

/*
	title element : id="title"
	x-axis: id = "x-axis"
	y-axis: id = "y-axis"
	dots: each should have:
		- class: "dot"
		- property "data-xvalue": x-value (integers (full years))
		- property "data-yvalue": y-value (minutes, use Date-objects)
		<circle class="dot" r="6" cx="146.08695652173913" cy="13.888888888888888" data-xvalue="1997" data-yvalue="1969-12-31T23:36:55.000Z" style="fill: rgb(31, 119, 180);"></circle>
	tick-labels: y-axis: %M:%S time format.
				x-axis: year
	legend with text and id="legend"
	tooltip: onmouseover / id="tooltip"
		- property "data-year": data-xvalue
		<div class="tooltip" id="tooltip" style="opacity: 0; left: 543px; top: 477px;" data-year="2006">Levi Leipheimer: USA<br>Year: 2006, Time: 39:15<br><br>Testified in 2012 to doping during his time with US Postal Service </div>

*/
