#!/usr/bin/env node
var fs = require('fs');
var outfile = "primes.txt";
var out = "Primes from 1 to 100:\n";


var isPrime, candidate, last, i;




fs.writeFileSync(outfile, out);  
console.log("Script: " + __filename + "\nWrote: " + out + "To: " + outfile);


//Old C Code

int main (int argc, const char * argv[])
{
    int isPrime, candidate, last, i;
    
    printf("Primes from 1 to 100:\n");
    printf("2\n");
    
    for (candidate = 3; candidate <= 100; candidate += 2) {
        isPrime = true;
        last = sqrt(candidate);
        for (i = 3; (i <= last) && isPrime; i += 2) {
            if ((candidate % i) == 0)
                isPrime = false;
        }
        
        if (isPrime)
            printf("%d\n", candidate);
    }

    return 0;
}