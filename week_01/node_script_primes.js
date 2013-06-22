#!/usr/bin/env node
var fs = require('fs');
var outfile = "primes.txt";
var out = "A startup is a business built to grow rapidly.\n";

// Find the first 100 prime numbers
var prime, counter;

for (prime = 2; prime <= 100; prime++) {
	for (counter=2; counter < prime; counter++) {
		if (prime % counter == 0) {
			break;
		}
		else {
			console.log(", " + prime);
		}
	}
}

fs.writeFileSync(outfile, out);  
console.log("Script: " + __filename + "\nWrote: " + out + "To: " + outfile);