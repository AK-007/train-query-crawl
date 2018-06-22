var yargs = require('yargs');
var rp = require('request-promise');
var cheerio = require('cheerio');
const cTable = require('console.table');
var fs = require('./fileHandler');

const argv = yargs
    .options('train',{
        alias : 't',
        demand : true,
        describe : 'Train number whose information required',
        type : 'string'
    })
    .help()
    .alias('help','h')
    .argv;

var trainNumber = argv.train;
var addToFile = {}; // This object will contain train info for reference
var trainName,runningDays,source,destination;
var schedule = [];
var options = {
    // HTTP-request for checking the existence of a train
    uri: `https://enquiry.indianrail.gov.in/xyzabc/SelectedTrain?trainNo=${trainNumber}&langFile=props.en-us`,
    transform: function (body) {
        return cheerio.load(body);
    }
};
var options2 ={
    // HTTP-request for scraping the details
    uri: `https://enquiry.indianrail.gov.in/xyzabc/ShowTrainSchedule?trainNo=${trainNumber}&scrnSize=&langFile=props.en-us`,
    transform: function (body) {
        return cheerio.load(body);
    }
}
function print(){
    // Function to output data in command line
    console.log('');
    console.log("Train Name :",trainName);
    console.log('Runs on :',runningDays);
    console.log('Source :',source);
    console.log('Destination :',destination);
    console.log('');
    console.table(schedule);
};
rp(options).then(($) => {
    if($('body').text() === `XYZABC: Invalid train No. ${trainNumber}`){
        throw new Error('Train not present.');
    }
    var file = trainNumber + '.json';
    if(fs.checkFile(file)){
        // If the train's info is present locally , no need to crawl the website
        // fs.checkFile() checks whether the file is present
        var fileContent = fs.readFile(file); // Reading the file
        trainName = fileContent.trainName;
        runningDays = fileContent.runningDays;
        schedule = fileContent.schedule;
        source = fileContent.source;
        destination = fileContent.destination;
        print();
        throw new Error('Fetched from file present locally.'); // Threw error to skip the further HTTP requests
    }
    else{
        trainName = $('#trainDetailDiv b').eq(1).text();
        runningDays = $('#trainDetailDiv b').eq(3).text();
        source = $('#trainDetailDiv b').eq(4).text();
        destination = $('#trainDetailDiv b').eq(5).text();
        return rp(options2);
    }
}).then(($) => {
    var temp1,temp2,temp3,k;
    $('#trnSchDataTbl td').each((i, elem) => {
        if(i%5 === 1){
            // getting the station name
            temp1 = $('#trnSchDataTbl td').eq(i).text();
        }
        if(i%5 === 3){
            // getting the scheduled arrival and departure
            k = $('#trnSchDataTbl td').eq(i).has($('span')).text().replace(/\s+/g,'');
            if(i === 3){
                temp2 = '';
                temp3 = k;
            }
            else{
                temp2 = k.substring(0,5);
                temp3 = k.substring(5);
            }
        }
        if(i%5 === 4){
            schedule.push({
            Station : temp1,
            Arrival : temp2,
            Departure : temp3});
        }
    });
    print();
    addToFile.trainName = trainName;
    addToFile.runningDays = runningDays;
    addToFile.source = source;
    addToFile.destination = destination;
    addToFile.schedule = schedule;
    fs.writeFile(trainNumber+'.json',addToFile); // Writing to the file
}).catch((err) => {
    if(err.message === 'Train not present.' || err.message === 'Fetched from file present locally.'){
        console.log(err.message);
    }
    else console.log('No internet connection.');
});
