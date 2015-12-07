var crypto = require('crypto')

var key = 'iwrupvqb'

function md5(str) {
	var hash = crypto.createHash('md5')
	hash.update(str, 'utf8')
	return hash.digest('hex')
}

function wins(str) {
	return str.indexOf('000000') === 0
}

function range(start, end, fn) {
	var shortCircuit = false
	for (var i = start; start <= end && !shortCircuit; ++i) {
		fn(i, function done(value) {
			shortCircuit = true
			console.log('found value', value)
		})
	}
}

range(0, 9999999, function(num, done) {
	var output = md5(key + num)
	if (wins(output)) {
		done(num)
	}
})


