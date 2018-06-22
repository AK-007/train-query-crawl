# train-query-crawl
A node app which crawls https://enquiry.indianrail.gov.in for fetching train details using cheerio.This is solution for the Git-Heat [Week-1](https://github.com/ietbitmesra/Git-Heat/tree/master/Week-1) challenge. This node app accepts a 5-digit train number as a command line argument.

## Features :
1. Provided info like - name,source,destination,schedule,running days of train
3. Stores the result in a .json file for future reference

## Running Locally :
Cloning and installing dependencies
```
  git clone https://github.com/AK-007/train-query-crawl
  cd train-query-crawl
  npm install
```
## Commands :
Now for getting the command's details for this app 
```
  node app.js --help
```
Or you can refer to this example for train query
```
  node app.js -t=12854
```
## Modules & Libraries used :
1. yargs - Used this as a command-line tool for parsing arguments
2. cheerio - Fast, flexible, and lean implementation of core jQuery designed specifically for the server used as a web-scraper.
3. fs - File system module for reading and writing into files
4. request-promise - The simplified HTTP request client 'request' with Promise support.
5. console-table - for well-formatted output

The *fileHandler.js* is used for reading and writing .json files.
