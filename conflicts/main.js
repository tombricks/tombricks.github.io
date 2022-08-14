const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

conflictdata["columns"].forEach((column, columnI, columnA) => {
    document.write(`<div class="column"><hr><h1>${column}</h1><hr>`)
    console.log(column)
    conflictdata["conflicts"].forEach((currentValue, index, arr) => {
        if (currentValue["column"] == column) {
            document.write(`<h3>${currentValue["name"]}</h3>
        <input id="conflict_${index}_side1" type="radio" name="conflict_${index}" value="${currentValue["side1"]}"><img alt="${countrydata["names"][currentValue["side1"]]}" id="conflict_${index}_side1btn" onclick="buttonClick(1, ${index})" class="flag" src="${countrydata["flags"][currentValue["side1"]]}" />
        <input id="conflict_${index}_na" type="radio" name="conflict_${index}" value="neither">
        <img onclick="buttonClick(2, ${index})" id="conflict_${index}_side2btn" class="flag" alt="${countrydata["names"][currentValue["side2"]]}" src="${countrydata["flags"][currentValue["side2"]]}" /><input id="conflict_${index}_side2" type="radio" name="conflict_${index}" value="${currentValue["side2"]}">
        `)
            document.getElementById(`conflict_${index}_na`).checked = true;
            if (urlParams.has(`conflict${index}`)) {
                console.log(`${index} is there: ${urlParams.get(`conflict${index}`)}`)
                if (urlParams.get(`conflict${index}`) == "1") { document.getElementById(`conflict_${index}_side1`).checked = true; }
                else if (urlParams.get(`conflict${index}`) == "2") { document.getElementById(`conflict_${index}_side2`).checked = true; }
                else if (urlParams.get(`conflict${index}`) == "na") { document.getElementById(`conflict_${index}_na`).checked = true; }
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
        if (document.getElementById(`conflict_${index}_na`).checked) {
            app += `conflict${index}=na&`
        }
        else if (document.getElementById(`conflict_${index}_side1`).checked) {
            app += `conflict${index}=1&`
        }
        else if (document.getElementById(`conflict_${index}_side2`).checked) {
            app += `conflict${index}=2&`
        }
    });
    document.getElementById("sharelink").setAttribute("value", app);
}

function clearv() {
    console.log("clear")
    result = confirm("Are you sure you want to clear all values?")
    if (result) {
        conflictdata["conflicts"].forEach((currentValue, index, arr) => {
            document.getElementById(`conflict_${index}_na`).checked = true;
        });
    }
}

window.onbeforeunload = function ()
{
    return confirm("Are you sure you want to reload?");
};

function takeScreen() {
    share()
    html2canvas(document.body, {
        scrollX: 0,
        scrollY: 0
    }).then(function(canvas) {
        canvas.id = "output";
        document.getElementById("output").parentElement.replaceChild(canvas, document.getElementById("output"));
    });
}