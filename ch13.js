// var input = ['Alice would gain 54 happiness units by sitting next to Bob.', 'Alice would lose 79 happiness units by sitting next to Carol.', 'Alice would lose 2 happiness units by sitting next to David.', 'Bob would gain 83 happiness units by sitting next to Alice.', 'Bob would lose 7 happiness units by sitting next to Carol.', 'Bob would lose 63 happiness units by sitting next to David.', 'Carol would lose 62 happiness units by sitting next to Alice.', 'Carol would gain 60 happiness units by sitting next to Bob.', 'Carol would gain 55 happiness units by sitting next to David.', 'David would gain 46 happiness units by sitting next to Alice.', 'David would lose 7 happiness units by sitting next to Bob.', 'David would gain 41 happiness units by sitting next to Carol.']

var input = ['Alice would gain 2 happiness units by sitting next to Bob.','Alice would gain 26 happiness units by sitting next to Carol.','Alice would lose 82 happiness units by sitting next to David.','Alice would lose 75 happiness units by sitting next to Eric.','Alice would gain 42 happiness units by sitting next to Frank.','Alice would gain 38 happiness units by sitting next to George.','Alice would gain 39 happiness units by sitting next to Mallory.','Bob would gain 40 happiness units by sitting next to Alice.','Bob would lose 61 happiness units by sitting next to Carol.','Bob would lose 15 happiness units by sitting next to David.','Bob would gain 63 happiness units by sitting next to Eric.','Bob would gain 41 happiness units by sitting next to Frank.','Bob would gain 30 happiness units by sitting next to George.','Bob would gain 87 happiness units by sitting next to Mallory.','Carol would lose 35 happiness units by sitting next to Alice.','Carol would lose 99 happiness units by sitting next to Bob.','Carol would lose 51 happiness units by sitting next to David.','Carol would gain 95 happiness units by sitting next to Eric.','Carol would gain 90 happiness units by sitting next to Frank.','Carol would lose 16 happiness units by sitting next to George.','Carol would gain 94 happiness units by sitting next to Mallory.','David would gain 36 happiness units by sitting next to Alice.','David would lose 18 happiness units by sitting next to Bob.','David would lose 65 happiness units by sitting next to Carol.','David would lose 18 happiness units by sitting next to Eric.','David would lose 22 happiness units by sitting next to Frank.','David would gain 2 happiness units by sitting next to George.','David would gain 42 happiness units by sitting next to Mallory.','Eric would lose 65 happiness units by sitting next to Alice.','Eric would gain 24 happiness units by sitting next to Bob.','Eric would gain 100 happiness units by sitting next to Carol.','Eric would gain 51 happiness units by sitting next to David.','Eric would gain 21 happiness units by sitting next to Frank.','Eric would gain 55 happiness units by sitting next to George.','Eric would lose 44 happiness units by sitting next to Mallory.','Frank would lose 48 happiness units by sitting next to Alice.','Frank would gain 91 happiness units by sitting next to Bob.','Frank would gain 8 happiness units by sitting next to Carol.','Frank would lose 66 happiness units by sitting next to David.','Frank would gain 97 happiness units by sitting next to Eric.','Frank would lose 9 happiness units by sitting next to George.','Frank would lose 92 happiness units by sitting next to Mallory.','George would lose 44 happiness units by sitting next to Alice.','George would lose 25 happiness units by sitting next to Bob.','George would gain 17 happiness units by sitting next to Carol.','George would gain 92 happiness units by sitting next to David.','George would lose 92 happiness units by sitting next to Eric.','George would gain 18 happiness units by sitting next to Frank.','George would gain 97 happiness units by sitting next to Mallory.','Mallory would gain 92 happiness units by sitting next to Alice.','Mallory would lose 96 happiness units by sitting next to Bob.','Mallory would lose 51 happiness units by sitting next to Carol.','Mallory would lose 81 happiness units by sitting next to David.','Mallory would gain 31 happiness units by sitting next to Eric.','Mallory would lose 73 happiness units by sitting next to Frank.','Mallory would lose 89 happiness units by sitting next to George.']

var parseRegex = /^(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)\.$/

function parseRelationships(input) {
	return input.map(str => {
		var match = parseRegex.exec(str)
		return {
			name: match[1],
			gain: (match[2] === 'gain' ? 1 : -1) * parseInt(match[3], 10),
			nextTo: match[4]
		}
	}).reduce((map, row) => {
		if (!map[row.name]) {
			map[row.name] = {}
		}

		map[row.name][row.nextTo] = row.gain

		return map
	}, {})
}

function mostlyFlatten(arys) {
	return arys.reduce((memo, next) => memo.concat(Array.isArray(next[0][0]) ? mostlyFlatten(next) : next), [])
}

function allPossibilities(current, available) {
	if (available.length === 0) {
		return current
	}
	return available.map(name => {
		return {
			current: current.concat(name),
			available: available.filter(availableName => availableName !== name)
		}
	}).map(nextStep => allPossibilities(nextStep.current, nextStep.available))
}

function calculateScore(relationships, order) {
	function nameToLeft(i) {
		return order[(i === order.length - 1) ? 0 : i + 1]
	}
	function nameToRight(i) {
		return order[i === 0 ? order.length - 1 : i - 1]
	}

	return order.map((name, index) => {
		var left = nameToLeft(index)
		var right = nameToRight(index)
		return relationships[name][left] + relationships[name][right]
	})
}

function sum(a, b) {
	return a + b
}

function solveForRelationships(relationships) {
	var possibilities = mostlyFlatten(allPossibilities([], Object.keys(relationships)))
	return possibilities.map(order => {
		return {
			score: calculateScore(relationships, order).reduce(sum),
			order: order
		}
	}).sort((a, b) => b.score - a.score)[0].score
}

function addMyselfToRelationships(relationships) {
	var withMe = {
		me: Object.keys(relationships).reduce((o, name) => {
			o[name] = 0
			return o
		}, {})
	}

	Object.keys(relationships).forEach(name => {
		withMe[name] = relationships[name]
		relationships[name].me = 0
	})

	return withMe
}

// console.dir(allPossibilities([], ['Alice', 'Bob', 'Carol', 'David'])[0][0])

// console.log(calculateScore(relationships, ['Alice', 'David', 'Bob', 'Carol']))
console.log(solveForRelationships(addMyselfToRelationships(parseRelationships(input))))
console.log(solveForRelationships(parseRelationships(input)))
