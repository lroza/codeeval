var BitArray = function(n) {
	this.length = n;
	this.buffer = new Buffer(Math.ceil(n / 8));
}

BitArray.prototype.fill = function(n) {
	if(n) {
		this.buffer.fill(255);
	} else {
		this.buffer.fill(0);
	}
}

BitArray.prototype.validateIndex = function(n) {
	if (typeof n !== "number" || n % 1 > 0) {
		throw Error("Invalid index: " + n);
	} else if(n < 0 || n >= this.length) {
		throw Error("Index out of bounds: " + n);
	}
}

BitArray.prototype.get = function(n) {
	this.validateIndex(n);
	return (this.buffer[Math.floor(n / 8)] & Math.pow(2, n % 8)) >> n % 8;
}

BitArray.prototype.set = function(n) {
	this.validateIndex(n);
	this.buffer[Math.floor(n / 8)] |= Math.pow(2, n % 8);
}

BitArray.prototype.clear = function(n) {
	this.validateIndex(n);
	this.buffer[Math.floor(n / 8)] &= Math.pow(2, n % 8) ^ 255;
}

var SieveOfEratosthenes = function(max_n) {
	var l = Math.floor((max_n - 1) / 2)
	this.bits = new BitArray(l);
	this.bits.fill(1);
	for(i = 0; i < l; i++) {
		if(this.bits.get(i)) {
			var n = i * 2 + 3;
			for(j = i + n; j < l; j += n) {
				this.bits.clear(j);
			}
		}
	}
}

SieveOfEratosthenes.prototype.getIterator = function() {
	var nextIndex = -1;
	var bits = this.bits;

	return {
		bits: bits,
		next: function() {
			if (nextIndex === -1) {
				++nextIndex;
				return 2;
			} else if (nextIndex >= this.bits.length) {
				return null;
			} else {
				var n = nextIndex * 2 + 3;
				while(++nextIndex < this.bits.length && this.bits.get(nextIndex) === 0);
				return n;
			}
		}
	}
}

var max_n = 0;

var ns = [];

var fs  = require("fs");
fs.readFileSync(process.argv[2]).toString().split('\n').forEach(function (line) {
    if (line !== "") {
		var n = parseInt(line);
		ns.push(n);
		if(n > max_n) {
			max_n = n;
		}
    }
});

var sieve = new SieveOfEratosthenes(max_n);
for(i = 0; i < ns.length; i++) {
	var n = ns[i];
	var it = sieve.getIterator();
	var p = it.next();
	if(p < n) {
		process.stdout.write(p.toString());
		p = it.next();
	}
	while(p < n && p !== null) {
		process.stdout.write(",");
		process.stdout.write(p.toString());
		p = it.next();
	}
	process.stdout.write("\n");
}

