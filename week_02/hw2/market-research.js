#!/usr/bin/env node
/*
Use the Yahoo Finance CSV API to do some basic market research calculations.

 - Background: http://greenido.wordpress.com/2009/12/22/yahoo-finance-hidden-api/
 - Example URL: http://finance.yahoo.com/d/quotes.csv?s=GOOG+FB+AAPL&f=snj1pr
    s:  Symbol
    n:  Name
    j1: Market Capitalization (in billions)
    p:  Price-per-share (at previous close)
    r:  Price to Earnings Ratio

Further references.

 - https://github.com/danwrong/restler
 - https://github.com/wdavidw/node-csv
 - http://josscrowcroft.github.io/accounting.js
 - http://stackoverflow.com/questions/4981891/node-js-equivalent-of-pythons-if-name-main
 - http://nodejs.org/docs/latest/api/util.html#util_util_format_format

*/

var util = require('util');
var fs = require('fs');
var rest = require('restler');
var csv = require('csv');
var accounting = require('accounting');
var CSVFILE_DEFAULT = "market-research.csv";
var SYMBOLS_DEFAULT = ["GOOG", "FB", "AAPL", "YHOO", "MSFT", "LNKD", "CRM"];
var COLUMNS_DEFAULT = 'snj1pr'; // http://greenido.wordpress.com/2009/12/22/yahoo-finance-hidden-api
var HEADERS_DEFAULT = ["Symbol", "Name", "Market Cap", "Previous Close Price", 
                       "P/E Ratio", "Shares", "EPS", "Earnings"];

var financeurl = function(symbols, columns) {
    return util.format(
        'http://finance.yahoo.com/d/quotes.csv?s=%s&f=%s',
        symbols.join('+'),
        columns);
};

var marketCapFloat = function(marketCapString) {
    return parseFloat(marketCapString.split('B')[0]) * 1e9;
};

var csv2console = function(csvfile, headers) {
    console.log(headers.join("\t"));
    csv()
    .from.path(csvfile)
    .on('record', function(row, index) {
        var shares = Math.round(marketCapFloat(row[2])/row[3], 0);
        var eps = (row[3]/row[4]).toFixed(3);
        var earnings = accounting.formatMoney(eps * shares);
        outrow = row.concat([shares, eps, earnings]);
        console.log(outrow.join("\t"));
    });
};

var buildfn = function(csvfile, headers) {
    var response2console = function(result, response) {
        if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
        } else {
            console.error("Wrote %s", csvfile);
            fs.writeFileSync(csvfile, result);
            csv2console(csvfile, headers);
        }
    };
    return response2console;
};

var marketResearch = function(symbols, columns, csvfile, headers) {
    symbols = symbols || SYMBOLS_DEFAULT;
    columns = columns || COLUMNS_DEFAULT;
    csvfile = csvfile || CSVFILE_DEFAULT;
    headers = headers || HEADERS_DEFAULT;
    var apiurl = financeurl(symbols, columns);
    var response2console = buildfn(csvfile, headers);
    rest.get(apiurl).on('complete', response2console);
};

if(require.main == module) {
    console.error('Invoked at command line.');
    var symbols = process.argv;
    if(symbols.length > 2) {
        symbols = symbols.slice(2, symbols.length);
    } else {
        symbols = undefined;
    };
    marketResearch(symbols);
} else {
    console.error('Invoked via library call');
}

exports.marketResearch = marketResearch;
