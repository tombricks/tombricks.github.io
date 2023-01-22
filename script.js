function random_choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function weighted_random(options, prob) {
    var out = [];
    options.forEach((option, index) => {
        out.push(...Array(prob[index]).fill(option))
    });
    return random_choice(out);
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function random_government() {
    var el = document.getElementById("gov_type");
    var constitutional = weighted_random(["unitary ", "federal ", "confederal ", ""], [10, 7, 1, 8]);
    var party = weighted_random(["one-party ", "dominant-party ", "two-party ", "multi-party ", "non-partisan ", ""], [10, 8, 2, 4, 1, 15])
    var power = weighted_random(["parliamentary ", "presidential ", "semi ", "directorial ", "directorial parliamentary ", ""], [13, 9, 5, 1, 1, 5])
    var ideology = weighted_random(["democratic ", "", "fascist ", "socialist "], [20, 60, 5, 10]);
    var stype = weighted_random(["republic", "elective monarchy", "hereditary monarchy", "monarchy", "state"], [20, 1, 2, 5, 7]);
    if (stype.includes("monarchy")) {
        if (power == "parliamentary ") {
            stype = stype.replace("monarchy", "constitutional monarchy");
        }
        else if (power == "presidential ") {
            power = "";
            stype = stype.replace("monarchy", "executive monarchy");
        }
        else if (power == "semi ") {
            power = "parliamentary ";
            stype = stype.replace("monarchy", "semi-constitutional monarchy");
        }
        else if (power == "directorial parliamentary ") {
            power = "directorial ";
            stype = stype.replace("monarchy", "constitutional monarchy");
        }
    }
    else {
        if (power == "semi ") {
            power = "semi-presidential "
        }
    }
    extra1 = ""
    if (party == "one-party " && ideology == "socialist ") {
        extra1 = weighted_random(["Marxist-Leninist ", ""], [1, 1]);
    }
    else if (party == "dominant-party " && ideology == "socialist ") {
        extra1 = weighted_random(["Marxist-Leninist ", ""], [1, 2]);
    }
    var total = capitalizeFirstLetter(constitutional + extra1 + party + power + ideology + stype);
    el.innerText = total + " ";
    return total;
}

function toggleDiv(id) {
    var div = document.getElementById(id);
    div.style.display = div.style.display == "none" ? "block" : "none";
}
