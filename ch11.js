var letterACharacter = 97
var letterZCharacter = 122
var aToZ = letterZCharacter - letterACharacter + 1

function valid(str) {
	return noConfusingLetters(str)
		&& twoPairs(str)
		&& containsStraightOfThree(str)
}

function toNumberArray(str) {
	return str.split('').map(function letterToNumber(character) {
		return character.charCodeAt()
	})
}

function noConfusingLetters(str) {
	return !/[iol]/.test(str)
}

function twoPairs(str) {
	var findingPairs = /([a-z])\1/g
	var pairs = []
	var match = null
	while ((match = findingPairs.exec(str)) !== null) {
		pairs.push(match[0])
	}

	var unique = pairs.reduce(function(map, key) {
		map[key] = true
		return map
	}, {})
	return Object.keys(unique).length > 1
}

function containsStraightOfThree(str) {
	var lastOne = null
	var lastTwo = null
	var sequencesOfThree = []
	toNumberArray(str).forEach(function(characterNumber) {
		if (lastOne !== null && lastTwo !== null) {
			sequencesOfThree.push(lastTwo.concat(characterNumber))
		}

		if (lastOne !== null) {
			lastTwo = [ lastOne, characterNumber ]
		}

		lastOne = characterNumber
	})

	return sequencesOfThree.some(function(seq) {
		return seq.reduce(function(last, current) {
			if (last === false) {
				return false
			}

			var soFarSoGood = (last === null || current === last + 1)
			return soFarSoGood ? current : false
		}, null)
	})
}

function increment(str) {
	var result = toNumberArray(str).reduceRight(function(memo, characterNumber) {
		if (memo.carry) {
			characterNumber++
		}

		var thisCharacter = {
			carry: false
		}
		if (characterNumber > letterZCharacter) {
			characterNumber = characterNumber - aToZ
			thisCharacter.carry = true
		}

		thisCharacter.characters = String.fromCharCode(characterNumber) + memo.characters

		return thisCharacter
	}, {
		carry: true,
		characters: ''
	})

	return result.carry ? 'a' + result.characters : result.characters
}

function assert(thing) {
	if (!thing) {
		throw new Error('failed', thing)
	}
}

function findNext(str) {
	var next = increment(str)
	while (!valid(next)) {
		next = increment(next)
	}
	return next
}

console.log(findNext('hxbxwxba'))
console.log(findNext('hxbxxyzz'))

assert(!noConfusingLetters('iarstarst'))
assert(noConfusingLetters('arstarst'))

assert(twoPairs('aabb'))
assert(twoPairs('zzarstoieanrstoenll'))
assert(!twoPairs('bbb'))
assert(!twoPairs('nuytnuyt'))

assert(!valid('hijklmmn'))
assert(!valid('abbceffg'))
assert(!valid('abbcegjk'))
assert(valid('abcdffaa'))
assert(valid('ghjaabcc'))

assert(increment('aaa') === 'aab')
assert(increment('aaz') === 'aba')
assert(increment('zzz') === 'aaaa')

assert(findNext('abcdefgh') === 'abcdffaa')
assert(findNext('ghijklmn') === 'ghjaabcc')
