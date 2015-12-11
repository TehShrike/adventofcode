function split(numberString) {
	var chunks = []
	var currentChunkCharacter = numberString[0]
	var nextChunk = ''

	function finishChunk() {
		if (nextChunk) {
			chunks.push(nextChunk)
			nextChunk = ''
		}
	}

	for (var i = 0; i < numberString.length; ++i) {
		var current = numberString[i]
		if (currentChunkCharacter !== current) {
			finishChunk()
			currentChunkCharacter = current
		}
		nextChunk += current
	}
	finishChunk()

	return chunks
}

function repeat(character, times) {
	var output = ''
	for (var i = 0; i < times; ++i) {
		output += character
	}
	return output
}

function translate(chunks) {
	return chunks.map(function(str) {
		var numberOfOccurrences = str.length
		var character = str[0]
		return '' + numberOfOccurrences + character
	}).reduce((output, str) => output + str)
}

var last = '1113122113'
for (var i = 0; i < 50; ++i) {
	last = translate(split(last))
}
console.log(last.length)
