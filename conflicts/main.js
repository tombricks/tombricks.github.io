globalChange = false;
const queryString = window.location.search;
conDict = {};
const urlParams = new URLSearchParams(queryString);
i = 0;
text = "";
left = "";
data = {};

for (c in conflictdata["conflicts"]) {
    for (t of conflictdata["conflicts"][c]) {
        conDict[t["id"]] = t;
        data[t["id"]] = null;
    }
}
for (column in conflictdata["conflicts"]) {
    left += `<input type="checkbox" id="conflict_${i}_checkbox" checked onchange="enable_column(${i})"> ${column}<br><br>`;

    columnrow = `<tr id="conflict_${i}">`
    columnrow += (`<td><h1>${column}</h1></td>`)
    conflictdata["conflicts"][column].forEach((currentValue, index, arr) => {
        if (typeof(currentValue) === "string") {
            currentValue = conDict[currentValue];
            console.log("String:", currentValue);
        }
            console.log(i);
            imgs = "";
            inputs = "";
            t = 0;
            for (country of currentValue["sides"]) {
                if (Array.isArray(country)) {
                    imgs += `<th>`
                    for (country2 of country) {
                        imgs += `<img title="${countrydata["names"][country2]}" onclick="buttonClick(${t}, '${currentValue["id"]}')" class="conflict_${currentValue["id"]}_side_${t}_btn flag flag-${currentValue["id"]}" data-id='${currentValue["id"]}' src="${countrydata["flags"][country2]}" /><br>`
                    }
                    imgs += `</th>`
                }
                else{
                    imgs += `<th><img title="${countrydata["names"][country]}" onclick="buttonClick(${t}, '${currentValue["id"]}')" class="conflict_${currentValue["id"]}_side_${t}_btn flag flag-${currentValue["id"]}" data-id='${currentValue["id"]}' src="${countrydata["flags"][country]}" /></th>`
                }
                inputs += `<th><div onclick="buttonClick(${t}, '${currentValue["id"]}')" class="circle conflict_${currentValue["id"]}_side_${t}_btn flag flag-${currentValue["id"]}" data-id='${currentValue["id"]}' /></th>`
                t++;
            }
            columnrow += (`
    <td><div class="conflictbox"><span class="conflict-name">${currentValue["name"]}</span>
    <table class="content-table">
    <tr style="display: table-row; vertical-align: middle;">
        ${imgs}
    </tr>
    <tr style="display: table-row; vertical-align: middle;">
        ${inputs}
    </tr>
    </table>
    </div></td>
            `);
            i++;
    });
    columnrow += ("</tr>")
    text += (columnrow);
}
document.getElementById("left-bar").innerHTML = document.getElementById("left-bar").innerHTML + left;
document.getElementById("main-table").innerHTML = text;

if (localStorage.getItem("data") !== null) {
    data = JSON.parse(localStorage["data"]);
    load_from_data();
}

function clear_all() {
    for (conflict in data) {
        set_side(null, conflict);
    }
}

function load_from_data() {
    for (conflict in data) {
        if (data[conflict] == null) {
            set_side(null, conflict);
        }
        else {
            set_side(data[conflict], conflict);
        }
    }
}

left_btn = false;

function left_button() {
    if (left_btn) {
        document.getElementById("left-bar").style.left = "0px";
        document.getElementById("content").style.left = "373px";
        document.getElementById("left-bar-button").innerText = "-";
    }
    else {
        document.getElementById("left-bar").style.left = "-373px";
        document.getElementById("content").style.left = "0px";
        document.getElementById("left-bar-button").innerText = "+";
    }
    left_btn = !left_btn;
}

function enable_column(i) {
    if (document.getElementById(`conflict_${i}_checkbox`).checked) {
        document.getElementById(`conflict_${i}`).style.display = "";
    }
    else {
        document.getElementById(`conflict_${i}`).style.display = "none";
    }
}

function buttonClick(side, conflict) {
    if (data[conflict] == side) {
        set_side(null, conflict);
    }
    else {
        set_side(side, conflict);
    }
}
function set_side(side, conflict) {
    for (el of document.getElementsByClassName("flag-"+conflict)) {
        el.style.backgroundColor = "";
        el.style.border = "";
        el.style.scale = "";
    }
    if (side != null) {
        for (el of document.getElementsByClassName("flag-"+conflict)) {
            el.style.scale = "0.9";
        }
        for (el of document.getElementsByClassName(`conflict_${conflict}_side_${side}_btn`)) {
            el.style.backgroundColor = "gold";
            el.style.border = "4px solid gold"
            el.style.scale = "1.1";
        }
    }
    data[conflict] = side;
}

function share() {
    app = window.location.href.split('?')[0] + "?"
    /* conflictdata["conflicts"].forEach((currentValue, index, arr) => {
        if (document.getElementById(`conflict_${i}_na`).checked) {
            app += `conflict${i}=na&`
        }
        else if (document.getElementById(`conflict_${i}_side1`).checked) {
            app += `conflict${i}=1&`
        }
        else if (document.getElementById(`conflict_${i}_side2`).checked) {
            app += `conflict${i}=2&`
        }
    }); */
    document.getElementById("sharelink").setAttribute("value", app);
}

function clearv() {
    console.log("clear")
    result = confirm("Are you sure you want to clear all values?")
    if (result) {
        conflictdata["conflicts"].forEach((currentValue, index, arr) => {
            document.getElementById(`conflict_${i}_na`).checked = true;
        });
    }
}

window.onunload = function ()
{
    localStorage.setItem("data", JSON.stringify(data));
};

function takeScreen() {
    alert("Image will open in new tab! It may take a few seconds.")
    html2canvas(document.getElementById("content"), {
        scrollX: 0,
        scrollY: 0
    }).then(function(canvas) {
        console.log("png");
        window.open(canvas.toDataURL("png"));
    });
}