#!/usr/bin/env node
var fs = require('fs');
var outfile = "primes.txt";
var out = "A startup is a business built to grow rapidly.\n";

// Find the first 100 prime numbers
var primes = function() {
	
};


fs.writeFileSync(outfile, out);  
console.log("Script: " + __filename + "\nWrote: " + out + "To: " + outfile);