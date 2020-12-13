var countryId;
var frame = 1;
var days = -1;
var timeDays;
var timeMonths;
var timeYears;
var currentMapId = "";
var gameFlags = {};
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var paused = true;
var eventId = "";

var countries = {
    "SOV": {
        "id": "SOV",
        "name": "Union of Soviet Sovereign Republics",
        "leader": "Gorbachev"
    }
}

var leaders = {
    "Gorbachev": {
        "name": "Mikhail Gorbachev",
        "party": "Socialist Confederation Party",
        "position": "President",
        "summary": "As the Soviet grasp on Eastern Europe fell in the 80s and 90s, General Secretary Mikhail Gorbachev of the Soviet Union knew that the Union would be soon facing a large debate: Collapse or Reform?<br>As Gorbachev chose the latter option, the reformation of the Soviet Union would begin. While the Baltic States would never remain under control of Moscow, the rest of the Union would, albeit in a much difference way. The Soviet Union reformed into a new Soviet Union, a confederation of autonomous socialist republics. With the Confederation entering not just a new century but a new millenium, who knows what will come of this fledgling union?"
    },
    "Kravchuk": {
        "name": "Leonid Kravchuk",
        "party": "Democratic Revolutionary Party of Ukraine",
        "position": "President",
        "summary": ""
    },
    "Yanayev": {
        "name": "Gennady Yanayev",
        "party": "All-Union Communist Party (Bolsheviks)",
        "position": "General Secretary",
        "summary": "A staunch conservative and anti-reformist, General Secretary Gennady Yanayev marks a return to totalitarianism and hard-left Bolshevism for the Soviet Union. Heading a group of anti-Gorbachev Communists and with significant support from the Soviet Armed Forces, he successfully lead a coup to bring an end to the Confederation and restoration of the Soviet Union. It began when Warships and a Tank division surrounds Gorbachev in his summer villa, placing him under house arrest. Simultaneously, President of the Russian Soviet Federation Boris Yeltsin is arrested by KGB officials and Army soldiers loyal to Yanayev. The Supreme Soviet then voted, with pressure from the Army, to adopt a new constitution, once again making the General Secretary the leading force in the country. Not long afterwards, the Supreme Soviet elected Yanayev to power and he began to quickly reverse the reforms of the last fifteen years."
    }
}

var events = {
    "": {
        "title": "",
        "desc": "",
        "buttons": []
    },
    "2000_russian_election.1": {
        "title": "2000 Russian Presidential Election",
        "desc": "In Russia, our new democracy is now in the midst of its fourth presidential election. The current President of the Russian Socialist Federation, Boris Yeltsin, is running for re-election under the Russian Social Democratic Party, the largest branch of the Socialist Confederation Party in Russia. Being president for ten years, he can be blamed for many of Russia's problems while simultaneously being able to attribute himself to the successes. He faces stiff competition from Gennady Zyuganov, Chairman of the Russian Communist Party, a section of the Confederation wide All-Union Communist Party which seeks to restore the USSR back to the glory days of before Gorbachev and his reforms. The fate of Russia depends on this election. Even if Yeltsin wins another re-election, the political situation surrounding the election may very well change the landscape of Russia and the whole Union.",
        "buttons": [{
            "label": "Democracy has worked... so far",
            "id": "2000_russian_election.1.a",
            "log": true
        }]
    },
    "2000_russian_election.2": {
        "title": "Yeltsin Victory in the Election",
        "desc": "Yeltsin has won the 2000 Russian Presidential Election, winning 53% of the vote. The follow up, Gennady Zyuganov,  won a total of 34% of the vote, showing the remaining support for Communism and the dreams of the Russian people for a restoration of the Soviet populace.",
        "buttons": [{
            "label": "Four more years",
            "id": "2000_russian_election.2.a",
            "log": true
        }]
    }
}
var decisions = {
    "purge-the-communists": {
        "title": "Purge the Communists",
        "desc": "The hardline Communists, remaining loyal to the Bolsheviks of the Soviet Union including Comrade Stalin, have proved a thorn in the backside of the Confederation since it was first established in the 90s.",
        "log": true
    },
    "anti-reformist-coup": {
        "title": "Anti-Reformist Coup",
        "desc": "The reformist policies of President Gorbachev and his \"socialist\" allies have proved devastating for the Soviet Union and it's people. It is time for the Union to be restored to its former glory like that of the years under Comrades Breshnev, Stalin and Lenin.",
        "log": true
    }
}

function setCountry(id) {
    countryId = id;
    document.getElementById("countryName").innerHTML = countries[id].name;
    document.getElementById("leaderPortrait").src = `leaders/${countries[id].leader}.png`;
    document.getElementById("leaderName").innerHTML = `${leaders[countries[id].leader].name}`;
    document.getElementById("leaderParty").innerHTML = `${leaders[countries[id].leader].party}`;
    document.getElementById("leaderPosition").innerHTML = `${leaders[countries[id].leader].position}`;
    document.getElementById("leaderSummary").innerHTML = `${leaders[countries[id].leader].summary}`;
}

function updateCountry(id) {
    if (countryId == id) {
        setCountry(id);
    }
}

function setLeader(country, id) {
    countries[country].leader = id;
}

function setEvent(id) {
    document.getElementById("eventTitle").innerHTML = events[id].title;
    document.getElementById("eventDesc").innerHTML = events[id].desc;
    document.getElementById("eventButtons").innerHTML = "";
    events[id].buttons.forEach((value) => {
        var btn = document.createElement("button");
        btn.innerHTML = value.label;
        btn.onclick = function() { effect(value.id, value.label, value.log, false) };
        btn.id = value.id;
        btn.style.width = "100%";
        document.getElementById("eventButtons").appendChild(btn);
    });
    document.getElementById("eventLog").innerHTML += events[id].title
    eventId = events[id].title;
}


function addDecision(id) {
    var decision = document.createElement("tr");
    decision.id = id + "-decision";
    var child = document.createElement("td");
    child.innerHTML = "<b>" + decisions[id].title + "</b>";
    decision.appendChild(child);
    var child = document.createElement("td");
    child.innerHTML = decisions[id].desc;
    decision.appendChild(child);
    var child = document.createElement("td");
    var child2 = document.createElement("button");
    child2.innerHTML = "&#10003;";
    child2.id = id;
    child2.onclick = function() { effect(id, decisions[id].label, decisions[id].log, true) }
    child.appendChild(child2);
    decision.appendChild(child);
    document.getElementById("decisions").appendChild(decision);
}

function removeDecision(id) {
    if (document.getElementById(id + "-decision") != null) {
        document.getElementById(id + "-decision").remove();
    }
}

function effect(id, title, addLog = true, isDecision = false) {
    {
        if (!isDecision) {
            document.getElementById("eventTitle").innerHTML = ""
            document.getElementById("eventDesc").innerHTML = ""
            document.getElementById("eventButtons").innerHTML = "";
            if (addLog) { document.getElementById("eventLog").innerHTML += " - " + title + "<br>"; }
        } else {
            removeDecision(id);
        }
        switch (id) {
            case "2000_russian_election.1.a":
                eventId = "";
                gameFlags["2000_russian_election"] = true;
                setEvent("2000_russian_election.2");
                break;
            case "2000_russian_election.2.a":
                eventId = "";
                setEvent("");
                break;
        }
        console.log(id);
    }
}

function setMap(id) {
    document.getElementById(id).style.strokeWidth = "2px";
    document.getElementById(id).style.stroke = "white";
    if (currentMapId == id) {
        document.getElementById(id).style.strokeWidth = "0px";
        document.getElementById(id).style.stroke = "black";
        currentMapId = "";
        return;
    }
    if (currentMapId != "") {
        document.getElementById(currentMapId).style.strokeWidth = "0px";
        document.getElementById(currentMapId).style.stroke = "black";
    }
    currentMapId = id;
}

$(window).on('load', function() {
    setLeader('SOV', 'Gorbachev');
    setCountry('SOV');
    setEvent("");
    document.getElementById("mapUkraine").style.fill = "darkred";
    document.getElementById("mapRussia").style.fill = "darkred";
    document.getElementById("mapBelarus").style.fill = "darkred";
    document.getElementById("mapCrimea").style.fill = "darkred";

    $(".mapItems").each(function(index) {
        document.getElementById(this.id).onclick = function() { setMap(this.id) };
    });

    setInterval(update, 33);
});

document.addEventListener("keydown", function(event) {
    switch (event.which) {
        case 19:
            paused = !paused;
    }
});

function update() {
    if (!paused && eventId == "") {
        if (frame % 4 == 0) {
            days++;
            timeDays = (days % 30) + 1;
            timeMonths = (Math.floor(days / 30) % 12);
            timeYears = (Math.floor(days / 360)) + 2000;
            document.getElementById("mainTitle").innerHTML = `Country - ${("0"+timeDays).slice(-2)} ${months[timeMonths]} ${timeYears}`;
        }
        frame++;

        switch (days) {
            case 85:
                if (!gameFlags["2000_russian_election"]) {
                    setEvent("2000_russian_election.1");
                }
                break;
        }
    }
    if (paused) {
        document.getElementById("pauseButton").innerHTML = "Unpause";
    } else {
        document.getElementById("pauseButton").innerHTML = "Pause";
    }

    if (eventId == "") {
        document.getElementById("eventTable").style.visibility = "hidden";
    } else {
        document.getElementById("eventTable").style.visibility = "visible";
    }

    if (eventId == "") {
        document.getElementById("eventTable").style.visibility = "hidden";
    } else {
        document.getElementById("eventTable").style.visibility = "visible";
    }

    if (document.getElementById("decisions").innerHTML.trim() === '') {
        document.getElementById("decisions").style.visibility = "hidden";
    } else {
        document.getElementById("decisions").style.visibility = "visible";
    }
}