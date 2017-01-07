var getTopGames = new XMLHttpRequest(); 

getTopGames.onload = function(){
    response = JSON.parse(getTopGames.responseText);
    listGames(response); 

    //Viewers + Ratio 
    listStats(response); 
    console.log(sumOfTotalTwitchViewers(response)); 

}

getTopGames.open('GET','http://localhost:8080/topgames',true); 
getTopGames.send(); 


function listGames(response){
    var table = document.createElement('table');
    table.setAttribute('class','table table-hover'); 
    var thead = document.createElement('thead'); 
    var theadrow = document.createElement('tr'); 
    var tbody = document.createElement('tbody'); 
    createTableData('Top 10 Games','th',thead);
    createTableData('Viewers','th',thead); 
    createTableData('Channels','th',thead); 
    createTableData('Viewers Per Channel','th',thead);
    createTableData('% of Total Viewers','th',thead); 
    createTableData('% of Total Channels','th',thead); 
    createTableData('Reza Ratio','th',thead);
    table.appendChild(thead); //attach thead to the table
    table.appendChild(tbody); 

    document.getElementById('channeldatatable').appendChild(table); 
      for(var i=0; i<response.top.length;i++){
        var tr = document.createElement('tr'); 
        tr.setAttribute('id',response.top[i].game._id);
        tbody.appendChild(tr); 
        var newNode = document.createTextNode(response.top[i].game.name); 
        var newEleTd = document.createElement('td'); 
        tr.appendChild(newEleTd); 
        var newImg = document.createElement('img'); 
        newImg.setAttribute('src',response.top[i].game.logo.small); 
        newImg.setAttribute('class','logo'); 
        newEleTd.appendChild(newImg); 
        newEleTd.appendChild(newNode); 
    }
};

function listStats(response){
    var game = sumOfTotalTwitchViewers(); 
    var ctx = document.getElementById("myChart");

    for(var i = 0; i < response.top.length;i++){
        var gameRow = document.getElementById(response.top[i].game._id)
        createTableData(game.gameInfo.viewers[i],'td',gameRow); 
        createTableData(game.gameInfo.channels[i],'td',gameRow)
        createTableData(Math.floor(game.gameInfo.viewers[i]/game.gameInfo.channels[i]),'td',gameRow);
        createTableData((game.gameInfo.viewers[i]/game.totals.viewerSum*100).toFixed(1),'td',gameRow); 
        createTableData((game.gameInfo.channels[i]/game.totals.channelSum*100).toFixed(1),'td',gameRow);
        createTableData(game.ratios.rezaScore[i],'td',gameRow); 
        
    var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [game.gameInfo.name[0], game.gameInfo.name[1], 
        game.gameInfo.name[2], game.gameInfo.name[3],
        game.gameInfo.name[4],game.gameInfo.name[5],
        game.gameInfo.name[6],game.gameInfo.name[7],
        game.gameInfo.name[8],game.gameInfo.name[9]],
        datasets: [{
            label: '# of Votes',
            fontStyle: 'bold',
            data: [game.ratios.rezaScore[0], game.ratios.rezaScore[1], game.ratios.rezaScore[2], 
            game.ratios.rezaScore[3], game.ratios.rezaScore[4],game.ratios.rezaScore[5],
            game.ratios.rezaScore[6],game.ratios.rezaScore[7],game.ratios.rezaScore[8],
            game.ratios.rezaScore[9]],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',

            ],
            borderWidth: 0
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
}
       


    }


function createTableData(property,element,parent){
    var node = document.createTextNode(property); 
    var td = document.createElement(element); 
    td.appendChild(node); 
    parent.appendChild(td); 
}

//Sum Total of Top 10 Twitch Viewers using ES6 Reduce 

function sumOfTotalTwitchViewers(){
    var sumOfViewerResults = []; 
    var sumOfChannelResults = []; 
    var gameObj={
        gameInfo:{
            name:[],
            viewers: [],
            channels: []
        },
        totals:
        {
        viewerSum: [],
        channelSum: []
        }, 
        ratios:{
            rezaScoreViewers:[],
            rezaScoreChannels:[],
            rezaScore:[]
        }
    };

    for(var i = 0; i < response.top.length; i++){
        sumOfViewerResults.push(response.top[i].viewers);
        sumOfChannelResults.push(response.top[i].channels); 
        gameObj.gameInfo['name'].push(response.top[i].game.name); 
        gameObj.gameInfo['viewers'].push(response.top[i].viewers); 
        gameObj.gameInfo['channels'].push(response.top[i].channels); 
    }
    gameObj.totals['viewerSum'] = sumOfViewerResults.reduce(add,0); 
    gameObj.totals['channelSum'] = sumOfChannelResults.reduce(add,0); 

    for(var i = 0; i <response.top.length;i++){
        gameObj.ratios['rezaScoreViewers'].push(gameObj.gameInfo.viewers[i]/(gameObj.totals['viewerSum'])*100);
        gameObj.ratios['rezaScoreChannels'].push(gameObj.gameInfo.channels[i]/gameObj.totals['channelSum']*100);
    }

    for(var i = 0; i<response.top.length;i++){
        gameObj.ratios['rezaScore'].push((gameObj.ratios.rezaScoreViewers[i]/gameObj.ratios.rezaScoreChannels[i]).toPrecision(3)); 
    }

    return gameObj; 
};

var add = function(a,b){
        return a +b; 
    }


// var viewersImg = document.getElementById('gamesviewers-img');
// var viewers = document.getElementById('gameviewers'); 

// var getTopGames = new XMLHttpRequest();  
//     getTopGames.onload=function(){
//         response = JSON.parse(getTopGames.responseText);
//         var newImg = document.createElement('img'); 

//         // newImg.setAttribute('src',response.top[0].game.box.medium);
//         // newImg.setAttribute('class','img-fixed');
//         // newImg.setAttribute('id','game-leader-img');
//         // viewersImg.appendChild(newImg); 
//         for(i=0; i<10;i++){
//             createTableDataWithListener(response.top[i].game.name + ' : ' + response.top[i].viewers,
//                                         response.top[i].game.logo.small,'p',viewers);
//             console.log(response.top[i].game.name,'p',viewers); 
//         }
//     };
//     getTopGames.open('GET','http://localhost:8080/topgames',true);
//     getTopGames.send();

// function createTableDataWithListener(property,imgElement,element,parent){
//     var node = document.createTextNode(property); 
//     var td = document.createElement(element); 
//     var newImg  = document.createElement('img');
//     newImg.setAttribute('src',imgElement); 
//     td.appendChild(newImg); 
//     td.appendChild(node); 
//     parent.appendChild(td); 
// };