function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
names = [];
function guess_submit() {
    i = 0;
    nid = 0;
    tr = "";
    document.getElementById(`da-table`).innerHTML = ``;
    for (line of document.getElementById("guess-code").value.split('\n')) {
        var name = line.split(';')[0];
        names.push(name);
        var image = line.split(';').slice(1).join(';');
        console.log(name, image);

        tr += `<td id="id_${nid}" onclick="guess_click(${nid})" class="entry">
            <img src="${image}" class="entry-thumb" />
            <br>
            <text class="entry-label">${name}</text>
        </td>`;
        i++;
        nid++;
        if (i == 8) {
            i = 0;
            document.getElementById(`da-table`).appendChild(htmlToElement(`<tr>${tr}</tr>`));
            tr = 0;
        }
    }
    if (i != 0) {
        document.getElementById(`da-table`).appendChild(htmlToElement(`<tr>${tr}</tr>`));
    }
}
function guess_click(id) {
    document.getElementById(`id_${id}`).classList.toggle("entry-selected")
}
function generate() {
    ind = Math.floor(Math.random() * names.length);
    document.getElementById("selected-character").innerText = names[ind];
}