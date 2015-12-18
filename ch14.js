// var input = ['Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.', 'Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.']
var input = ['Vixen can fly 19 km/s for 7 seconds, but then must rest for 124 seconds.', 'Rudolph can fly 3 km/s for 15 seconds, but then must rest for 28 seconds.', 'Donner can fly 19 km/s for 9 seconds, but then must rest for 164 seconds.', 'Blitzen can fly 19 km/s for 9 seconds, but then must rest for 158 seconds.', 'Comet can fly 13 km/s for 7 seconds, but then must rest for 82 seconds.', 'Cupid can fly 25 km/s for 6 seconds, but then must rest for 145 seconds.', 'Dasher can fly 14 km/s for 3 seconds, but then must rest for 38 seconds.', 'Dancer can fly 3 km/s for 16 seconds, but then must rest for 37 seconds.', 'Prancer can fly 25 km/s for 6 seconds, but then must rest for 143 seconds.' ]

var regex = /^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.$/

function parse(input) {
	return input.map(str => {
		var match = regex.exec(str)

		return {
			name: match[1],
			flySpeed: parseInt(match[2], 10),
			flyTime: parseInt(match[3], 10),
			restTime: parseInt(match[4], 10)
		}
	})
}

function convertToStartingState(reindeer) {
	reindeer.resting = false
	reindeer.secondsLeft = reindeer.flyTime
	reindeer.distanceTravelled = 0
	reindeer.score = 0
	return reindeer
}

function processOneSecond(reindeerState) {
	if (reindeerState.secondsLeft === 0) {
		reindeerState.resting = !reindeerState.resting

		reindeerState.secondsLeft = reindeerState.resting ? reindeerState.restTime : reindeerState.flyTime
	}

	if (!reindeerState.resting) {
		reindeerState.distanceTravelled += reindeerState.flySpeed
	}

	reindeerState.secondsLeft--

	return reindeerState
}

function processSecondForAllReindeer(allReindeer) {
	allReindeer.forEach(processOneSecond)

	var furthestDistance = allReindeer.sort(byDistanceTravelled)[0].distanceTravelled

	allReindeer.filter(reindeer => reindeer.distanceTravelled === furthestDistance)
		.forEach(reindeer => reindeer.score++)
}

function process(allReindeer, seconds) {
	for (var i = 0; i < seconds; ++i) {
		processSecondForAllReindeer(allReindeer)
	}
	return allReindeer
}

function byDistanceTravelled(a, b) {
	return b.distanceTravelled - a.distanceTravelled
}

var startingReindeer = parse(input)
	.map(convertToStartingState);

var results = process(startingReindeer, 2503)
	.sort((a, b) => b.score - a.score)

console.log(results)
