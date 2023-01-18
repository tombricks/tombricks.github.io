target = "";

function image_upload() {
    var reader = new FileReader();
    reader.onload = function() { document.getElementById(target).setAttribute("src", this.result); }
    reader.readAsDataURL(document.getElementById("img-input").files[0]);
}

function color_change() {
    document.getElementById("pol-circle").style.backgroundColor = document.getElementById("color-input").value;
}

alert(`Upload new image by clicking on:
-Flag (Automatically stretches to correct size)
-Ideology Icon (Centered)
-Focus Icon (Centered)
-Portrait (Automatically stretches to correct size)
-Event Image (Automatically stretches to correct size)
-Pie Chart (loads a colour picker)

All the text is also editable by clicking and typing.`)