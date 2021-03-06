function changeTables(){
    var tablelarge = document.getElementById('tablelarge')
    var tableshort = document.getElementById('tableshort')
    if(window.innerWidth >= 960){
        tablelarge.classList.remove("hide")
        tableshort.classList.add("hide")
    }else{
        tablelarge.classList.add("hide")
        tableshort.classList.remove("hide")
    }
}

window.addEventListener('load', changeTables);
window.addEventListener('resize', changeTables);


function askForData(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        drawTable(JSON.parse(this.response));
    };

    xhr.open("POST", '/data', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        value: "value"
    }));
}

function isoToDate(iso){
    var date_utc = new Date(iso)
    return new Date(Date.UTC(date_utc.getFullYear(), date_utc.getMonth(), date_utc.getDate(),
                                    date_utc.getHours(), date_utc.getMinutes(), date_utc.getSeconds()));
        
}

function updateTime(){
    var ut = JSON.parse(document.getElementById('updatetime').innerHTML)
    if(ut.update == "no"){
        return
    }
    songs = data
    var first_song = songs[18]
    var last_song = songs[songs.length-1]
    var date_current = new Date(ut.time)
    var date_first = new Date(first_song.time)
    var date_last = new Date(last_song.time)
    delta1 = (date_current-date_first)/(1000-ut.number)
    delta2 = (date_last-date_current)/(ut.number-50)
    for(var i = 0; i < songs.length; i++){
        var song = songs[i]
        if(song.number.startsWith('YM') || song.number.startsWith('SET') || song.number.startsWith('ASOT')){
            continue
        }
        var date = new Date(songs[i].time)
        if(parseInt(song.number) >= parseInt(ut.number)){
            var date = new Date(date_first.getTime() + delta1*(1000-song.number));
            data[i].time = date.toISOString()
            
        }else{
            data[i].time = new Date(date_last.getTime() - delta2*(song.number-50));
        }
    }
}


function drawTable(){
    //updateTime()
    var table = document.getElementById("tablesongslarge")
    var table2 = document.getElementById("tablesongsshort")
    table.innerHTML = ""
    table2.innerHTML = ""
    songs = data

    var currentnumber = songs[0].number
    var currentartist = songs[0].artist
    var currenttitle = songs[0].title
    var currentcolor = songs[0].color
    var currentsong
    var currentsong2

    for(var i = 0; i < songs.length; i++){
        /*
        var date_utc = new Date(songs[i].time)
        var date = new Date(Date.UTC(date_utc.getFullYear(), date_utc.getMonth(), date_utc.getDate(),
                                    date_utc.getHours(), date_utc.getMinutes(), date_utc.getSeconds()));
        var now = new Date()
        
        if(now >= date){
            currentnumber = songs[i].number
            currentartist = songs[i].artist
            currenttitle = songs[i].title
            currentcolor = songs[i].color
            if(document.getElementById('showallselector').innerHTML == "show"){
                continue
            }
        }
        
        var options = { weekday: 'short', day: '2-digit' , hour: "2-digit", minute: "2-digit", hour12:false};
        timestr = date.toLocaleString(navigator.languages, options).toUpperCase()
        */

        var row = table.insertRow(-1);
        var artist = row.insertCell(-1);
        var title = row.insertCell(-1);
        //var time = row.insertCell(-1);
        
        row.classList.add("song")

        divartist = '<div class="number">' + songs[i].number + '</div> <div class="artist">' + songs[i].artist + '</div>'

        artist.classList.add("artistrow");
        artist.style.color = "hsl(" + songs[i].color + ", 63%, 64%)";
        artist.innerHTML = divartist;

        title.classList.add("title");
        title.innerHTML = songs[i].title;

        //time.classList.add("time");
        //time.innerHTML = timestr;



        row2 = table2.insertRow(-1);
        var shortright = row2.insertCell(-1);
        var shortleft = row2.insertCell(-1);
        
        row2.classList.add("song")

        shortright.classList.add("shortright");
        shortright.innerHTML = '<span class="number short" style="color: hsl(' + songs[i].color + ', 63%, 64%);">' + songs[i].number + '</span>'
        //                        + '<br><span class="time short">' + timestr + '</span>';

        shortleft.classList.add("shortleft");
        shortleft.innerHTML = '<span class="artist short" style="color: hsl(' + songs[i].color + ', 63%, 64%);">' + songs[i].artist + '</span>' + '<br><span class="title short">' + songs[i].title + '</span>'
        /*
        if(now >= date){
            currentsong = row
            currentsong2 = row2
        }
        */
    }

    catJAM = '<img src="static/catJAM.gif"></img>'
    document.getElementById('currentnumber').innerHTML = "#" + currentnumber
    document.getElementById('currentartist').innerHTML = currentartist
    document.getElementById('currenttitle').innerHTML = currenttitle
    document.getElementById('centercurrent').style.backgroundColor = 'hsl(' + currentcolor + ', 63%, 64%)';
    /*
    if(document.getElementById('showallselector').innerHTML != "show"){
        console.log(currentsong.innerHTML)
        colorback = currentcolor + 180;
        currentsong.style.backgroundColor = "hsl(" + colorback + ", 63%, 64%)";
        currentsong2.style.backgroundColor = "hsl(" + colorback + ", 63%, 64%)";
    }
    */
}

window.addEventListener('load', drawTable);


function showAll(){
    if(document.getElementById('showallselector').innerHTML == "show"){
        document.getElementById('showallselector').innerHTML = "hide"
        document.getElementById('showall').innerHTML = "Show next songs"
    }else{
        document.getElementById('showallselector').innerHTML = "show"
        document.getElementById('showall').innerHTML = "Show all songs"
    }
    drawTable()
}