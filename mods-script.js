function toggleDiv(id) {
    var div = document.getElementById(id);
    div.style.display = div.style.display == "none" ? "block" : "none";
}
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

mods = [
    {
        id: "imbr",
        name: "Imperium Britannicum",
        mod_status: "Released",
        images: ["assets/mods/imbr-1.jpg", "assets/mods/imbr-2.jpg", "assets/mods/imbr-3.jpg" ],
        links: [
            ["Steam Workshop", "https://steamcommunity.com/sharedfiles/filedetails/?id=1468425676"],
            ["YouTube", "https://www.youtube.com/watch?v=ig7R9Lazt2M"]
        ],
        desc: "Imperium Britannicum was my first HOI4 mod, made between August-September 2018. The mod, an alternate history scenario, depicts a fascist British Empire that exists in alliance with the Japanese and Siamese Empires. The half baked lore, written after the release, sees fascist Oswald Mosley become Prime Minister after the British public are angered by a weak peace after WW1 which sees Germany keep her empire, which was also added after release. Britain, Japan and Siam have unique focus trees with the subjects of each country also sharing a focus tree."
    },
    {
        id: "luxembourg",
        name: "Big Trouble in Little Luxembourg",
        mod_status: "Released",
        images: ["assets/mods/luxembourg-1.png"],
        links: [
            ["Steam Workshop", "https://steamcommunity.com/sharedfiles/filedetails/?id=2455182911"],
        ],
        desc: "Big Trouble in Little Luxembourg was a HOI4 mod I made for the HOI4 Modding Den Modding Jam. Made in a week or two, the mod depicts a Luxembourgish civil war. Having not long to make it and little map creation skills, the map is a flat terrain with borders representing the top-level divisions of Luxembourg."
    },
    {
        id: "rome",
        name: "Glory to Rome",
        mod_status: "Released",
        images: [],
        links: [
            ["Steam Workshop", "https://steamcommunity.com/sharedfiles/filedetails/?id=2574088887"],
        ],
        desc: "Glory to Rome was a mod adding a Roman state to Italy. It featured a Gay Commune and a rebellion led by a fake Jesus. It was made in one hour as part of the Modlympics."
    },
    {
        id: "totalsieg",
        name: "Totalsieg",
        mod_status: "Cancelled",
        images: ["assets/mods/totalsieg-1.png", "assets/mods/totalsieg-2.png"],
        links: [
            ["GitHub", "https://github.com/tombricks/Totalsieg"],
        ],
        desc: "Totalsieg was an Axis victory nominally led by myself and Cestino. It was depicted as a total Axis victory in the style of TMITHC with the Nazi Empire stretching from America to the Urals. It was part of the IMP collective of mods. It was cancelled later due to creative differences. It was notable for having an extreme Atlantropa meaning a total drainage of the Mediterranean sea."
    }
]

i = 0;
contents = ``;
for (mod of mods) {
    imgs = "";
    for (image of mod.images) {
        imgs += `<img class="teaser" src="${image}" />`;
    }
    links = "";
    for (link of mod.links) {
        links += `<a href="${link[1]}">${link[0]}</a> `
    }
    mod_status = "";
    if (mod.mod_status == undefined) {
        mod_status = "";
    }
    else {
        mod_status = ` (${mod.mod_status})`;
    }

    text = `<div id="mod-${mod.id}"><hr>
    <text style="font-weight: bold; font-size: 22px;"><u>${mod.name}${mod_status}</u></text><br>
    <i><sup>${links}</sup><br></i>
    ${imgs}<br>
    <text>${mod.desc}</text>
    </div>`;
    document.getElementById("mods").appendChild(htmlToElement(text));

    if (mod.mod_status == undefined) {
        mod_status = "";
    }
    else {
        mod_status = `<br><i><sup>${mod_status}</sup></i>`
    }
    content_string = `<td><a href="#mod-${mod.id}">${mod.name}</a>${mod_status}</td>`
    if (i == 0) {
        i++;
        contents += `<tr>${content_string}`
    }
    else if (i == 4) {
        i = 0;
        contents += `${content_string}</tr>`
    }
    else {
        i++;
        contents += `${content_string}`
    }
}
if (i != 0) {
    contents += `</td>`
}
document.getElementById("contents").innerHTML = contents;