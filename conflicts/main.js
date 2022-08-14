const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

conflictdata["columns"].forEach((column, columnI, columnA) => {
    document.write(`<div class="column"><hr><h1>${column}</h1><hr>`)
    console.log(column)
    conflictdata["conflicts"].forEach((currentValue, index, arr) => {
        if (currentValue["column"] == column) {
            document.write(`<h3>${currentValue["name"]}</h3>
        <input id="conflict_${currentValue["id"]}_side1" type="radio" name="conflict_${currentValue["id"]}" value="${currentValue["side1"]}"><img title="${countrydata["names"][currentValue["side1"]]}" id="conflict_${currentValue["id"]}_side1btn" onclick="buttonClick(1, ${currentValue["id"]})" class="flag" src="${countrydata["flags"][currentValue["side1"]]}" />
        <input id="conflict_${currentValue["id"]}_na" type="radio" name="conflict_${currentValue["id"]}" value="neither">
        <img onclick="buttonClick(2, ${currentValue["id"]})" id="conflict_${currentValue["id"]}_side2btn" class="flag" title="${countrydata["names"][currentValue["side2"]]}" src="${countrydata["flags"][currentValue["side2"]]}" /><input id="conflict_${currentValue["id"]}_side2" type="radio" name="conflict_${currentValue["id"]}" value="${currentValue["side2"]}">
        `)
            document.getElementById(`conflict_${currentValue["id"]}_na`).checked = true;
            if (urlParams.has(`conflict${currentValue["id"]}`)) {
                console.log(`${currentValue["id"]} is there: ${urlParams.get(`conflict${currentValue["id"]}`)}`)
                if (urlParams.get(`conflict${currentValue["id"]}`) == "1") { document.getElementById(`conflict_${currentValue["id"]}_side1`).checked = true; }
                else if (urlParams.get(`conflict${currentValue["id"]}`) == "2") { document.getElementById(`conflict_${currentValue["id"]}_side2`).checked = true; }
                else if (urlParams.get(`conflict${currentValue["id"]}`) == "na") { document.getElementById(`conflict_${currentValue["id"]}_na`).checked = true; }
            }
        }
    });
    document.write("</div>")
});

function buttonClick(side, conflict) {
    console.log(side, conflict);
    document.getElementById(`conflict_${conflict}_side${side}`).checked = true;
}

function share() {
    app = window.location.href.split('?')[0] + "?"
    conflictdata["conflicts"].forEach((currentValue, index, arr) => {
        if (document.getElementById(`conflict_${currentValue["id"]}_na`).checked) {
            app += `conflict${currentValue["id"]}=na&`
        }
        else if (document.getElementById(`conflict_${currentValue["id"]}_side1`).checked) {
            app += `conflict${currentValue["id"]}=1&`
        }
        else if (document.getElementById(`conflict_${currentValue["id"]}_side2`).checked) {
            app += `conflict${currentValue["id"]}=2&`
        }
    });
    document.getElementById("sharelink").setAttribute("value", app);
}

function clearv() {
    console.log("clear")
    result = confirm("Are you sure you want to clear all values?")
    if (result) {
        conflictdata["conflicts"].forEach((currentValue, index, arr) => {
            document.getElementById(`conflict_${currentValue["id"]}_na`).checked = true;
        });
    }
}

window.onbeforeunload = function ()
{
    return confirm("Are you sure you want to reload?");
};

function takeScreen() {
    share()
    const newImg = document.createElement("img");
    document.getElementById("output").parentElement.replaceChild(newImg, document.getElementById("output"));
    newImg.id = "output";
    html2canvas(document.body, {
        scrollX: 0,
        scrollY: 0
    }).then(function(canvas) {
        document.getElementById("output").parentElement.replaceChild(canvas, document.getElementById("output"));
        canvas.id = "output";
    });
}