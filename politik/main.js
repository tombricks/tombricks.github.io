var localisation = {};

async function readFile(filename) {
    const res = await fetch("content/" + filename);
    return res.text();
}

(async function() {
    const textData = await (await readFile('localisation')).split('\n');
    textData.forEach(value => {
        localisation[value.split(':')[0]] = value.split(':')[1];
    });
    for (const [key, value] of Object.entries(localisation)) {
        console.log(key + ": " + value + " <br>");
        document.writeln(key + ": " + value + " <br>");
    }
})();