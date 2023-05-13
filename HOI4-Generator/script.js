target = "";

var idn = 0;
for (template of templates) {
    var template_html = document.createElement("div");
    template_html.style.left = String(template.x) + "px";
    template_html.style.top = String(template.y) + "px";
    template_html.classList.add("element");
    if (template.style !== undefined) {
        var styleSheet = document.createElement("style");
        styleSheet.innerText = template.style;
        document.head.appendChild(styleSheet);
    }

    for (element of template.elements) {
        idn++;
        var element_html;
        switch (element.type) {
            case "image":
                element_html = document.createElement("img");
                element_html.src = element.src;
                break;
            case "circle":
                element_html = document.createElement("span");
                break;
            case "text":
                element_html = document.createElement("p");
                element_html.innerText = element.text;
                element_html.setAttribute("spellcheck", "false")
                break;

        }
        var id;
        if (element.id !== undefined) {
            id = element.id;
        }
        else {
            id = "id_" + String(idn);
        }
        element_html.id = id;
        element_html.classList.add("element");
        element_html.style.left = String(element.x) + "px";
        element_html.style.top = String(element.y) + "px";
        if (element.width !== undefined) {
            element_html.style.width = String(element.width) + "px";
        }
        if (element.height !== undefined) {
            element_html.style.height = String(element.height) + "px";
        }
        if (element.classes !== undefined) {
            element_html.classList.add(...element.classes);
        }
        if (element.style !== undefined) {
            var styleSheet = document.createElement("style");
            styleSheet.innerText = "#" + id + " { " + element.style + " }";
            document.head.appendChild(styleSheet);
        }

        if (element.replaceable) {
            if (element.type == "image") {
                element_html.classList.add("click");
                element_html.classList.add("editable");
                element_html.setAttribute("onclick", "target='" + id + "'")
                var old_el = element_html;
                element_html = document.createElement("label");
                element_html.htmlFor = "image-input";
                element_html.appendChild(old_el);
            }
            else if (element.type == "circle") {
                element_html.classList.add("click");
                element_html.classList.add("editable");
                element_html.setAttribute("onclick", "target='" + id + "'")
                var old_el = element_html;
                element_html = document.createElement("label");
                element_html.htmlFor = "color-input";
                element_html.appendChild(old_el);
            }
            else if (element.type == "text") {
                element_html.contentEditable = "true";
                element_html.classList.add("editable");
            }
        }
        else {
            element_html.classList.add("noclick");
            element_html.classList.add("non-editable");
        }

        template_html.appendChild(element_html);
    }
    document.getElementById("content").appendChild(template_html);
}

t = false;
document.addEventListener('keydown', (e) => {
    if (e.key === " " && !document.activeElement.classList.contains("editable")) {
        t = !t;
        if (t) {
            for (const element of document.getElementsByClassName("non-editable")) {
                element.style.opacity = 0.3
                element.style.filter = "blur(5px)"
            }
        }
        else {
            for (const element of document.getElementsByClassName("non-editable")) {
                element.style.opacity = 1
                element.style.filter = ""
            }
        }
    }
});

function image_upload() {
    var reader = new FileReader();
    reader.onload = function () { document.getElementById(target).setAttribute("src", this.result); }
    reader.readAsDataURL(document.getElementById("image-input").files[0]);
}
function color_change() {
    document.getElementById(target).style.backgroundColor = document.getElementById("color-input").value;
}
