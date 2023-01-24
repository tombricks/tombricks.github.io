var vanilla_templates = [
    {
        x: 560,
        y: 40,
        style: `
        .hoi4-text {
            font-family: 'Verdana', sans-serif;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 2px black;
        }
        body {
            background-color: #111111
        }
        `,
        elements: [
            {
                type: "image",
                src: "assets/vanilla/event_news_bg.png",
                x: 0,
                y: 0
            },
            {
                type: "image",
                src: "assets/vanilla/flag_unknown.png",
                x: 58,
                y: 90,
                width: 399,
                height: 155,
                replaceable: true
            },
            {
                type: "image",
                src: "assets/vanilla/event_news_pic_overlay.png",
                x: 58,
                y: 90,
                width: 399,
                height: 155
            },
            {
                type: "text",
                text: "Event Title",
                x: 12,
                y: 238,
                width: 490,
                replaceable: true,
                style: "font-size: 22px; text-align: center;"
                
            },
            {
                type: "text",
                text: "Event Desc",
                x: 31,
                y: 274,
                width: 452,
                replaceable: true
            },
            {
                type: "image",
                src: "assets/vanilla/event_option_entry.png",
                x: 259,
                y: 528,
                classes: ["center"]
            },
            {
                type: "text",
                text: "Event Option",
                x: 109,
                y: 493,
                width: 300, height: 36,
                replaceable: true,
                classes: ["hoi4-text"],
                style: "font-size: 14px; text-align: center; justify-content: center; display: flex; align-items: center;"
            },
        ]
    },
    {
        x: 15,
        y: 40,
        elements: [
            {
                id: "flag",
                type: "image",
                src: "assets/vanilla/flag_unknown.png",
                x: 33,
                y: 7,
                width: 84,
                height: 53,
                replaceable: true
            },
            {
                id: "portrait",
                type: "image", src: "assets/vanilla/leader_unknown.png",
                x: 16,
                y: 122, width: 116, height: 156,
                replaceable: true
            },
            {
                type: "image", src: "assets/vanilla/diplo_background.png",
                x: 0, y: 0
            },
            {
                type: "image", src: "assets/vanilla/unknown.png",
                x: 186, y: 38,
                classes: ["center"],
                replaceable: true
            },
            {
                type: "text", text: "Country Name",
                x: 240, y: -8,
                classes: ["hoi4-text"], style: "font-size: 15px",
                replaceable: true
            },
            {
                type: "text", text: "Faction Name",
                x: 240, y: 13,
                classes: ["hoi4-text"], style: "font-size: 15px",
                replaceable: true
            },
            {
                type: "text", text: "Leader Name",
                x: 240, y: 36,
                classes: ["hoi4-text"], style: "font-size: 13px",
                replaceable: true
            },
            {
                type: "text", text: "Party Name",
                x: 263, y: 122,
                classes: ["hoi4-text"], style: "font-size: 13px",
                replaceable: true
            },
            {
                type: "text", text: "Ideology",
                x: 263, y: 140,
                classes: ["hoi4-text"], style: "font-size: 13px",
                replaceable: true
            },
            {
                type: "text", text: "Election Label",
                x: 263, y: 158,
                classes: ["hoi4-text"], style: "font-size: 13px",
                replaceable: true
            },
            {
                type: "circle",
                x: 154, y: 129,
                width: 63, height: 63,
                style: "border-radius: 50%; background-color: #888888;",
                replaceable: true
            },
            {
                type: "image", src: "assets/vanilla/pol_piechart_overlay.png",
                x: 150, y: 125,
            },
            {
                type: "image", src: "assets/vanilla/goal_unknown.png",
                x: 185, y: 242,
                classes: ["center"], style: "transform: scale(90%) translate(-50%, -50%);",
                replaceable: true
            },
            {
                type: "text", text: "Focus Name",
                x: 240, y: 218,
                width: 285,
                classes: ["hoi4-text"], style: "font-size: 13px; text-align: center;",
                replaceable: true
            }
        ]
    }
]

var tno_templates = [
    {
        x: 10,
        y: 40,
        style: `
@font-face {
    font-family: bomb;
    src: url("assets/TNO/BOMBARD_.ttf");
}
@font-face {
    font-family: aldrich;
    src: url("assets/TNO/AldrichTNOV13.ttf")
}
.TNO-header-text {
    color: white;
    font-family: bomb;
}
.TNO-info-text {
    color: #B2C9C2;
    font-family: bomb;
}
body {
    background-color: #111111
}
          `,
        elements: [
            {
                id: "flag",
                type: "image",
                src: "assets/vanilla/flag_unknown.png",
                x: 23,
                y: 9,
                width: 82,
                height: 52,
                replaceable: true
            },
            {
                id: "portrait",
                type: "image", src: "assets/vanilla/leader_unknown.png",
                x: 5, y: 73,
                width: 117, height: 156,
                replaceable: true
            },
            {
                type: "image", src: "assets/TNO/diplo_upper_win_bg.png",
                x: 0, y: 0
            },
            {
                type: "image", src: "assets/TNO/unfinished_subid_template.png",
                x: 176, y: 36,
                classes: ["center"],
                replaceable: true
            },
            {
                type: "text", text: "Country Name",
                x: 214, y: -8,
                classes: ["TNO-header-text"], style: "font-size: 16px",
                replaceable: true
            },
            {
                type: "text", text: "Faction Name",
                x: 214, y: 10,
                classes: ["TNO-header-text"], style: "font-size: 16px",
                replaceable: true
            },
            {
                type: "text", text: "Leader Name",
                x: 214, y: 27,
                classes: ["TNO-header-text"], style: "font-size: 16px",
                replaceable: true
            },
            {
                type: "text", text: "Party Name",
                x: 236, y: 68,
                classes: ["TNO-info-text"], style: "font-size: 20px",
                replaceable: true
            },
            {
                type: "text", text: "Ideology",
                x: 236, y: 91,
                classes: ["TNO-info-text"], style: "font-size: 20px",
                replaceable: true
            },
            {
                type: "text", text: "Election Label",
                x: 236, y: 114,
                classes: ["TNO-info-text"], style: "font-size: 20px",
                replaceable: true
            },
            {
                type: "circle",
                x: 145, y: 85,
                width: 63, height: 63,
                style: "border-radius: 50%; background-color: #888888;",
                replaceable: true
            },
            {
                type: "image", src: "assets/TNO/pol_piechart_overlay.png",
                x: 141, y: 81,
            },
            {
                type: "image", src: "assets/vanilla/goal_unknown.png",
                x: 175, y: 191,
                classes: ["center"], style: "transform: scale(90%) translate(-50%, -50%);",
                replaceable: true
            },
            {
                type: "text", text: "Focus Name",
                x: 234, y: 154,
                width: 272,
                classes: ["TNO-info-text"], style: "font-size: 24px; text-align: center;",
                replaceable: true
            }
        ]
    },
    {
        x: 540,
        y: 40,
        elements: [
            {
                type: "image", src: "assets/TNO/superevent_unknown.png",
                x: 8, y: 53,
                width: 572, height: 390,
                replaceable: true
            },
            {
                type: "image", src: "assets/TNO/superevent.png",
                x: 0, y: 0,
            },
            {
                type: "text", text: "Quote\n-A person",
                x: 117, y: 285,
                width: 455,
                classes: ["TNO-header-text"], style: "font-size: 24px; text-align: right;",
                replaceable: true
            },
            {
                type: "text", text: "Button Text",
                x: 194, y: 440,
                width: 200,
                classes: ["TNO-header-text"], style: "font-size: 20px; text-align: center;",
                replaceable: true
            },
            {
                type: "text", text: "Event Title",
                x: 194, y: -4,
                width: 200,
                classes: ["TNO-info-text"], style: "font-size: 20px; text-align: center;",
                replaceable: true
            }
        ]
    },
    {
        x: 10, y: 280,
        style: `.TNO-news-text {
    color: black;
    font-family: 'Times New Roman', sans-serif;
}`,
        elements: [
            {
                type: "image", src: "assets/TNO/news_event.png",
                x: 0, y: 0
            },
            {
                type: "image", src: "assets/vanilla/flag_unknown.png",
                x: 27, y: 139,
                width: 161, height: 420,
                replaceable: true
            },
            {
                type: "image", src: "assets/TNO/news_event_overlay.png",
                x: 27, y: 139,
                width: 161, height: 420
            },
            {
                type: "text", text: "Event Title",
                x: 34, y: 82,
                width: 460,
                classes: [`TNO-news-text`], style: "font-size: 22px; text-align: center;",
                replaceable: true
            },
            {
                type: "text", text: "Event Desc",
                x: 195, y: 140,
                width: 310,
                classes: [`TNO-news-text`], style: "font-size: 16px; text-align: left;",
                replaceable: true
            },
            {
                type: "image", src: "assets/TNO/event_option_entry.png",
                x: 165, y: 496
            },
            {
                type: "text", text: "Button Text",
                x: 172, y: 486,
                width: 340, height: 40,
                classes: [`TNO-news-text`], style: "justify-content: center; display: flex; align-items: center;",
                replaceable: true
            }
        ]
    }
]

var templates = [];
const urlParams = new URL(window.location.href).searchParams;

if (urlParams.has("TNO")) {
    templates = tno_templates;
    document.getElementById("q-drop").innerHTML = document.getElementById("q-drop").innerText + " <a href='index.html'>Here for Vanilla version.</a>";
}
else {
    templates = vanilla_templates;
    document.getElementById("q-drop").innerHTML = document.getElementById("q-drop").innerText + " <a href='index.html?TNO'>Here for TNO version.</a>";
}