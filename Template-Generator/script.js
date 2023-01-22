target = "";
var templates = [
    {
        x: 15,
        y: 15,
        elements: [
            {
                type: "image",
                src: "assets/event_news_bg.png",
                x: 0,
                y: 0
            },
            {
                type: "image",
                src: "assets/flag_unknown.png",
                x: 58,
                y: 90,
                width: 399,
                height: 155,
                replaceable: true
            },
            {
                type: "image",
                src: "assets/event_news_pic_overlay.png",
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
                width: 490
            },
            {
                type: "text",
                text: "Event Title",
                x: 12,
                y: 274,
                width: 490
            }
        ]
    }
]

var idn = 0;
for (template of templates) {
    var template_html = document.createElement("div");
    template_html.style.left = String(template.x)+"px";
    template_html.style.top = String(template.y)+"px";
    template_html.classList.add("element");

    for (element of template.elements) {
        idn++;
        var element_html;
        switch (element.type) {
            case "image":
                element_html = document.createElement("img");
                element_html.src = element.src;
                break;
            case "text":
                element_html = document.createElement("p");
                element_html.innerText = element.text;
                break;

        }
        element_html.classList.add("element");
        element_html.style.left = String(element.x)+"px";
        element_html.style.top = String(element.y)+"px";
        if (element.width !== undefined) {
            element_html.style.width = String(element.width)+"px";
        }
        if (element.height !== undefined) {
            element_html.style.height = String(element.height)+"px";
        }
        if (element.classes !== undefined) {
            element_html.classList.add(...element.classes);
        }

        if (element.replaceable) {
            if (element.type == "image") {
                element_html.classList.add("click");
                element_html.id = "id_"+String(idn);
                element_html.onclick = function() {
                    target = this.id;
                }
                var old_el = element_html;
                element_html = document.createElement("label");
                element_html.htmlFor = "image-input";
                element_html.appendChild(old_el);
            }
            else if (element.type == "text") {
                element.contentEditable = "true";
            }
        }
        else {
            element_html.classList.add("noclick");
        }

        template_html.appendChild(element_html);
    }
    document.body.appendChild(template_html);
}


function image_upload() {
    var reader = new FileReader();
    reader.onload = function() { document.getElementById(target).setAttribute("src", this.result); }
    reader.readAsDataURL(document.getElementById("image-input").files[0]);
}