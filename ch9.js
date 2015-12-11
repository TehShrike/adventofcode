var inputs = ['AlphaCentauri to Snowdin = 66', 'AlphaCentauri to Tambi = 28', 'AlphaCentauri to Faerun = 60', 'AlphaCentauri to Norrath = 34', 'AlphaCentauri to Straylight = 34', 'AlphaCentauri to Tristram = 3', 'AlphaCentauri to Arbre = 108', 'Snowdin to Tambi = 22', 'Snowdin to Faerun = 12', 'Snowdin to Norrath = 91', 'Snowdin to Straylight = 121', 'Snowdin to Tristram = 111', 'Snowdin to Arbre = 71', 'Tambi to Faerun = 39', 'Tambi to Norrath = 113', 'Tambi to Straylight = 130', 'Tambi to Tristram = 35', 'Tambi to Arbre = 40', 'Faerun to Norrath = 63', 'Faerun to Straylight = 21', 'Faerun to Tristram = 57', 'Faerun to Arbre = 83', 'Norrath to Straylight = 9', 'Norrath to Tristram = 50', 'Norrath to Arbre = 60', 'Straylight to Tristram = 27', 'Straylight to Arbre = 81', 'Tristram to Arbre = 90']
// var inputs = ['London to Dublin = 464', 'London to Belfast = 518', 'Dublin to Belfast = 141']

var parseInputRegex = /^(\w+) to (\w+) = (\d+)$/

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
	var toCheckOut = exclude(cities, excluding)
	var targetLength = Object.keys(cities).length

	if (toCheckOut.length === 0) {
		return {
			path: excluding,
			distance: distance
		}
	}


	return toCheckOut.map(function(nextCity) {
		return visitFrom(cities, currentCity, nextCity, excluding, distance)
	}).filter(function(step) {
		return step !== null
	})
}

function visitFrom(cities, startAt, goTo, alreadyVisited, distanceTravelledAlready) {
	return calculateFrom(cities, goTo, alreadyVisited.concat(goTo), distanceTravelledAlready + cities[startAt][goTo])
}

var output = Object.keys(cities).map(function(startAt) {
	return exclude(cities, [startAt]).map(function(cityName) {
		return visitFrom(cities, startAt, cityName, [startAt], 0)
	})
})

function findAllPathDistances(possibleSteps) {
	return possibleSteps.reduce(function(steps, possibleStep) {
		if (Array.isArray(possibleStep)) {
			return steps.concat(findAllPathDistances(possibleStep))
		} else {
			return steps.concat(possibleStep)
		}
	}, [])
}

var allPathDistances = findAllPathDistances(output)

var shortest = allPathDistances.reduce(function(smallest, path) {
	return path.distance < smallest.distance ? path : smallest
})

var longest = allPathDistances.reduce(function(largest, path) {
	return path.distance > largest.distance ? path : largest
})

console.log('shortest:', shortest, 'longest:', longest)

