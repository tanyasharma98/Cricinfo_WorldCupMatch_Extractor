# Cricinfo_WorldCupMatch_Extractor

The purpose of the project is to extract the information of World-Cup matches held in 2019 . And the extraction is presented in excel format and PDF scorecards.
 
Each excel sheet shows the information of the individual team which consists of scores against the opponent team and the result of the match if played. If any of one team played on the ground then scores of that team will be displayed . If a match was not held due to some reason the result will display without scores of the opponent team and that team itself.
 
The PDF-scorecard will show the data of the individual team in which team1 name and team2 name will be displayed with their scores individually and with the result of the match. The base template will be the same for every pdf-scorecard of the team.

## Setup

-> Download and install VS-code.
 
-> Download and install Node.js(Node.js is the runtime)
 
We are using Node.js as it is a platform for building fast and scalable server applications using JavaScript. 
 
->After this we will create a cricinfo.js file in a folder then we will invoke commands in the terminal


## Terminal Commands

npm is the Package Manager for Node.js modules

```bash
  npm init
```

Library used to parse argument for input

```bash
  npm install minimist
```
Library for processing the html from the source url

```bash
  npm install axios
```

Library for creating excel sheets

```bash
  npm install excel4node
```

Library for generating pdf files

```bash
  npm install pdf-lib
```
  ## Procedure
 
| Steps             | Description                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Require Library | npm libraries inbuild & download 
| Download Html |Use axios for downloading from url
| Extract information |Use jsdom on processed html|
| Manipulation | Manipulate data using array functions|
| Excel |Use excel4node to save data in excel|
| Folder |Create folder for saving pdf files|
| Pdf |Use pdf-lib to generate pdf|
 
 
 
-> Require Libraries in cricinfo.js file after invoking commands in Terminal.
 
let minimist = require("minimist");
 
let axios = require("axios");
 
let jsdom = require("jsdom");
 
let excel = require("excel4node");
 
let pdf = require("pdf-lib");
 
let fs = require("fs"); // For reading and writing data
 
let path = require("path"); // For joining the paths of file with folders and extensions 
 
let args = minimist(process.argv); // For input values
 
 
// download using axios
// extract information using jsdom
// manipulate data using array functions
// save in excel using excel4node
// create folders and prepare pdfs




## Process
 
->Now download data from the website in html document 
 
https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results
 
 
->After this, create a dom using the JSDOM library for extracting data processed by axios.
 
let dom = new jsdom.JSDOM(html);// html is data response
 
let document = dom.window.document;
 
 
-> Now Create an empty array for
 
let matches = [];
 
-> Extract data from document using query selector.
 
-> Push extracted data i.e team1 name , score and team2 name ,score and result of the match in array 
 
-> After this , convert parsed data into string using
 
let matchesKaJSON = JSON.stringify(matches);
 
This will create a `matches.json` file
 
 
 
->Now create an excel file `matchExcel.xls` , where each team has a different sheet for their matches.
 
->After this, create a `data` folder , where a pdf will be created for each team .
Here we will use Template.pdf as a base pdf format for each file.
 
->This pdf is the score-card for each match which will show the team name , team score ,opponent name , opponent score and result.
We will save the pdf in bytes and write it for each team match with their opponent.

## Code
-> Use these to check the input status
```javascript
console.log(args.source);
console.log(dataFolder);
console.log(excel);
```

  
## Deployment

To deploy this project run

### Before writting code invoke :-

```bash
npm init
npm install minimist
npm install axios
npm install jsdom
npm install excel4node
npm install path
npm install pdf-lib

```
### To invoke the cricinfo.js file invoke :-

```bash
node .\cricinfoExt.js --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results --dataFolder=data --excel=matchExcel.xls
```

  
