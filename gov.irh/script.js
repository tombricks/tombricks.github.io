function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

var articles = [
    {
        title: "President Thomas Bricks approves 3:5 ratio for flag",
        image: "assets/Flag of Havering Republic LARGE.png",
        text: "Through the <i>National Symbols Ex. Or. 2023</i>, President of the Republic, Thomas Bricks, has officialised the use of the state flag in a 3:5 ratio for both civil and governmental uses.",
        author: "Office of the President",
        date: "26 January 2023"
    }
]

for (article of articles) {
    document.getElementById("articles").appendChild(htmlToElement(`
    <tr><td class="article">
    <text class="article-header">${article.title}</text><br>
    <sup><i>${article.author}, ${article.date}</i></sup><br>
    <img class="article-img" src="${article.image}" /><br>
    <text class="article-text">${article.text}</text>
    <hr>
    </td></tr>
    `));
}

var dorders = [
    {
        name: "National Symbols Ex. Or. 2023",
        author: "President <i>Thomas Bricks</i>",
        date: "26 January 2023",
        full: `TBA`,
        type: "orders"
    },
    {
        name: "National Symbols Ex. Or. 2022 2",
        author: "President <i>Thomas Bricks</i>",
        date: "29 December 2022",
        full: `<h1>An Executive Order on the national symbols of the Republic.<\h1>

        BE IT ENACTED by the President of the Independent Republic of Havering, with the powers outined in Article 1 Section 2 of the Constitution, the following:
        
        <h2>Section 1</h2>
        (1) The state flag of the Independent Republic of Havering shall bear the colours green, red and blue placed vertically in said order where the total width shall be double the total height. The national emblem shall be placed center and have a vertical height no shorter than one-third of the total height.
        
        <br>(2) The national and civil flags shall be the state flag, with or without the national emblem. Should the national emblem be omitted, the restriction on the width relative to the height shall be lifted.
        
        <h2>Section 2</h2>
        (1) There shall be two national anthems, named Long Live Havering and Risen from the Ruins.
        
        <br>(2) The wording to Long Live Havering shall consist of the following:<br>
        
        <i>Long Live our Havering,
        <br>Free and independent, Our Republic!
        <br>Send it victorious,
        <br>Our liberation, realised by all of us:
        <br>Long Live Havering!</i>
        
        <br>(3) The wording to Risen from the Ruins shall consist of the following:<br>
        <i>From the ruins risen newly,
        <br>To the future turned, we stand.
        <br>Let us serve your good weal truly,
        <br>Havering, our free nation.
        <br>Triumph over bygone sorrow,
        <br>Can in unity be won.
        <br>For we shall attain a morrow,
        <br>When over our Havering, there is radiant sun,
        there is radiant sun!</i>
        
        <h2>Section 3</h2>
        This Executive Order may be cited as the National Symbols Ex. Or. 2022.
        `,
        type: "orders"
    },
    {
        name: "National Symbols Ex. Or. 2022 1",
        author: "President <i>Thomas Bricks</i>",
        date: "11 October 2022",
        full: `<h1>An Executive Order on the national symbols of the Republic.</h1>

        BE IT ENACTED by the President of the Independent Republic of Havering, with the powers outined in Article 1 Section 2 of the Constitution, the following:
        
        <h2>Section 1</h2>
        (1) The state flag of the Independent Republic of Havering shall bear the colours green, red and blue placed vertically in said order. The national emblem shall be placed center and have a vertical height no shorter than one-third of the total height.<br>
        
        (2) The national and civil flags shall be the state flag, with or without the national emblem.<br>
        
        <h2>Section 2</h2>
        (1) The national anthem shall be O Havering.
        
        <br>(2) The wording to O Havering shall consist of the following:<br>
        <i>O Havering, red star that burns bright.<br>
        The world's illuminated by your light.<br>Liberation is our destiny.<br>We swear to fight till final victory.<br>
        We swear to fight till final victory.</i>
        
        <h2>Section 3</h2>
        (1) This Executive Order may be cited as the National Symbols Ex. Or. 2022 2.<br>
        
        (2) National Symbols Ex. Or. 2022 may be further cited as National Symbols Ex. Or. 2022 1.`,
        type: "orders"
    }
]

ind = 0;
for (order of dorders) {
    document.getElementById(order.type).appendChild(htmlToElement(`
    <li><a href="javascript:open_order(${ind})">${order.name}</a><br><sup>${order.author}, ${order.date}</sup></li>
    `));
    ind++;
}

function open_order(id) {
    document.getElementById("modal-text").innerHTML = dorders[id].full;
    modal.style.display = "block";
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 