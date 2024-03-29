let editing_focus_id = "-1"
let tree_data = {}
monaco_init = false;
var focus_monaco = {
    "available": null, "bypass": null, "completion_reward": null, "allow_branch": null, "cancel": null, "historical_ai": null, "complete_tooltip": null, "select_effect": null, "ai_will_do": null
};

function focus_editor_generate_filters() {
    for (let id in tree_data["filters"]) {
        $("#focus_filters").append(`<div style="height: 32px;">${tree_data["filters"][id]} <input id="focus_filters-${id}" type="checkbox" onchange="focus_editor_change_filter('${id}')" style="height: 24px; top: 4px; position: relative;"></div>`)
    }
    $("#focus_filters").css('height', `${Object.keys(tree_data["filters"]).length*32}px`);
}
function focus_editor_open_filters() {
    $("#focus_filters").toggle();
}
function focus_editor_change_filter(filter) {
    let val = $(`#focus_filters-${filter}`).prop('checked');
    if (val) {
        tree_data["focus_data"][editing_focus_id].search_filters.push(filter);
    }
    else {
        tree_data["focus_data"][editing_focus_id].search_filters.splice(tree_data["focus_data"][editing_focus_id].search_filters.indexOf(filter), 1);
    }
}
function focus_editor_clear_focuses () {
    $(".line").remove();
    $(".focus").remove();
    tree_data["latestFocusID"] = 0;
    tree_data["focus_data"] = {};
}

function focus_editor_create_new_tree() {
    focus_editor_clear_focuses();
    focus_editor_deselect_focus();
    tree_data = {
        "latestFocusID": 0,
        "tag": "GER",
        "filters": {
            "FOCUS_FILTER_POLITICAL": "Political",
            "FOCUS_FILTER_RESEARCH": "Research",
            "FOCUS_FILTER_INDUSTRY": "Industry",
            "FOCUS_FILTER_STABILITY": "Stability",
            "FOCUS_FILTER_WAR_SUPPORT": "War support",
            "FOCUS_FILTER_MANPOWER": "Manpower",
            "FOCUS_FILTER_ANNEXATION": "Territorial Expansion",
            "FOCUS_FILTER_ARMY_XP": "Army Experience",
            "FOCUS_FILTER_NAVY_XP": "Navy Experience",
            "FOCUS_FILTER_AIR_XP": "Air Experience",
            "FOCUS_FILTER_TFV_AUTONOMY": "Autonomy",
            "FOCUS_FILTER_BALANCE_OF_POWER": "Balance of Power",
        },
        "focus_data": {}
    };
    focus_editor_generate_filters();
    focus_editor_create_new_focus();
    focus_editor_select_focus(`i${tree_data["latestFocusID"]}`);
}

function focus_editor_create_new_focus() {
    tree_data["latestFocusID"] += 1;
    let new_focus = new Focus(tree_data["latestFocusID"]);
    tree_data["focus_data"][`i${tree_data["latestFocusID"]}`] = new_focus;

    if (editing_focus_id in tree_data["focus_data"]) {
        tree_data["focus_data"][new_focus.internalID].visible_x = tree_data["focus_data"][editing_focus_id].visible_x;
        tree_data["focus_data"][new_focus.internalID].relative_x = tree_data["focus_data"][editing_focus_id].visible_x;
        tree_data["focus_data"][new_focus.internalID].visible_y = tree_data["focus_data"][editing_focus_id].visible_y + 1;
        tree_data["focus_data"][new_focus.internalID].relative_y = tree_data["focus_data"][editing_focus_id].visible_y + 1;
        if (tree_data["focus_data"][editing_focus_id].relative_position_id != "-1") {
            focus_editor_change_relative(new_focus.internalID, tree_data["focus_data"][editing_focus_id].relative_position_id);
        }
    }

    focus_editor_create_focus_element(new_focus.internalID);
}

function focus_editor_create_focus_element(id) {
    $("#focus-panel-focuses").append(`<div onclick="focus_click(event, '${tree_data["focus_data"][id].internalID}')" class="focus" id="focus-${tree_data["focus_data"][id].internalID}" style="left: ${tree_data["focus_data"][id].visible_x*96+13}px; top: ${tree_data["focus_data"][id].visible_y*130}px">
    <img class="center" style="position: absolute; top: 40px" src="assets/focus_unavailable_bg.png" />
    <img class="focus-icon center focus-${tree_data["focus_data"][id].internalID}-icon" style="position: absolute; top: -44px" src="assets/${focusesgfx[tree_data["focus_data"][id].icon]}" />
    <p class="center focus-${tree_data["focus_data"][id].internalID}-name" style="position: absolute; top: 76px; font-size: 14px">${tree_data["focus_data"][id].name}</p>
    </div>`);
}

function focus_editor_select_focus(id) {
    editing_focus_id = id;
    let sFocus = tree_data["focus_data"][id];
    $("#focus_name").val(sFocus.name);
    $("#focus_id").val(sFocus.id);
    $("#focus_icon").attr('src', 'assets/'+focusesgfx[sFocus.icon]);
    $("#focus_desc").val(sFocus.desc);
    $("#focus_x").val(sFocus.relative_x);
    $("#focus_y").val(sFocus.relative_y);
    $("#focus_relative_position").html(`<option style="font-style: italic;" value="-1">None</option>`);
    let genericList = focus_editor_generate_list([sFocus.internalID], sFocus.relative_position_id);
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
    focus_monaco["completion_reward"].setValue(sFocus.blocks["completion_reward"]);
    focus_monaco["allow_branch"].setValue(sFocus.blocks["allow_branch"]);
    focus_monaco["cancel"].setValue(sFocus.blocks["cancel"]);
    focus_monaco["historical_ai"].setValue(sFocus.blocks["historical_ai"]);
    focus_monaco["ai_will_do"].setValue(sFocus.blocks["ai_will_do"]);
    focus_monaco["complete_tooltip"].setValue(sFocus.blocks["complete_tooltip"]);
    focus_monaco["select_effect"].setValue(sFocus.blocks["select_effect"]);

    for(let filter in tree_data["filters"]) {
        $(`#focus_filters-${filter}`).prop('checked', sFocus.search_filters.includes(filter));
    }

    $("#edit-focus").show();

    $(".focus").addClass("half-opacity");
    $(`#focus-${id}`).removeClass("half-opacity");
}

function focus_editor_deselect_focus() {
    $("#edit-focus").hide();
    editing_focus_id = "-1";
    $(".focus").removeClass("half-opacity");
}

function focus_editor_new_focus_button() {
    focus_editor_create_new_focus();
    focus_editor_select_focus("i"+tree_data["latestFocusID"]);
}

function focus_editor_change_name() {
    if (focus_editor_generate_id_return(tree_data["focus_data"][editing_focus_id].name) == tree_data["focus_data"][editing_focus_id].id) {
        focus_editor_generate_id();
    }
    tree_data["focus_data"][editing_focus_id].name = $("#focus_name").val();
    $(`.focus-${editing_focus_id}-name`).html(tree_data["focus_data"][editing_focus_id].name);
}

function focus_editor_change_id() {
    tree_data["focus_data"][editing_focus_id].id = $("#focus_id").val();
}

function focus_editor_change_relative_button() {
    console.log(editing_focus_id, $("#focus_relative_position").val());
    focus_editor_change_relative(editing_focus_id, $("#focus_relative_position").val());
}

function focus_editor_delete_focus(id) {
    let temp = [...tree_data["focus_data"][id].relative_position_successors];
    for (let focus of temp) {
        focus_editor_change_relative(focus, "-1");
    }
    if (tree_data["focus_data"][id].relative_position_id != "-1") {
        focus_editor_change_relative(id, "-1");
    }
    checkW: while (tree_data["focus_data"][id].prerequisites.length > 0) {
        for (let t of tree_data["focus_data"][id].prerequisites) {
            for(let d in tree_data["focus_data"][id].prerequisites[0]) {
                focus_editor_change_prereq(id, 0, 0, -1)
                continue checkW;
            }
        }
    }

    for (let focus in tree_data["focus_data"]) {
        if (focus != id) {
            if (tree_data["focus_data"][focus].mutually_exclusives.includes(id)) { tree_data["focus_data"][focus].mutually_exclusives.splice(tree_data["focus_data"][focus].mutually_exclusives.indexOf(id), 1); }
            checkW: while (JSON.stringify(tree_data["focus_data"][focus].prerequisites).includes(id)) {
                console.log(tree_data["focus_data"][focus].prerequisites);
                let i1 = 0;
                for (let t of tree_data["focus_data"][focus].prerequisites) {
                    console.log(i1);
                    let i2 = 0;
                    for(let d in tree_data["focus_data"][focus].prerequisites[i1]) {
                        console.log(i2);
                        if (tree_data["focus_data"][focus].prerequisites[i1][i2] == id) {
                            focus_editor_change_prereq(focus, i1, i2, -1);
                            continue checkW;
                        }
                        i2 += 1;
                    }
                    i1 += 1;
                }
            }
        }
    }
    $(`#focus-${id}`).remove();
    focus_editor_deselect_focus();
    delete tree_data["focus_data"][id];
    focus_editor_update_all();
}

function focus_editor_change_cost() {
    tree_data["focus_data"][editing_focus_id].cost = parseFloat($("#focus_cost").val());
}

function focus_editor_change_available_if_capitulated() {
    tree_data["focus_data"][editing_focus_id].available_if_capitulated = $("#focus_available_if_capitulated").prop('checked');
}
function focus_editor_change_cancel_if_invalid() {
    tree_data["focus_data"][editing_focus_id].cancel_if_invalid = $("#focus_cancel_if_invalid").prop('checked');
}
function focus_editor_change_continue_if_invalid() {
    tree_data["focus_data"][editing_focus_id].continue_if_invalid = $("#focus_continue_if_invalid").prop('checked');
}
function focus_editor_change_cancelable() {
    tree_data["focus_data"][editing_focus_id].cancelable = $("#focus_cancelable").prop('checked');
}
function focus_editor_change_bypass_if_unavailable() {
    tree_data["focus_data"][editing_focus_id].bypass_if_unavailable = $("#focus_bypass_if_unavailable").prop('checked');
}

function focus_editor_change_relative(id, newRel) {
    if (newRel != -1) {
        tree_data["focus_data"][id].relative_x = tree_data["focus_data"][id].visible_x - tree_data["focus_data"][newRel].visible_x;
        tree_data["focus_data"][id].relative_y = tree_data["focus_data"][id].visible_y - tree_data["focus_data"][newRel].visible_y;
        if (tree_data["focus_data"][id].relative_position_id != -1) {
            tree_data["focus_data"][tree_data["focus_data"][id].relative_position_id].relative_position_successors.splice(tree_data["focus_data"][tree_data["focus_data"][id].relative_position_id].relative_position_successors.indexOf(id), 1);
        }
        tree_data["focus_data"][id].relative_position_id = newRel;
        tree_data["focus_data"][tree_data["focus_data"][id].relative_position_id].relative_position_successors.push(id);
        
        if (editing_focus_id == id) {
            $("#focus_x").val(tree_data["focus_data"][id].relative_x);
            $("#focus_y").val(tree_data["focus_data"][id].relative_y);
        }
    }
    else {
        tree_data["focus_data"][id].relative_x = tree_data["focus_data"][id].visible_x;
        tree_data["focus_data"][id].relative_y = tree_data["focus_data"][id].visible_y;
        if (editing_focus_id == id) {
            $("#focus_x").val(tree_data["focus_data"][id].visible_x);
            $("#focus_y").val(tree_data["focus_data"][id].visible_y);
        }
        tree_data["focus_data"][tree_data["focus_data"][id].relative_position_id].relative_position_successors.splice(tree_data["focus_data"][tree_data["focus_data"][id].relative_position_id].relative_position_successors.indexOf(id), 1);
        tree_data["focus_data"][id].relative_position_id = -1;
    }
}

function focus_editor_change_pos() {
    let newRelX = parseInt($("#focus_x").val());
    let changeX = newRelX - tree_data["focus_data"][editing_focus_id].relative_x;
    
    let newRelY = parseInt($("#focus_y").val());
    let changeY = newRelY - tree_data["focus_data"][editing_focus_id].relative_y;
    focus_editor_change_pos_n(editing_focus_id, changeX, changeY);
}

function focus_editor_change_pos_n(id, changeX, changeY) {
    tree_data["focus_data"][id].relative_x += changeX;
    tree_data["focus_data"][id].visible_x += changeX;
    
    tree_data["focus_data"][id].relative_y += changeY;
    tree_data["focus_data"][id].visible_y += changeY;

    if (id == editing_focus_id) {
        $("#focus_x").val(tree_data["focus_data"][id].relative_x);
        $("#focus_y").val(tree_data["focus_data"][id].relative_y);
    }
    
    focus_editor_update_pos(id);
    focus_editor_change_pos_recursive(id, changeX, changeY);
}

function focus_editor_change_pos_recursive(id, changeX, changeY) {
    for (let newId of tree_data["focus_data"][id].relative_position_successors) {
        tree_data["focus_data"][newId].visible_x += changeX;
        tree_data["focus_data"][newId].visible_y += changeY;
        focus_editor_update_pos(newId);
        focus_editor_change_pos_recursive(newId, changeX, changeY);
    }
}

function focus_editor_update_all() {
    for (let focus in tree_data["focus_data"]) {
        focus_editor_update_pos(focus);
        draw_focus_prerequisites(focus);
    }
}

function focus_editor_update_pos(id) {
    $(`#focus-${id}`).css('left', `${13+tree_data["focus_data"][id].visible_x*96}px`);
    $(`#focus-${id}`).css('top', `${tree_data["focus_data"][id].visible_y*130}px`);
    draw_focus_prerequisites(id);
}

function focus_editor_change_prereq_button(id, prereqId, subId) {
    focus_editor_change_prereq(id, prereqId, subId, $(`#focus_prereq-${prereqId}-${subId}`).val());
}

function focus_editor_change_prereq(id, prereqId, subId, val) {
    for (let newId of tree_data["focus_data"][id].prerequisites[prereqId]) {
        if (tree_data["focus_data"][newId].reverse_prerequisites.includes(id)) {
            tree_data["focus_data"][newId].reverse_prerequisites.splice(tree_data["focus_data"][newId].reverse_prerequisites.indexOf(id), 1);
        }
        if (tree_data["focus_data"][newId].reverse_or_prerequisites.includes(id)) {
            tree_data["focus_data"][newId].reverse_or_prerequisites.splice(tree_data["focus_data"][newId].reverse_or_prerequisites.indexOf(id), 1);
        }
    }
    if (subId == tree_data["focus_data"][id].prerequisites[prereqId].length) {
        if (val == "-1") {

        }
        else { 
            tree_data["focus_data"][id].prerequisites[prereqId].push(val);
        }
    }
    else {
        if (val == "-1") {
            tree_data["focus_data"][id].prerequisites[prereqId].splice(subId, 1);
        }
        else {
            tree_data["focus_data"][id].prerequisites[prereqId][subId] = val;
        }
    }
    if (tree_data["focus_data"][id].prerequisites[prereqId].length == 0) {
        tree_data["focus_data"][id].prerequisites.splice(prereqId, 1);
    }
    else if (tree_data["focus_data"][id].prerequisites[prereqId].length == 1) {
        for (let newId of tree_data["focus_data"][id].prerequisites[prereqId]) {
            tree_data["focus_data"][newId].reverse_prerequisites.push(id);
        }
    }
    else if (tree_data["focus_data"][id].prerequisites[prereqId].length == 2) {
        for (let newId of tree_data["focus_data"][id].prerequisites[prereqId]) {
            tree_data["focus_data"][newId].reverse_or_prerequisites.push(id);
        }
    }
    focus_editor_generate_prereqs(id);
}

function focus_editor_create_prereq(id) {
    tree_data["focus_data"][id].prerequisites.push([$("#focus_prereq-new").val()]);
    tree_data["focus_data"][$("#focus_prereq-new").val()].reverse_prerequisites.push([id]);
    focus_editor_generate_prereqs(id);
}

function focus_editor_generate_prereqs(id) {
    $("#focus_prerequisites").html("");
    let i1 = 0;
    for (let prereq of tree_data["focus_data"][id].prerequisites) {
        let i2 = 0;
        let text = "<div>";
        for (let newId of prereq) {
            let nGenericList = focus_editor_generate_list([id], newId);
            text += `<select id="focus_prereq-${i1}-${i2}" onchange="focus_editor_change_prereq_button('${id}', ${i1}, ${i2})"><option style="font-style: italic;" value="-1">None</option>${nGenericList}</select> or `;
            i2 += 1;
        }
        let nGenericList = focus_editor_generate_list([id], -1);
        text += `<select id="focus_prereq-${i1}-${i2}" onchange="focus_editor_change_prereq_button('${id}', ${i1}, ${i2})"><option style="font-style: italic;" value="-1" selected>Select Focus</option>${nGenericList}</select></div><hr>`;
        $("#focus_prerequisites").append(text);
        i1 += 1;
    }
    $("#focus_prerequisites").append(`<select id="focus_prereq-new" onchange="focus_editor_create_prereq('${id}')"><option selected style="font-style: italic;" value="-1">Select Focus</option>${focus_editor_generate_list([id])}</select>`);

    draw_focus_prerequisites(id);
}

function focus_editor_generate_mutuals() {
    $("#focus_mutually_exclusives").html("");
    let i = 0;
    for (let mutual of tree_data["focus_data"][editing_focus_id].mutually_exclusives) {
        genericList = focus_editor_generate_list([editing_focus_id], mutual);
        $("#focus_mutually_exclusives").append(`<select id="focus_mutual-${i}" onchange="focus_editor_change_mutual(${i})"><option style="font-style: italic;" value="-1">None</option>${genericList}</select><br>`);
        i += 1;
    }
    genericList = focus_editor_generate_list([editing_focus_id]);
    $("#focus_mutually_exclusives").append(`<select id="focus_mutual-new" onchange="focus_editor_create_mutual()"><option style="font-style: italic;" value="-1" selected>Select Focus</option>${genericList}</select><br>`);

    draw_focus_prerequisites(editing_focus_id);
}

function focus_editor_create_mutual() {
    tree_data["focus_data"][editing_focus_id].mutually_exclusives.push($("#focus_mutual-new").val());
    tree_data["focus_data"][$("#focus_mutual-new").val()].mutually_exclusives.push(editing_focus_id);
    focus_editor_generate_mutuals();
}

function focus_editor_change_mutual(i) {
    let newMut = $(`#focus_mutual-${i}`).val();
    let oldMut = tree_data["focus_data"][editing_focus_id].mutually_exclusives[i];
    if (newMut == "-1") {
        tree_data["focus_data"][oldMut].mutually_exclusives.splice(tree_data["focus_data"][oldMut].mutually_exclusives.indexOf(editing_focus_id), 1);
        tree_data["focus_data"][editing_focus_id].mutually_exclusives.splice(tree_data["focus_data"][editing_focus_id].mutually_exclusives.indexOf(oldMut), 1);
    }
    else {
        tree_data["focus_data"][oldMut].mutually_exclusives.splice(tree_data["focus_data"][oldMut].mutually_exclusives.indexOf(editing_focus_id), 1);
        tree_data["focus_data"][editing_focus_id].mutually_exclusives[i] = newMut;
        tree_data["focus_data"][newMut].mutually_exclusives.push(editing_focus_id);
    }
    focus_editor_generate_mutuals();
}

function focus_editor_generate_list(ids, match="-3") {
    let genericList = "";
    for (let newId in tree_data["focus_data"]) {
        if (!ids.includes(newId)) {
            if (match == newId) {
                genericList += `<option selected value="${newId}">${tree_data["focus_data"][newId].name}</option>`;
            }
            else {
                genericList += `<option value="${newId}">${tree_data["focus_data"][newId].name}</option>`;
            }
        }
    }
    return genericList;
}

function focus_editor_icon_click(gfx) {
    tree_data["focus_data"][editing_focus_id].icon = gfx;
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
    this.name = `New Focus ${internalID}`;
    this.id = `${tree_data["tag"]}_new_focus_${internalID}`;
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
    this.cost = 5;
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
    let x1 = tree_data["focus_data"][focus1].visible_x;
    let y1 = tree_data["focus_data"][focus1].visible_y;
    let x2 = tree_data["focus_data"][focus2].visible_x;
    let y2 = tree_data["focus_data"][focus2].visible_y;
    if (x1 == x2) {
        create_vertical_line(
            `prerequisite-straight-${focus1}-${focus2}`,
            `line-focus-${focus1} line-focus-${focus2} prerequisite prerequisite-${focus1}-${focus2} ${classes}`,
            x1,
            y1,
            y2-y1
        );
    }
    else if (tree_data["focus_data"][focus1].visible_x > tree_data["focus_data"][focus2].visible_x) {
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
    for (let prereq of tree_data["focus_data"][focus].prerequisites) {
        if (prereq.length == 1) {
            draw_prerequisite_line(prereq[0], focus, "");
        }
        else {
            for (let prereq2 of prereq) {
                draw_prerequisite_line(prereq2, focus, "prerequisite-or");
            }
        }
    }
    for (let lead of tree_data["focus_data"][focus].reverse_prerequisites) {
        draw_prerequisite_line(focus, lead, "");
    }
    for (let lead of tree_data["focus_data"][focus].reverse_or_prerequisites) {
        draw_prerequisite_line(focus, lead, "prerequisite-or");
    }

    for(let mutual of tree_data["focus_data"][focus].mutually_exclusives) {
        if (tree_data["focus_data"][mutual].visible_x > tree_data["focus_data"][focus].visible_x) {
            create_horizontal_line(`mutually-exclusive-${focus}-${mutual}`, `line-focus-${focus} line-focus-${mutual} prerequisite mutually-exclusive-${focus}-${mutual} mutually-exclusive`, tree_data["focus_data"][focus].visible_x, tree_data["focus_data"][focus].visible_y, tree_data["focus_data"][mutual].visible_x-tree_data["focus_data"][focus].visible_x);
        }
        else {
            create_horizontal_line(`mutually-exclusive-${focus}-${mutual}`, `line-focus-${focus} line-focus-${mutual} prerequisite mutually-exclusive-${focus}-${mutual} mutually-exclusive`, tree_data["focus_data"][mutual].visible_x, tree_data["focus_data"][focus].visible_y, tree_data["focus_data"][focus].visible_x-tree_data["focus_data"][mutual].visible_x);
        }
    }
}

function delete_focus(focus) {
    for (let focus2 in tree_data["focus_data"]) {
        if (tree_data["focus_data"][focus2].reverse_prerequisites.includes(focus)) {
            tree_data["focus_data"][focus2].reverse_prerequisites.pop(focus);
        }
        if (tree_data["focus_data"][focus2].reverse_or_prerequisites.includes(focus)) {
            tree_data["focus_data"][focus2].reverse_or_prerequisites.pop(focus);
        }
        for (let int in tree_data["focus_data"][focus2].prerequisites) {
            while (tree_data["focus_data"][focus2].prerequisites[int].includes(focus)) {
                focus_edit_del_prereq_focus(int, tree_data["focus_data"][focus2].prerequisites[int].indexOf(focus), focus2);
            }
        }
    }
    $(`#focus-${focus}`).remove();
    $(`.line-focus-${focus}`).remove();
    delete tree_data["focus_data"][focus];
}
function focus_click(e, id) {
    if (e.shiftKey) {
    }
    else {
        if (editing_focus_id == id) {
            focus_editor_deselect_focus();
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
    localStorage.setItem("tree_data", JSON.stringify(tree_data));
}
function focus_editor_load_focuses(t_focuses, t_keys, t_id) {
    focus_editor_clear_focuses();
    tree_data = JSON.parse(localStorage.getItem("tree_data"));

    for (let focus in tree_data["focus_data"]) {
        focus_editor_create_focus_element(focus);
    }

    focus_editor_update_all();
    focus_editor_generate_filters();
    focus_editor_select_focus(Object.keys(tree_data["focus_data"])[Object.keys(tree_data["focus_data"]).length - 1]);
}
function yes_no(inp) {
    if (inp) {
        return "yes";
    }
    return "no";
}
function focus_editor_generate_tree() {
    let out = `focus_tree = {
    # Generated by the tombricks focus tree generator :)
    id = ${tree_data["tag"]}_focus_tree
    
    country = {
        factor = 0
        modifier = {
            add = 10
            tag = ${tree_data["tag"]}
        }
    }

    default = no
    continuous_focus_position = { x = 55 y = 1500 }`;
    for(let focus in tree_data["focus_data"]) {
        let sFocus = tree_data["focus_data"][focus];

        let _rel = ``;
        if (sFocus.relative_position_id != -1)
            _rel = `\n        relative_position_id = ${tree_data.focus_data[sFocus.relative_position_id].id}`;

        let _muts = ``;
        if (sFocus.mutually_exclusives.length > 0) {
            _muts = `mutually_exclusive = { `;
            for (let focus2 of tree_data.focus_data[focus].mutually_exclusives) {
                _muts += `focus = ${tree_data.focus_data[focus2].id} `;
            }
            _muts += `}`;
        }

        let _preqs = ``;
        for(let prereq of tree_data.focus_data[focus].prerequisites) {
            _preqs += `        prerequisite = { `;
            for (let prereq2 of prereq) {
                _preqs += `focus = ${tree_data.focus_data[prereq2].id} `;
            }
            _preqs += `}\n`
        }

        let _blocks = ``;
        for (let block in focus_monaco) {
            if (sFocus.blocks[block] != "")
                _blocks += `
        
        ${block} = {
            ${sFocus.blocks[block].replaceAll("\n", "\n            ")}
        }`
        }

        out += `

    focus = {
        id = ${sFocus.id}
        icon = ${sFocus.icon}
        x = ${sFocus.relative_x}
        y = ${sFocus.relative_y}${_rel}
        cost = ${sFocus.cost}
        available_if_capitulated = ${yes_no(sFocus.available_if_capitulated)}
        cancel_if_invalid = ${yes_no(sFocus.cancel_if_invalid)}
        continue_if_invalid = ${yes_no(sFocus.continue_if_invalid)}
        cancelable = ${yes_no(sFocus.cancelable)}
        bypass_if_unavailable = ${yes_no(sFocus.bypass_if_unavailable)}
        ${_muts}
${_preqs}${_blocks}
    }`;
    }
    out += `\n}`;
    return out;
}
function focus_editor_download_files() {
    let link = document.createElement("a");
    let content = focus_editor_generate_tree();
    const file = new Blob([content], {type: 'text/plain'});
    link.href = URL.createObjectURL(file);
    link.download = `${tree_data.tag}_focus_tree.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
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
        focus_monaco["completion_reward"].getModel().onDidChangeContent((event) => { tree_data["focus_data"][editing_focus_id].blocks["completion_reward"] = focus_monaco["completion_reward"].getValue();    });
        focus_monaco["available"].getModel().onDidChangeContent((event) => { tree_data["focus_data"][editing_focus_id].blocks["available"] = focus_monaco["available"].getValue();    });
        focus_monaco["bypass"].getModel().onDidChangeContent((event) => { tree_data["focus_data"][editing_focus_id].blocks["bypass"] = focus_monaco["bypass"].getValue();    });
        focus_monaco["allow_branch"].getModel().onDidChangeContent((event) => { tree_data["focus_data"][editing_focus_id].blocks["allow_branch"] = focus_monaco["allow_branch"].getValue();    });
        focus_monaco["cancel"].getModel().onDidChangeContent((event) => { tree_data["focus_data"][editing_focus_id].blocks["cancel"] = focus_monaco["cancel"].getValue();    });
        focus_monaco["historical_ai"].getModel().onDidChangeContent((event) => { tree_data["focus_data"][editing_focus_id].blocks["historical_ai"] = focus_monaco["historical_ai"].getValue();    });
        focus_monaco["ai_will_do"].getModel().onDidChangeContent((event) => { tree_data["focus_data"][editing_focus_id].blocks["ai_will_do"] = focus_monaco["ai_will_do"].getValue();    });
        focus_monaco["select_effect"].getModel().onDidChangeContent((event) => { tree_data["focus_data"][editing_focus_id].blocks["select_effect"] = focus_monaco["select_effect"].getValue();    });
        focus_monaco["complete_tooltip"].getModel().onDidChangeContent((event) => { tree_data["focus_data"][editing_focus_id].blocks["complete_tooltip"] = focus_monaco["complete_tooltip"].getValue();    });
        monaco_init = true;

        $("#loading").remove();
    
        focus_editor_create_new_tree();
    });
    /* #endregion */
});
document.onkeydown = function(e) {
    if (editing_focus_id != "-1" && !$("input").is(":focus")) {
        switch(e.which) {
            case 37: // left
            if (tree_data["focus_data"][editing_focus_id].visible_x > 0) {
                $("#focus_x").val( parseInt($("#focus_x").val()) -1 );
            focus_editor_change_pos();
            }
            break;

            case 38: // up
            if (tree_data["focus_data"][editing_focus_id].visible_y > 0) {
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

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    }
};