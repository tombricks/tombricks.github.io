editing_focus_id = "-1"
focuses = {}
focusKeys = {}
tree_data = {
    "latestFocusID": -1,
    "tag": "GER",
}
editing_focus = false;
monaco_init = false;
var focus_monaco = {
    "available": null, "bypass": null, "reward": null, "allow": null, "cancel": null, "historical": null, "tooltip": null, "select": null
};

function focus_editor_clear_focuses () {
    $(".line").remove();
    $(".focus").remove();
    tree_data["latestFocusID"] = 0;
    focuses = {};
    focusKeys = {};
}

function focus_editor_create_new_tree() {
    focus_editor_clear_focuses();
    focus_editor_create_new_focus();
    focus_editor_select_focus("i1");
}

function focus_editor_create_new_focus() {
    tree_data["latestFocusID"] += 1;
    let new_focus = new Focus(tree_data["latestFocusID"]);
    focuses[`i${tree_data["latestFocusID"]}`] = new_focus;
    focusKeys[`i${tree_data["latestFocusID"]}`] = new_focus.id;
    focusKeys[new_focus.id] = `i${tree_data["latestFocusID"]}`;

    if (editing_focus_id in focuses) {
        focuses[new_focus.internalID].visible_x = focuses[editing_focus_id].visible_x;
        focuses[new_focus.internalID].relative_x = focuses[editing_focus_id].visible_x;
        focuses[new_focus.internalID].visible_y = focuses[editing_focus_id].visible_y + 1;
        focuses[new_focus.internalID].relative_y = focuses[editing_focus_id].visible_y + 1;
        if (focuses[editing_focus_id].relative_position_id != -1) {
            focus_editor_change_relative(new_focus.internalID, focuses[editing_focus_id].relative_position_id);
        }
    }

    focus_editor_create_focus_element(new_focus.internalID);
}

function focus_editor_create_focus_element(id) {
    $("#focus-panel-focuses").append(`<div onclick="focus_click(event, '${focuses[id].internalID}')" class="focus" id="focus-${focuses[id].internalID}" style="left: ${focuses[id].visible_x*96+13}px; top: ${focuses[id].visible_y*130}px">
    <img class="center" style="position: absolute; top: 40px" src="assets/focus_unavailable_bg.png" />
    <img class="focus-icon center focus-${focuses[id].internalID}-icon" style="position: absolute; top: -44px" src="assets/${focusesgfx[focuses[id].icon]}" />
    <p class="center focus-${focuses[id].internalID}-name" style="position: absolute; top: 76px; font-size: 14px">${focuses[id].name}</p>
    </div>`);
}

function focus_editor_select_focus(id) {
    editing_focus_id = id;
    let sFocus = focuses[id];
    $("#focus_name").val(sFocus.name);
    $("#focus_id").val(sFocus.id);
    $("#focus_icon").attr('src', 'assets/'+focusesgfx[sFocus.icon]);
    $("#focus_desc").val(sFocus.desc);
    $("#focus_x").val(sFocus.relative_x);
    $("#focus_y").val(sFocus.relative_y);
    $("#focus_relative_position").html(`<option style="font-style: italic;" value="-1">None</option>`);
    let genericList = focus_editor_generate_list([sFocus.internalID], sFocus.relative_position_id);
    console.log(genericList);
    $("#focus_relative_position").append(genericList);
    focus_editor_generate_prereqs(id);
    focus_editor_generate_mutuals();
    focus_editor_update_all();
    $("#focus_cost").val(sFocus.cost);
    $("#focus_available_if_capitulated").prop('checked', sFocus.available_if_capitulated);
    $("#focus_cancel_if_invalid").prop('checked', sFocus.cancel_if_invalid);
    $("#focus_continue_if_invalid").prop('checked', sFocus.continue_if_invalid);
    $("#focus_cancelable").prop('checked', sFocus.cancelable);
    $("#focus_bypass_if_unavailable").prop('checked', sFocus.bypass_if_unavailable);
    focus_monaco["available"].setValue(sFocus.blocks["available"]);
    focus_monaco["bypass"].setValue(sFocus.blocks["bypass"]);
    focus_monaco["reward"].setValue(sFocus.blocks["reward"]);
    focus_monaco["allow"].setValue(sFocus.blocks["allow"]);
    focus_monaco["cancel"].setValue(sFocus.blocks["cancel"]);
    focus_monaco["historical"].setValue(sFocus.blocks["historical"]);
    focus_monaco["tooltip"].setValue(sFocus.blocks["tooltip"]);
    focus_monaco["select"].setValue(sFocus.blocks["select"]);

    $(".focus").addClass("half-opacity");
    $(`#focus-${id}`).removeClass("half-opacity");
}

function focus_editor_new_focus_button() {
    focus_editor_create_new_focus();
    focus_editor_select_focus("i"+tree_data["latestFocusID"]);
}

function focus_editor_change_name() {
    if (focus_editor_generate_id_return(focuses[editing_focus_id].name) == focuses[editing_focus_id].id) {
        focus_editor_generate_id();
    }
    focuses[editing_focus_id].name = $("#focus_name").val();
    $(`.focus-${editing_focus_id}-name`).html(focuses[editing_focus_id].name);
}

function focus_editor_change_id() {
    focuses[editing_focus_id].id = $("#focus_id").val();
    delete focusKeys[focusKeys[editing_focus_id]];
    focusKeys[editing_focus_id] = $("#focus_id").val();
    focusKeys[$("#focus_id").val()] = editing_focus_id;
}

function focus_editor_change_relative_button() {
    focus_editor_change_relative(editing_focus_id, $("#focus_relative_position").val());
}

function focus_editor_change_relative(id, newRel) {
    if (newRel != -1) {
        focuses[id].relative_x = focuses[id].visible_x - focuses[newRel].visible_x;
        focuses[id].relative_y = focuses[id].visible_y - focuses[newRel].visible_y;
        if (focuses[id].relative_position_id != -1) {
            focuses[focuses[id].relative_position_id].relative_position_successors.splice(focuses[focuses[id].relative_position_id].relative_position_successors.indexOf(id), 1);
        }
        focuses[id].relative_position_id = newRel;
        focuses[focuses[id].relative_position_id].relative_position_successors.push(id);
        
        if (editing_focus_id == id) {
            $("#focus_x").val(focuses[id].relative_x);
            $("#focus_y").val(focuses[id].relative_y);
        }
    }
    else {
        focuses[id].relative_x = focuses[id].visible_x;
        focuses[id].relative_y = focuses[id].visible_y;
        if (editing_focus_id == id) {
            $("#focus_x").val(focuses[id].visible_x);
            $("#focus_y").val(focuses[id].visible_y);
        }
        focuses[focuses[id].relative_position_id].relative_position_successors.splice(focuses[focuses[id].relative_position_id].relative_position_successors.indexOf(id), 1);
        focuses[id].relative_position_id = -1;
    }
}

function focus_editor_change_pos() {
    let newRelX = parseInt($("#focus_x").val());
    let changeX = newRelX - focuses[editing_focus_id].relative_x;
    
    let newRelY = parseInt($("#focus_y").val());
    let changeY = newRelY - focuses[editing_focus_id].relative_y;
    focus_editor_change_pos_n(editing_focus_id, changeX, changeY);
}

function focus_editor_change_pos_n(id, changeX, changeY) {
    focuses[id].relative_x += changeX;
    focuses[id].visible_x += changeX;
    
    focuses[id].relative_y += changeY;
    focuses[id].visible_y += changeY;

    if (id == editing_focus_id) {
        $("#focus_x").val(focuses[id].relative_x);
        $("#focus_y").val(focuses[id].relative_y);
    }
    
    focus_editor_update_pos(id);
    focus_editor_change_pos_recursive(id, changeX, changeY);
}

function focus_editor_change_pos_recursive(id, changeX, changeY) {
    for (let newId of focuses[id].relative_position_successors) {
        focuses[newId].visible_x += changeX;
        focuses[newId].visible_y += changeY;
        focus_editor_update_pos(newId);
        focus_editor_change_pos_recursive(newId, changeX, changeY);
    }
}

function focus_editor_update_all() {
    for (let focus in focuses) {
        focus_editor_update_pos(focus);
        draw_focus_prerequisites(focus);
    }
}

function focus_editor_update_pos(id) {
    $(`#focus-${id}`).css('left', `${13+focuses[id].visible_x*96}px`);
    $(`#focus-${id}`).css('top', `${focuses[id].visible_y*130}px`);
    draw_focus_prerequisites(id);
}

function focus_editor_change_prereq(id, prereqId, subId) {
    let val = $(`#focus_prereq-${prereqId}-${subId}`).val();
    for (let newId of focuses[id].prerequisites[prereqId]) {
        if (focuses[newId].reverse_prerequisites.includes(id)) {
            focuses[newId].reverse_prerequisites.splice(focuses[newId].reverse_prerequisites.indexOf(id), 1);
        }
        if (focuses[newId].reverse_or_prerequisites.includes(id)) {
            focuses[newId].reverse_or_prerequisites.splice(focuses[newId].reverse_or_prerequisites.indexOf(id), 1);
        }
    }
    if (subId == focuses[id].prerequisites[prereqId].length) {
        if (val == -1) {

        }
        else { 
            focuses[id].prerequisites[prereqId].push(val);
        }
    }
    else {
        if (val == -1) {
            focuses[id].prerequisites[prereqId].splice(subId, 1);
        }
        else {
            focuses[id].prerequisites[prereqId][subId] = val;
        }
    }
    if (focuses[id].prerequisites[prereqId].length == 0) {
        focuses[id].prerequisites.splice(prereqId, 1);
    }
    else if (focuses[id].prerequisites[prereqId].length == 1) {
        for (let newId of focuses[id].prerequisites[prereqId]) {
            focuses[newId].reverse_prerequisites.push(id);
        }
    }
    else if (focuses[id].prerequisites[prereqId].length == 2) {
        for (let newId of focuses[id].prerequisites[prereqId]) {
            focuses[newId].reverse_or_prerequisites.push(id);
        }
    }
    focus_editor_generate_prereqs(id);
}

function focus_editor_create_prereq(id) {
    focuses[id].prerequisites.push([$("#focus_prereq-new").val()])
    focus_editor_generate_prereqs(id);
}

function focus_editor_generate_prereqs(id) {
    $("#focus_prerequisites").html("");
    let i1 = 0;
    for (let prereq of focuses[id].prerequisites) {
        let i2 = 0;
        let text = "<div>";
        for (let newId of prereq) {
            let nGenericList = focus_editor_generate_list([id], newId);
            text += `<select id="focus_prereq-${i1}-${i2}" onchange="focus_editor_change_prereq('${id}', ${i1}, ${i2})"><option style="font-style: italic;" value="-1">None</option>${nGenericList}</select> or `;
            i2 += 1;
        }
        let nGenericList = focus_editor_generate_list([id], -1);
        text += `<select id="focus_prereq-${i1}-${i2}" onchange="focus_editor_change_prereq('${id}', ${i1}, ${i2})"><option style="font-style: italic;" value="-1" selected>Select Focus</option>${nGenericList}</select></div><hr>`;
        $("#focus_prerequisites").append(text);
        i1 += 1;
    }
    $("#focus_prerequisites").append(`<select id="focus_prereq-new" onchange="focus_editor_create_prereq('${id}')"><option selected style="font-style: italic;" value="-1">Select Focus</option>${focus_editor_generate_list([id])}</select>`);

    draw_focus_prerequisites(id);
}

function focus_editor_generate_mutuals() {
    $("#focus_mutually_exclusives").html("");
    let i = 0;
    for (let mutual of focuses[editing_focus_id].mutually_exclusives) {
        genericList = focus_editor_generate_list([editing_focus_id], mutual);
        $("#focus_mutually_exclusives").append(`<select id="focus_mutual-${i}" onchange="focus_editor_change_mutual(${i})"><option style="font-style: italic;" value="-1">None</option>${genericList}</select><br>`);
        i += 1;
    }
    genericList = focus_editor_generate_list([editing_focus_id]);
    $("#focus_mutually_exclusives").append(`<select id="focus_mutual-new" onchange="focus_editor_create_mutual()"><option style="font-style: italic;" value="-1" selected>Select Focus</option>${genericList}</select><br>`);

    draw_focus_prerequisites(editing_focus_id);
}

function focus_editor_create_mutual() {
    focuses[editing_focus_id].mutually_exclusives.push($("#focus_mutual-new").val());
    focuses[$("#focus_mutual-new").val()].mutually_exclusives.push(editing_focus_id);
    focus_editor_generate_mutuals();
}

function focus_editor_change_mutual(i) {
    let newMut = $(`#focus_mutual-${i}`).val();
    let oldMut = focuses[editing_focus_id].mutually_exclusives[i];
    if (newMut == -1) {
        focuses[oldMut].mutually_exclusives.splice(focuses[oldMut].mutually_exclusives.indexOf(editing_focus_id), 1);
        focuses[editing_focus_id].mutually_exclusives.splice(focuses[editing_focus_id].mutually_exclusives.indexOf(oldMut), 1);
    }
    else {
        focuses[oldMut].mutually_exclusives.splice(focuses[oldMut].mutually_exclusives.indexOf(editing_focus_id), 1);
        focuses[editing_focus_id].mutually_exclusives[i] = newMut;
        focuses[newMut].mutually_exclusives.push(editing_focus_id);
    }
    focus_editor_generate_mutuals();
}

function focus_editor_generate_list(ids, match=-3) {
    let genericList = "";
    for (let newId in focuses) {
        if (!ids.includes(newId)) {
            if (match == newId) {
                genericList += `<option selected value="${newId}">${focuses[newId].name}</option>`;
            }
            else {
                genericList += `<option value="${newId}">${focuses[newId].name}</option>`;
            }
        }
    }
    return genericList;
}

function focus_editor_icon_click(gfx) {
    focuses[editing_focus_id].icon = gfx;
    $("#focus_icon").attr('src', 'assets/'+focusesgfx[gfx]);
    $(`.focus-${editing_focus_id}-icon`).attr('src', 'assets/'+focusesgfx[gfx]);
    $("#modal").hide();
}

function focus_editor_open_gallery() {
    $("#modal").show();
}

window.onclick = function(event) {
    if (event.target == document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
} 

function Focus(internalID) {
    this.internalID = `i${internalID}`;
    this.id = `new_focus_${internalID}`;
    this.name = "New Focus";
    this.icon = "GFX_goal_unknown";
    this.visible_x = 0;
    this.visible_y = 0;
    this.relative_x = 0;
    this.relative_y = 0;
    this.prerequisites = [];
    this.reverse_prerequisites = [];
    this.reverse_or_prerequisites = [];
    this.mutually_exclusives = [];
    this.blocks = {}
    for (let thing in focus_monaco) {
        this.blocks[thing] = "";
    }
    this.desc = "";
    this.cost = 1;
    // need to add
    this.relative_position_id = -1;
    this.relative_position_successors = [];
    this.relative_position_predecessors = [];
    this.dynamic = false;
    this.available_if_capitulated = false;
    this.cancel_if_invald = false;
    this.continue_if_invalid = false;
    this.cancelable = false;
    this.bypass_if_unavailable = false;
    this.will_lead_to_war_with = [];
    this.offset = "";
    this.ai_will_do = "";
    this.search_filters = [];
}
function create_horizontal_line(divname, classes, originx, originy, length) {
    $("#line-container").append(`
        <div
            id="${divname}"
            class="line ${classes}"
            style="position:absolute;
                left:   ${ ((originx + 1) * 96) - 1  }px;
                top:    ${ ((originy) * 130) + 84  }px;
                width:  ${ (length * 96) + 2 }px;
                height: 2px
            "
        ></div>
    `);
}
function create_vertical_line(divname, classes, originx, originy, length) {
    $("#line-container").append(`
        <div
            id="${divname}"
            class="line ${classes}"
            style="position:absolute;
                left:   ${ ((originx + 1) * 96) - 1  }px;
                top:    ${ ((originy) * 130) + 84  }px;
                width:  2px;
                height: ${ (length * 130) + 2 }px;
            "
        ></div>
    `);
}
function draw_prerequisite_line(focus1, focus2, classes) {
    let x1 = focuses[focus1].visible_x;
    let y1 = focuses[focus1].visible_y;
    let x2 = focuses[focus2].visible_x;
    let y2 = focuses[focus2].visible_y;
    if (x1 == x2) {
        create_vertical_line(
            `prerequisite-straight-${focus1}-${focus2}`,
            `line-focus-${focus1} line-focus-${focus2} prerequisite prerequisite-${focus1}-${focus2} ${classes}`,
            x1,
            y1,
            y2-y1
        );
    }
    else if (focuses[focus1].visible_x > focuses[focus2].visible_x) {
        create_vertical_line(
            `prerequisite-left-${focus1}-${focus2}-1`,
            `line-focus-${focus1} line-focus-${focus2} prerequisite prerequisite-${focus1}-${focus2} ${classes}`,
            x1,
            y1,
            0.25
        );
        create_horizontal_line(
            `prerequisite-left-${focus1}-${focus2}-2`,
            `line-focus-${focus1} line-focus-${focus2} prerequisite prerequisite-${focus1}-${focus2} ${classes}`,
            x2,
            y1+0.25,
            x1-x2
        );
        create_vertical_line(
            `prerequisite-left-${focus1}-${focus2}-2`,
            `line-focus-${focus1} line-focus-${focus2} prerequisite prerequisite-${focus1}-${focus2} ${classes}`,
            x2,
            y1+0.25,
            y2-y1-0.25
        );
    }
    else {
        create_vertical_line(
            `prerequisite-right-${focus1}-${focus2}-1`,
            `line-focus-${focus1} line-focus-${focus2} prerequisite prerequisite-${focus1}-${focus2} ${classes}`,
            x1,
            y1,
            0.25
        );
        create_horizontal_line(
            `prerequisite-right-${focus1}-${focus2}-2`,
            `line-focus-${focus1} line-focus-${focus2} prerequisite prerequisite-${focus1}-${focus2} ${classes}`,
            x1,
            y1+0.25,
            x2-x1
        );
        create_vertical_line(
            `prerequisite-right-${focus1}-${focus2}-2`,
            `line-focus-${focus1} line-focus-${focus2} prerequisite prerequisite-${focus1}-${focus2} ${classes}`,
            x2,
            y1+0.25,
            y2-y1-0.25
        );
    }
}
function draw_focus_prerequisites(focus) {
    $(`.line-focus-${focus}`).remove();
    for (let prereq of focuses[focus].prerequisites) {
        if (prereq.length == 1) {
            draw_prerequisite_line(prereq[0], focus, "");
        }
        else {
            for (let prereq2 of prereq) {
                draw_prerequisite_line(prereq2, focus, "prerequisite-or");
            }
        }
    }
    for (let lead of focuses[focus].reverse_prerequisites) {
        draw_prerequisite_line(focus, lead, "");
    }
    for (let lead of focuses[focus].reverse_or_prerequisites) {
        draw_prerequisite_line(focus, lead, "prerequisite-or");
    }

    for(let mutual of focuses[focus].mutually_exclusives) {
        if (focuses[mutual].visible_x > focuses[focus].visible_x) {
            create_horizontal_line(`mutually-exclusive-${focus}-${mutual}`, `line-focus-${focus} line-focus-${mutual} prerequisite mutually-exclusive-${focus}-${mutual} mutually-exclusive`, focuses[focus].visible_x, focuses[focus].visible_y, focuses[mutual].visible_x-focuses[focus].visible_x);
        }
        else {
            create_horizontal_line(`mutually-exclusive-${focus}-${mutual}`, `line-focus-${focus} line-focus-${mutual} prerequisite mutually-exclusive-${focus}-${mutual} mutually-exclusive`, focuses[mutual].visible_x, focuses[focus].visible_y, focuses[focus].visible_x-focuses[mutual].visible_x);
        }
    }
}

function delete_focus(focus) {
    for (let focus2 in focuses) {
        if (focuses[focus2].reverse_prerequisites.includes(focus)) {
            focuses[focus2].reverse_prerequisites.pop(focus);
        }
        if (focuses[focus2].reverse_or_prerequisites.includes(focus)) {
            focuses[focus2].reverse_or_prerequisites.pop(focus);
        }
        for (let int in focuses[focus2].prerequisites) {
            while (focuses[focus2].prerequisites[int].includes(focus)) {
                focus_edit_del_prereq_focus(int, focuses[focus2].prerequisites[int].indexOf(focus), focus2);
            }
        }
    }
    $(`#focus-${focus}`).remove();
    $(`.line-focus-${focus}`).remove();
    delete focuses[focus];
}
function focus_click(e, id) {
    if (e.shiftKey) {
    }
    else {
        if (editing_focus_id == id) {
        }
        else {
            focus_editor_select_focus(id);
        }
    }
}
function focus_editor_generate_id() {
    $("#focus_id").val(focus_editor_generate_id_return($("#focus_name").val()));
    focus_editor_change_id();
}
function focus_editor_generate_id_return(id) {
    return tree_data["tag"]+"_"+(id.split(" ").join("_").toLowerCase());
}
function focus_editor_save_focuses() {
    localStorage.setItem("focuses", JSON.stringify(focuses));
    localStorage.setItem("focusKeys", JSON.stringify(focusKeys));
    localStorage.setItem("tree_data", JSON.stringify(tree_data));
}
function focus_editor_load_focuses(t_focuses, t_keys, t_id) {
    focus_editor_clear_focuses();
    focuses = JSON.parse(localStorage.getItem("focuses"));
    focusKeys = JSON.parse(localStorage.getItem("focusKeys"));
    tree_data = JSON.parse(localStorage.getItem("tree_data"));

    for (let focus in focuses) {
        focus_editor_create_focus_element(focus);
    }

    focus_editor_update_all();
    focus_editor_select_focus(Object.keys(focuses)[Object.keys(focuses).length - 1]);
}

function focus_editor_search_gallery() {
    let check = $("#focus-gfx-search").val().toLowerCase();
    $(".focus-gfx").each(function() {
        if (!$(this).attr('id').toLowerCase().includes(check)) {
            $(this).hide();
        }
        else {
            $(this).show();
        }
    })
}

$(document).ready(function() {
    $("#modal").hide();
    for (let gfx in focusesgfx) {
        $("#focus-gfx-panel-gfx").append(`
            <div class="focus-gfx" id="focus-gfx-${gfx}">
            <img onclick="focus_editor_icon_click('${gfx}')" class="focus-gfx-icon center" src="assets/${focusesgfx[gfx]}"></img>
            <p style="
            word-break: break-all">${gfx}</p>
            </div>
        `)
    }

    /* #region Monaco */
    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
    window.MonacoEnvironment = { getWorkerUrl: () => proxy };

    let proxy = URL.createObjectURL(new Blob([`
        self.MonacoEnvironment = {
            baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
        };
        importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
    `], { type: 'text/javascript' }));

    require(["vs/editor/editor.main"], function () {
        monaco.languages.register({id: "hoi4script"});
        effects = [ "add_political_power", "add_stability", "add_war_support" ];
        triggers = [ "is_subject" ];
        monaco.languages.setMonarchTokensProvider("hoi4script", {
            effects, triggers,
            tokenizer: {
                root: [
                    [/[a-zA-Z0-9]{3}$/, 'number.hex'],
                    [ /@?[a-zA-Z][\w$]*/, {
                        cases: {
                            "@effects": "keyword",
                            "@triggers": "keyword",
                            "@default": "variable",
                        }
                    }],
                    [/".*?"/, "string"],
                    [/(^#.*$)/, 'comment'],
                    [/[{}]/, '@brackets'],
                    [/\d+/, 'number'],
                    [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                ]
            }
        });
        monaco.editor.defineTheme("hoi4script-theme", {
            base: "vs",
            rules: [
                { token: "comment", foreground: "#999999" },
                { token: "string", foreground: "#009966" },
            ]
        });
        monaco.languages.registerCompletionItemProvider("hoi4script", {
            provideCompletionItems: (model, position) => {
                const suggestions = [
                    ...effects.map(k => {
                        return {
                            label: k,
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: k,
                        }
                    }), ...triggers.map(k => {
                        return {
                            label: k,
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: k,
                        }
                    })
                ];
                return { suggestions: suggestions };
            }
        });
        monaco.languages.setLanguageConfiguration("hoi4script", {
            surroundingPairs: [
                { open: '{', close: '}' },
                { open: '"', close: '"' },
            ],
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '"', close: '"' },
            ]
        });

        for (let thing in focus_monaco) {
            focus_monaco[thing] = monaco.editor.create(document.getElementById('focus_monaco_'+thing), {
                value: "",
                theme: "hoi4script-theme",
                language: 'hoi4script',
                theme: 'vs-dark',
                automaticLayout: true
            });
        }
        focus_monaco["reward"].getModel().onDidChangeContent((event) => { focuses[editing_focus_id].blocks["reward"] = focus_monaco["reward"].getValue();    });
        focus_monaco["available"].getModel().onDidChangeContent((event) => { focuses[editing_focus_id].blocks["available"] = focus_monaco["available"].getValue();    });
        focus_monaco["bypass"].getModel().onDidChangeContent((event) => { focuses[editing_focus_id].blocks["bypass"] = focus_monaco["bypass"].getValue();    });
        focus_monaco["allow"].getModel().onDidChangeContent((event) => { focuses[editing_focus_id].blocks["allow"] = focus_monaco["allow"].getValue();    });
        focus_monaco["cancel"].getModel().onDidChangeContent((event) => { focuses[editing_focus_id].blocks["cancel"] = focus_monaco["cancel"].getValue();    });
        focus_monaco["historical"].getModel().onDidChangeContent((event) => { focuses[editing_focus_id].blocks["historical"] = focus_monaco["historical"].getValue();    });
        focus_monaco["select"].getModel().onDidChangeContent((event) => { focuses[editing_focus_id].blocks["select"] = focus_monaco["select"].getValue();    });
        focus_monaco["tooltip"].getModel().onDidChangeContent((event) => { focuses[editing_focus_id].blocks["tooltip"] = focus_monaco["tooltip"].getValue();    });
        monaco_init = true;

        $("#loading").remove();
    
        focus_editor_create_new_tree();
    });
    /* #endregion */
});
document.onkeydown = function(e) {
        switch(e.which) {
            case 37: // left
            if (focuses[editing_focus_id].visible_x > 0) {
                $("#focus_x").val( parseInt($("#focus_x").val()) -1 );
            focus_editor_change_pos();
            }
            break;

            case 38: // up
            if (focuses[editing_focus_id].visible_y > 0) {
                $("#focus_y").val( parseInt($("#focus_y").val()) -1 );
            focus_editor_change_pos();
            }
            break;

            case 39: // right
            $("#focus_x").val( parseInt($("#focus_x").val()) +1 );
            focus_editor_change_pos();
            break;

            case 40: // down
            $("#focus_y").val( parseInt($("#focus_y").val()) +1 );
            focus_editor_change_pos();
            break;

            case 13: //enter
            $(`#focus-${editing_focus_id}`).click();
            break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
};