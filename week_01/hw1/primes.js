#!/usr/bin/env node
var fs = require('fs');
var outfile = "primes.txt";

function getPrimes(max) {
    var sieve = [], i, j, primes = [];
    for (i = 2; i <= max; ++i) {
        if (!sieve[i]) {
            primes.push(i);
            for (j = i << 1; j <= max; j += i) {
                sieve[j] = true;
            }
        }
    }
    return primes;
}

var out = getPrimes(550);

fs.writeFileSync(outfile, out);  
console.log("Script: " + __filename + "\nWrote: " + out + "\nTo: " + outfile);