globalChange = false;
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
i = 0;
text = "";
left = "";
for (column in conflictdata["conflicts"]) {
    left += `<input type="checkbox" id="conflict_${i}_checkbox" checked onchange="enable_column(${i})"> ${column}<br><br>`;

    columnrow = `<tr id="conflict_${i}">`
    columnrow += (`<td><h1>${column}</h1></td>`)
    conflictdata["conflicts"][column].forEach((currentValue, index, arr) => {
        console.log(i);
        imgs = "";
        inputs = "";
        t = 0;
        for (country of currentValue["sides"]) {
            if (Array.isArray(country)) {
                imgs += `<th>`
                for (country2 of country) {
                    imgs += `<img title="${countrydata["names"][country2]}" onclick="buttonClick(${t}, ${i})" class="conflict_${i}_side_${t}_btn flag flag-${i}" data-id=${i} src="${countrydata["flags"][country2]}" /><br>`
                }
                imgs += `</th>`
            }
            else{
                imgs += `<th><img title="${countrydata["names"][country]}" onclick="buttonClick(${t}, ${i})" class="conflict_${i}_side_${t}_btn flag flag-${i}" data-id=${i} src="${countrydata["flags"][country]}" /></th>`
            }
            inputs += `<th><input onchange="onthechange(${t}, ${i})" onclick="buttonClick(${t}, ${i})" id="conflict_${i}_side_${t}" type="radio" name="conflict_${i}" value="${t}" autocomplete="off"></th>`
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

function onthechange(side, conflict) {
    document.getElementById(`conflict_${conflict}_side_${side}`).checked = false;
    buttonClick(side, conflict);
}
function buttonClick(side, conflict) {
    console.log("buttonClick", side, conflict);
    for (el of document.getElementsByClassName("flag-"+conflict)) {
        el.style.border = "";
    }
    if (document.getElementById(`conflict_${conflict}_side_${side}`).checked) {
        document.getElementById(`conflict_${conflict}_side_${side}`).checked = false;
    }
    else {
        for (el of document.getElementsByClassName(`conflict_${conflict}_side_${side}_btn`)) {
            el.style.border = "4px solid gold"
        }
        document.getElementById(`conflict_${conflict}_side_${side}`).checked = true;
    }
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

window.onbeforeunload = function ()
{
    return confirm("Are you sure you want to reload?");
};

function takeScreen() {
    html2canvas(document.getElementById("content"), {
        scrollX: 0,
        scrollY: 0
    }).then(function(canvas) {
        console.log("png");
        window.open(canvas.toDataURL("png"));
    });
}