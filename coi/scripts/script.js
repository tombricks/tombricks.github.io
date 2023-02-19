laws = {};
ideas = {};
function isLaw(idea) {
    for (lawGroup in laws) {
        if (laws[lawGroup].includes(idea)) {
            return true;
        }
    }
    return false;
}

// #region Scopes
class Scope {
    id = null;
    flags = {};
    name = "";
    constructor(id) {
        this.id = id;
        this.name = id;
    }

    setFlag(flag, value) {
        this.flags[flag] = value;
    }
    getFlag(flag, defVal = null) {
        if (flag in this.flags) {
            return this.flags[flag];
        }
        else {
            return defVal != null ? defVal : 0;
        }
    }
    getName() {
        return this.name;
    }
    getLocalisedName() {
        return localisation(localisationKey(this.getName(), {scopes:[this.id]}), {scopes:[this.id]});
    }
    setName(name) {
        this.name = name;
    }
    logNames(a1="", a2="", b1="", b2="") {
        return `${a1}this.name:${a2} ${b1}${this.name}${b2}<br>${a1}getName():${a2} ${b1}${this.getName()}${b2}<br>${a1}getLocalisedName():${a2} ${b1}${this.getLocalisedName()}${b2}<br>`
    }
}
class Country extends Scope {
    colour = "#888888";
    tiles_owned = [];
    tiles_controlled = [];
    cosmeticFlag = "assets/flags/blank.png";
    longName = null;
    allowedIdeas = [];
    selectedIdeas = [];

    addIdea(idea, doEffect=true) {
        if (!this.selectedIdeas.includes(idea)) {
            if (isLaw(idea)) {
                // this is new law
                for (let ideaOld of this.selectedIdeas) {
                    for (lawGroup in laws) {
                        if (laws[lawGroup].includes(ideaOld) && laws[lawGroup].includes(idea)) {
                            this.removeIdea(ideaOld, doEffect=true);
                        }
                    }
                }
            }

            this.selectedIdeas.push(idea);
            
            if (doEffect) {
                runScript(ideas[idea].on_add, {scopes:[this.id]});
            }
        }
    }
    removeIdea(idea, doEffect=true) {
        if (this.selectedIdeas.includes(idea)) {
            this.selectedIdeas.splice(this.selectedIdeas.indexOf(idea), 1);
            if (doEffect) {
                runScript(ideas[idea].on_remove, {scopes:[this.id]});
            }
        }
    }

    setColour(newColour) {
        let oldColour = this.colour;
        this.colour = newColour;
        styleAllTiles();
    }
    setCosmeticFlag(newFlag) {
        this.cosmeticFlag = newFlag;
        $(".CoI-country-flag-"+this.id).attr('src', newFlag); 
    }
    
    getLongName() {
        if (this.longName == null) {
            if ((this.name + "_long") in localisationDict) {
                return this.name + "_long";
            }
            else {
                return this.name;
            }
        }
        else {
            return this.longName;
        }
    }
    getLocalisedLongName() {
        return localisation(localisationKey(this.getLongName(), {scopes:[this.id]}), {scopes:[this.id]});
    }
    setLongName(name) {
        this.longName = name;
    }
    resetLongName(name) {
        this.longName = null;
    }
    logLongNames(a1="", a2="", b1="", b2="") {
        return `${a1}this.longName:${a2} ${b1}${this.longName}${b2}<br>${a1}getLongName():${a2} ${b1}${this.getLongName()}${b2}<br>${a1}getLocalisedLongName():${a2} ${b1}${this.getLocalisedLongName()}${b2}<br>`
    }
    logAll(a1="", a2="", b1="", b2="") {
        return `${this.logNames(a1, a2, b1, b2)}${this.logLongNames(a1, a2, b1, b2)}${a1}inlineFlag(this.cosmeticFlag)${a2}: ${b1}${inlineFlag(this.cosmeticFlag)}${b2}`;
    }
}
countries = {};
class Tile extends Scope {
    owner = null;
    controller = null;
    
    constructor(id) {
        super(id);
        this.name = "tile_"+id;
    }
    
    setOwner(country, transferControl = null) {
        let oldOwner = this.owner;
        let oldController = this.controller;
        this.owner = country;
        countries[country].tiles_owned.push(this.id);
        if (oldOwner != null) {
            countries[country].tiles_owned.splice(countries[country].tiles_owned.indexOf(this.id), 1);
        }
        if (transferControl == true) { // transferControl == true means it should
            this.setController(country);
        }
        else if (transferControl == false) { // logic later, leave it for now
        }
        else {
            if (oldOwner == oldController) { // only transfer control if it was owned and controlled by the same tag before
                this.setController(country);
            }
        }
        styleTile(this.id);
    }
    setController(country) {
        let oldController = this.controller;
        this.controller = country;
        countries[country].tiles_controlled.push(this.id);
        if (oldController != null) {
            countries[country].tiles_controlled.splice(countries[country].tiles_controlled.indexOf(this.id), 1);
        }
        styleTile(this.id);
    }

}
tiles = {};
tiles_connections = {};
class Character extends Scope {
}
// #endregion

// #region "Client functions" (map, buttons, etc)
// Fires whenever the map pans or zooms to update stuff on the map;
function mapScroll(limit = "") {
    t = `${limit} .CoI-map-element:not(.CoI-map-element-invisible)`;
    $(t).each(function () { // Updates CSS position
        if ($(this).hasClass("CoI-map-line")) {
            o1 = $(`#${$(this).attr('data-map-element-1')}`).offset();
            o2 = $(`#${$(this).attr('data-map-element-2')}`).offset();
            // #region whxy
            w = 0;
            h = 0;
            x = 0;
            y = 0;
            if (o1.left > o2.left) {
                w = o1.left - o2.left;
                x = o2.left;
            }
            else {
                w = o2.left - o1.left;
                x = o1.left;
            }
            if (o1.top > o2.top) {
                h = o1.top - o2.top;
                y = o2.top;
            }
            else {
                h = o2.top - o1.top;
                y = o1.top;
            }
            $(this).css(
                "left", `calc(${x}px - var(--CoI-left-bar-width))`
            )
            $(this).css(
                "top", `${y}px`
            )
            $(this).css(
                "width", `${w}px`
            )
            $(this).css(
                "height", `${h}px`
            )
            // #endregion

            cl = ``;
            if ($(this).attr('data-line-class') !== undefined) {
                cl = $(this).attr("data-line-class");
            }
            updown = ((o1.left > o2.left && o1.top > o2.top) || (o2.left > o1.left && o2.top > o1.top));
            if (updown) {
                $(this).html(`<svg overflow="visible" class="diagonal-svg"><line class="${cl} diagonal-line" x1='0' y1='0' x2='100%' y2='100%' /></svg>`);
            }
            else {
                $(this).html(`<svg overflow="visible" class="diagonal-svg"><line class="${cl} diagonal-line" x1='0' y1='100%' x2='100%' y2='0' /></svg>`);
            }
        }
        else {
            $(this).css(
                "left", `calc(${$(`#${$(this).attr('data-map-element')}`).offset().left}px - var(--CoI-left-bar-width))`
            );
            $(this).css(
                "top", `${$(`#${$(this).attr('data-map-element')}`).offset().top}px`
            );
        }
    });
}
function onTileOver(tile) {
    // console.log(`Tile over: ${tile}`);
    tooltip(`${tiles[tile].logNames(`<b>`, `</b>`, `<span style='color:red'>`, `</span>`)}<br>${countries[tiles[tile].owner].logAll(`<b>`, `</b>`, `<span style='color:red'>`, `</span>`)}`);
    $("#tile-"+tile).addClass("CoI-map-tile-hover");
    for (tile2 of tiles_connections[tile]) {
        $("#tile-"+tile2).addClass('CoI-map-tile-hover-next');
    }
}
function onTileOut(tile) {
    // console.log(`Tile out: ${tile}`);
    tooltip();
    $("#tile-"+tile).removeClass("CoI-map-tile-hover");
    for (tile2 of tiles_connections[tile]) {
        $("#tile-"+tile2).removeClass('CoI-map-tile-hover-next');
    }
}
function onTileClick(tile) {
    // console.log(`Tile click: ${tile}`);
}
function onTileRightClick(tile) {
    // Not Working for now
}
function styleTile(tile) {
    if (tiles[tile].controller != null) {
        $(`#tile-${tile}`).css('fill', countries[tiles[tile].controller].colour );
    }
    else {
        $(`#tile-${tile}`).css('fill', "#888888");
    }
}
function styleAllTiles() {
    for (tile in tiles) {
        styleTile(tile);
    }
}
function debugButton(entry) {
    switch (entry) {
        case "labels":
            $(".CoI-map-label").toggleClass("CoI-map-element-invisible");
            mapScroll();
            break;
        case "tile-points":
            $(".CoI-tile-point").toggleClass("CoI-map-element-opacity");
            break;
    }
}
tooltipText = "";
function tooltip(text="", context={ scopes: [globalScope] }) {
    tooltipText = text;
}
$( document ).on( "mousemove", function( event ) {
	if (tooltipText) {
		$("#tooltip").html(tooltipText);
		$("#tooltip").show()
		$( "#tooltip" ).css({
			"left" : event.pageX,
			"top" : Math.max(event.pageY - $("#tooltip").height()-8, 0)
		});
	}
	else {
		$("#tooltip").hide()
	}
});
localisationDict = {};
function localisationKey(key) {
    if (key in localisationDict) {
        return localisationDict[key];
    }
    return key;
}
function localisation(text, context={ scopes: [globalScope] }) {
	let out = "";
	var elements = text.split("$$");
    i = 0
    for (element of elements) {
        if (i % 2 == 1) {
            divi = element.split("$");
            left = tokenize(divi[0]);
            right = divi[1];
            switch (right) {
                case "get_flag":
                    element = inlineFlag(countries[left].cosmeticFlag);
                    break;
            }
        }
        out += element;
        i++;
    }
    return out;
}
function inlineFlag(flag) {
	return `<div style="position:relative;display:inline-block;width:1.5em;vertical-align:text-top;top:2px;">
	<img src="${flag}" style="position:absolute;left:0px;top:0px;width:1.5em;height:0.95em"></img>
	<img src="assets/interface/flag_overlay.png" style="position:absolute;left:0px;top:0px;width:1.5em;height:0.95em"></img>
	</div>`
}
// #endregion

// #region Map logic
function findThatPath(start, end) {
    let graph = createGraph();

    for (tile in tiles_connections) {
        for (tile2 of tiles_connections[tile]) {
            graph.addLink(tile, tile2, { weight: 1 });
        }
    }

    let pathFinder = ngraphPath.aStar(graph, {
        // We tell our pathfinder what should it use as a distance function:
        distance(fromNode, toNode, link) {
            // We don't really care about from/to nodes in this case,
            // as link.data has all needed information:
            return link.data.weight;
        }
    });
    let path = pathFinder.find(start, end);
    for (ind in path) {
        one = path[ind];
        two = path[parseInt(ind)+1];
        
        if (two !== undefined) {
            $("#paths").append(`<div data-line-class="CoI-map-line-conn" class="CoI-map-line CoI-map-element CoI-ui-element" id="" data-map-element-1="point-${one.id}" data-map-element-2="point-${two.id}"></div>`);
        }
    }
}
// #endregion

// #region Logic
/*
    context = {
        scopes: [ "germany", "bavaria", "austria" ] <---- Austria is the current scope
    }
*/
const globalScope = 0;
function tokenize(token, context={ scopes: [globalScope] }) {
    let out = "";
    out = token;
    return out;
}
function determineScope(scope, context) {
    if (scope in countries) {
        return "country";
    }
    else if (scope in tiles) {
        return "tile";
    }
    return "unknown";
} 
function runScript(script, context={ scopes: [globalScope] }) {
    for (effect of script) {
        let scope = context.scopes[context.scopes.length-1];
        let scopeType = determineScope(scope);
        switch (effect.type) {
            case "set_colour": // set_colour - colour
                countries[scope].setColour(tokenize(effect.colour));
                break;
            case "set_cosmetic_flag": // set_cosmetic_flag - flag
                countries[scope].setCosmeticFlag(tokenize(effect.flag));
                break;
            case "set_name": // set_cosmetic_flag - flag
                switch (scopeType) {
                    case "country":
                        countries[scope].setName(tokenize(effect.name));
                        if (effect.reset_long_name) {
                            countries[scope].resetLongName();
                        }
                        if (effect.long_name) {
                            countries[scope].setLongName(tokenize(effect.long_name));
                        }
                        break;
                    case "tile":
                        tiles[scope].setName(tokenize(effect.name));
                        break;
                }
                break;
            case "set_long_name":
                countries[scope].setLongName(tokenize(effect.long_name));
                break;
            case "set_owner": // set_owner - owner
                tiles[scope].setOwner(tokenize(effect.owner), (effect.transfer_control == undefined ? null : tokenize(effect.transfer_control)));
                break;
            case "add_idea":
                countries[scope].addIdea(tokenize(effect.idea), (effect.on_add_effect == undefined ? true : tokenize(effect.on_add_effect)));
                break;
            case "remove_idea":
                if (!isLaw(tokenize(effect.idea))) {
                    countries[scope].removeIdea(tokenize(effect.idea), (effect.on_remove_effect == undefined ? true : tokenize(effect.on_remove_effect)));
                }
                break;
        }
    }
}
function evaluateScript(script, context={ scopes: [globalScope] }) {
    return true;
}

tile_scripts = {};
country_scripts = {};
function startingScripts() {
    // PRE-HISTORY
    
    // HISTORY
    for (tile in tiles) {
        runScript(tile_scripts[tile], {scopes: [tile]});
    }
    countr = Object.keys(country_scripts);
    countr.forEach(function(country) {
        for (lawGroup in laws) {
            countries[country].addIdea(laws[lawGroup][0], false);
        }
        $.getJSON(country_scripts[country], function(data) {
            runScript(data, {scopes:[country]});
        });
    });

    // ALLOWED
    for (idea in ideas) {
        for (country in countries) {
            if (evaluateScript(ideas[idea].allowed, {scopes:[country]})) {
                countries[country].allowedIdeas.push(idea);
            }
        }
    }
}
// #endregion

// Fires on document ready
$(document).ready(function () {
    $.getJSON("content/countries.json", function (data) {
        for (country in data) {
            countries[country] = new Country(country);
        }
        country_scripts = data;

        // #region Map Data
        $.getJSON("content/map.json", function (data) {
            $("#mapSvgDiv").load("assets/worldmap.svg", function () {
                // Basic Data Setup
                for (tile in data.tiles) {

                    // Add tile to tiles list
                    tiles[tile] = new Tile(tile);
                    tile_scripts[tile] = data.tiles[tile];

                    // Add map label
                    $("#labels").append(`<div class="CoI-map-label CoI-map-element CoI-map-element-invisible CoI-ui-default CoI-ui-element" id="label-${tile}" data-map-element="point-${tile}">${tile}</div>`);

                    // Add svg data
                    $(`#tile-${tile}`).addClass(`CoI-map-tile`);
                    $(`#point-${tile}`).addClass(`CoI-tile-point`);
                    $(`#point-${tile}`).addClass(`CoI-map-element-opacity`);
                    $(`#tile-${tile}`).attr(`onclick`, `onTileClick("${tile}")`);
                    $(`#tile-${tile}`).attr(`oncontextmenu`, `onTileRightClick("${tile}")`);
                    $(`#tile-${tile}`).attr(`onmouseover`, `onTileOver("${tile}")`);
                    $(`#tile-${tile}`).attr(`onmouseout`, `onTileOut("${tile}")`);

                }
                tiles_connections = data.connections;

                $.getJSON("content/politics.json", function (data) {
                    laws = data.laws;

                    $.getJSON("content/ideas.json", function (data) {
                        ideas = data;

                        $.getJSON("assets/localisation.json", function (data) {
                            data.forEach(function(file) {
                                $.getJSON(file, function(data2) {
                                    localisationDict = {...localisationDict, ...data2};
                                });
                            });
                            startingScripts(); // After all the data structures and objects and stuff have been made
            
                            document.getElementById('mapSvgDiv').addEventListener('scroll', function () {
                                mapScroll();
                            });
                            mapScroll();
                            styleAllTiles();
                        });
                    });
                });
            });
        });
        // #endregion
    });
});
