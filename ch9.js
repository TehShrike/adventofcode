var inputs = ['AlphaCentauri to Snowdin = 66', 'AlphaCentauri to Tambi = 28', 'AlphaCentauri to Faerun = 60', 'AlphaCentauri to Norrath = 34', 'AlphaCentauri to Straylight = 34', 'AlphaCentauri to Tristram = 3', 'AlphaCentauri to Arbre = 108', 'Snowdin to Tambi = 22', 'Snowdin to Faerun = 12', 'Snowdin to Norrath = 91', 'Snowdin to Straylight = 121', 'Snowdin to Tristram = 111', 'Snowdin to Arbre = 71', 'Tambi to Faerun = 39', 'Tambi to Norrath = 113', 'Tambi to Straylight = 130', 'Tambi to Tristram = 35', 'Tambi to Arbre = 40', 'Faerun to Norrath = 63', 'Faerun to Straylight = 21', 'Faerun to Tristram = 57', 'Faerun to Arbre = 83', 'Norrath to Straylight = 9', 'Norrath to Tristram = 50', 'Norrath to Arbre = 60', 'Straylight to Tristram = 27', 'Straylight to Arbre = 81', 'Tristram to Arbre = 90']

var parseInputRegex = /^(\w+) to (\w+) = (\d+)$$/

function parseInputString(str) {
	var match = parseInputRegex.exec(str)

	return {
		from: match[1],
		to: match[2],
		distance: parseInt(match[3], 10)
	}
}

function addCityIfNecessary(cities, cityName) {
	if (!cities[cityName]) {
		cities[cityName] = {}
	}
}

var cities = inputs.reduce(function(cities, input) {
	var datum = parseInputString(input)

	addCityIfNecessary(cities, datum.from)
	addCityIfNecessary(cities, datum.to)

	cities[datum.from][datum.to] = datum.distance
	cities[datum.to][datum.from] = datum.distance

	return cities
}, {})

function exclude(cities, excluding) {
	return Object.keys(cities).filter(function(toCity) {
		return excluding.indexOf(toCity) === -1
	})
}

function calculateFrom(cities, currentCity, excluding, distance) {
	var toCheckOut = exclude(cities[currentCity], excluding)
	var targetLength = Object.keys(cities).length

	if (toCheckOut.length === 0) {
		if (excluding.length === targetLength) {
			return {
				path: excluding,
				distance: distance
			}
		} else {
			return null
		}
	}


	return toCheckOut.map(function(nextCity) {
		var newDistance = distance + cities[currentCity][nextCity]
		return calculateFrom(cities, nextCity, excluding.concat(nextCity), newDistance)
	}).filter(function(step) {
		return step !== null
	})
}

var output = Object.keys(cities).map(function(cityName) {
	return calculateFrom(cities, cityName, [], cities[cityName])
})

function returnShortestStep(stepOne, stepTwo) {
	return stepOne.distance > stepTwo.distance ? stepTwo : stepOne
}

function findShortestStep(possibleSteps) {
	return possibleSteps.map(function(possibleStep) {
		if (Array.isArray(possibleStep)) {
			return findShortestStep(possibleStep)
		} else {
			return possibleStep
		}
	}).reduce(function(shortest, next) {
		return returnShortestStep(shortest, next)
	})
}

console.log(findShortestStep(output))
