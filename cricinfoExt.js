//npm init
// npm install minimist
// npm install axios
// npm install jsdom
// npm install excel4node
// npm install path
//npm install pdf-lib
// node .\cricinfoExt.js --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results --dataFolder=data --excel=matchExcel.xls


let minimist = require('minimist');
let fs = require('fs');
let axios = require('axios');
let jsdom = require("jsdom");
let excel = require('excel4node');
let path = require("path");
let pdf = require("pdf-lib");

let args = minimist(process.argv);

let responseKaPromise = axios.get(args.source);
responseKaPromise.then(function(response){
    let html = response.data;
    // console.log(html);
    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;
    // console.log(document.title);
    let matchScoreblock = document.querySelectorAll('div.match-score-block');
    // console.log(matchScoreblock.length)
    let matches =[];
    for(let i=0;i<matchScoreblock.length;i++){
        let match={
            t1: "",
            t2: "",
            t1s: "",
            t2s: "",
            result: ""
        };
        let teamParse = matchScoreblock[i].querySelectorAll('div.name-detail > p.name')
        match.t1= teamParse[0].textContent;
        match.t2= teamParse[1].textContent;

        let scoreSpan = matchScoreblock[i].querySelectorAll('div.score-detail > span.score');
        if(scoreSpan.length==2){
            match.t1s=scoreSpan[0].textContent;
            match.t2s=scoreSpan[1].textContent;
        }
        else if(scoreSpan.length==1){
            match.t1s=scoreSpan[0].textContent;
        }

        let resultSpan = matchScoreblock[i].querySelector('div.status-text > span');
        match.result = resultSpan.textContent;
        matches.push(match);
    }
    let matchesKaJSON = JSON.stringify(matches);
    fs.writeFileSync("matches.json", matchesKaJSON, "utf-8");

    let teams = []
    for(let i = 0; i < matches.length; i++){
       putTeamInTeamsArrayIfMissing(teams, matches[i]);
    }

    for(let i = 0; i < matches.length; i++){
        putMatchInAppropriateTeam(teams, matches[i]);
    }
    let teamsKaJSON = JSON.stringify(teams);
    fs.writeFileSync("teams.json", teamsKaJSON, "utf-8");
    // console.log(matches);
    // console.log(teams);

    createExcelFile(teams);
    createFolders(teams);

 })
//.catch(function(err){
//     console.log(err);
// })
function createFolders(teams){
    fs.mkdirSync(args.dataFolder,{recursive: true});
    for(let i=0;i<teams.length;i++){
        let folderName = path.join(args.dataFolder, teams[i].name);
        fs.mkdirSync(folderName,{recursive: true});
        for (let j = 0; j < teams[i].matches.length; j++){
            let matchFileName = path.join(folderName, teams[i].matches[j].VS + ".pdf");
            createScoreCard(teams[i].name, teams[i].matches[j], matchFileName);
        }
}
}
function createScoreCard(team, match, matchFileName){
    let t1 = team;
    let t2 = match.VS;
    let t1s = match.SelfScore;
    let t2s = match.OpponentScore;
    let result = match.Result;

    let bytesOfPDFTemplate = fs.readFileSync("Template.pdf");
    let pdfdocKaPromise = pdf.PDFDocument.load(bytesOfPDFTemplate);
    pdfdocKaPromise.then(function(pdfdoc){
        let page = pdfdoc.getPage(0);

        page.drawText(t1, {
            x: 321,
            y: 726,
            size: 12
        });
        page.drawText(t2, {
            x: 321,
            y: 712,
            size: 12
        });
        page.drawText(t1s, {
            x: 321,
            y: 698,
            size: 12
        });
        page.drawText(t2s, {
            x: 321,
            y: 684,
            size: 12
        });
        page.drawText(result, {
            x: 320,
            y: 670,
            size: 12
        });

        let finalPDFBytesKaPromise = pdfdoc.save();
        finalPDFBytesKaPromise.then(function(finalPDFBytes){
            fs.writeFileSync(matchFileName, finalPDFBytes);
        })
    })
}
function createExcelFile(teams){
    let wb = new excel.Workbook();
    for(let i=0;i<teams.length;i++){
        let sheet = wb.addWorksheet(teams[i].name);

        sheet.cell(1, 1).string("VS");
        sheet.cell(1, 2).string("Self Score");
        sheet.cell(1, 3).string("Opp Score");
        sheet.cell(1, 4).string("Result");
        for(let j=0;j<teams[i].matches.length;j++){
            sheet.cell(2 + j, 1).string(teams[i].matches[j].VS);
            sheet.cell(2 + j, 2).string(teams[i].matches[j].SelfScore);
            sheet.cell(2 + j, 3).string(teams[i].matches[j].OpponentScore);
            sheet.cell(2 + j, 4).string(teams[i].matches[j].Result);
        }
    }
    wb.write(args.excel);
}
function putTeamInTeamsArrayIfMissing(teams, match){
    let t1idx=-1;
    for(let i=0;i<teams.length;i++){
        if(teams[i].name==match.t1){
            t1idx=i;
            break;
        }
    }
     if (t1idx == -1) {
        teams.push({
            name: match.t1,
            matches: []
        });
    }
    let t2idx=-1;
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].name == match.t2) {
            t2idx = i;
            break;
        }
    }

    if (t2idx == -1) {
        teams.push({
            name: match.t2,
            matches: []
        });
    }
}
function putMatchInAppropriateTeam(teams, teamName){
    let t1idx=-1;
    for(let i=0;i<teams.length;i++){
        if(teams[i].name==teamName.t1){
            t1idx = i;
            break;
        }
    }
    let team1 = teams[t1idx];
    team1.matches.push({
        VS: teamName.t2,
        SelfScore: teamName.t1s,
        OpponentScore: teamName.t2s,
        Result: teamName.result
    });
    let t2idx=-1;
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].name == teamName.t2) {
            t2idx = i;
            break;
        }
    }

    let team2 = teams[t2idx];
    team2.matches.push({
        VS: teamName.t1,
        SelfScore: teamName.t2s,
        OpponentScore: teamName.t1s,
        Result: teamName.result
    });
}
