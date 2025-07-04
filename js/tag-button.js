
export function makeMasterButtons(existingTags, existingTypes, dataTable) {
    $.get( "assets/tagcolors.csv", function(CSVdata) {
        // CSVdata is populated with the file contents, then turn into objects
        var data = $.csv.toObjects(CSVdata)[0];
        makeButtonList(existingTags, data, "tag");
        attachTagButtonListeners(dataTable,"tag");
        makeButtonList(existingTypes, {}, "type");
        attachTagButtonListeners(dataTable,"type");
        getURLParams();
    })
}

function getURLParams(){
    // check for URL parameter from quick start
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');
    const type = urlParams.get('type');

    if(tag!=null){
        console.log("detected tag - "+tag);
        clickFilterButton(decodeURIComponent(tag), "tag");
    } 
    if (type!=null) {
        console.log("detected type - "+type);
        clickFilterButton(decodeURIComponent(type), "type");
    }
}

// Function works for both types and tags
// tagOrType is a string - either "tag" or "type"
function makeButtonList(existingTags, tagColors, tagOrType) {
    let masterTagInfo = [];
    let previewTagInfo = [];

    existingTags.forEach(tagStr => {
        // set up info for master button
        let masterTag = {
            text: tagStr,
            name:tagStr, 
            id:tagStr+"MasterButton",
            color: "background-color: "+tagColors[tagStr]
        };
        masterTagInfo.push(masterTag);

        // change id to contain preview button for preview tags
        let previewTag = {
            text: tagStr,
            name:tagStr, 
            id:tagStr+"PreviewButton"
        };
        previewTagInfo.push(previewTag);
    });


    var masterTagOptions = {
        valueNames: [
            "text",
            {name:"name", attr:"name"},
            {name:"id", attr:"id"},
            {name:"color", attr:"style"}
        ],
        item: "<span><button class='"+tagOrType+"button togglebutton id name color'><img src='./assets/x.png' class='buttonCloseIcon'></img><p class='text'></p></button></span>"
    };

    var previewTagOptions = {
        valueNames: [
            "text",
            {name:"name", attr:"name"},
            {name:"id", attr:"id"}
        ],
        item: "<span><button class='"+tagOrType+"button togglebutton previewbutton id name'><img src='./assets/x.png' class='buttonCloseIcon'></img><p class='text'></p></button></span>"
    };

    var tagTable = new List("master"+tagOrType+"buttons",masterTagOptions,masterTagInfo);
    var tagPreview = new List("current"+tagOrType+"buttons",previewTagOptions,previewTagInfo);
    tagTable.sort("text");
    tagPreview.sort("text");
}


export function makeTagButtons(tags, buttontype, existingTags){
    var htmlstring = "";

    tags.split(', ').forEach(tag => {
        if(tag!=""){
            htmlstring+="<button class='"+buttontype+"button' name='"+tag+"'>"+tag+"</button>";
            if(!existingTags.includes(tag)) {
                existingTags.push(tag);
            }
        }
    });
    
    //console.log(htmlstring);
    return [htmlstring, existingTags];
} 


var currentFilters = [];

function applyCurrentFilters(dataTable) {
    dataTable.filter(function(item){
        for(let i=0; i<currentFilters.length;i++){
            if(!item.values()["Tags"].includes(currentFilters[i]) && !item.values()["Type"].includes(currentFilters[i])){
                return false;
            }
        }
        return true;
    })
}

function clearAllFilterButtons(){
    turnOffButtons("master","tag");
    turnOffButtons("master","type");
    turnOffButtons("current","tag");
    turnOffButtons("current","type");
}

function turnOffButtons(masterOrPreview,tagOrType) {
    const buttonContainer = document.getElementById(masterOrPreview+tagOrType+"buttons").children[0];
    const buttons = Array.from(buttonContainer.children);
    buttons.forEach(buttonSpan => {
        let button = buttonSpan.children[0];
        if(button.classList.contains("clicked")){
            button.classList.remove("clicked");
        }
    })
}


export function attachTagButtonListeners(dataTable, tagOrType) {

    // --- add listeners to master buttons ---
    const buttonContainer = document.getElementById("master"+tagOrType+"buttons").children[0];
    const buttons = Array.from(buttonContainer.children);
    buttons.forEach(buttonSpan => {
        let button = buttonSpan.children[0];
        button.addEventListener('click', function() {
            button.classList.toggle("clicked");
            let tagName = button.name;
            if(button.classList.contains("clicked")){
                document.getElementById(tagName+"PreviewButton").classList.add("clicked");
                // add this filter to current filters
                currentFilters.push(tagName);
                applyCurrentFilters(dataTable);
            } else {
                document.getElementById(tagName+"PreviewButton").classList.remove("clicked");
                // remove this filter from the list
                currentFilters = currentFilters.filter(oldTag => oldTag!=tagName);
                applyCurrentFilters(dataTable);
            }
        })
    })
    
    // --- connect all buttons to the master filter button ---
    const allbuttons = document.querySelectorAll("."+tagOrType+"button")
    allbuttons.forEach(button => {
        // NOT master buttons
        if(!button.id.includes("MasterButton")){ 
            // find the corresponding master filter button
            const tagName = button.name;
            const masterButton = document.getElementById(tagName+"MasterButton");
            button.style["background-color"] = masterButton.style["background-color"];
            // Add an event listener that clicks its master button
            button.addEventListener('click', function() {
                masterButton.click();
            })
        } 
        // button.addEventListener("mouseover")
    });

    // --- connect clear filters button ---
    const clearFiltersButton = document.getElementById("clearFiltersButton");
    clearFiltersButton.addEventListener('click', function() {
        currentFilters = [];
        applyCurrentFilters(dataTable);
        clearAllFilterButtons();
    })
}

export function clickFilterButton(filterName, tagOrType){
    const buttonContainer = document.getElementById("master"+tagOrType+"buttons").children[0];
    const buttons = Array.from(buttonContainer.children);
    console.log(buttons)
    buttons.forEach(buttonSpan => {
        let button = buttonSpan.children[0];
        if(button.id.includes(filterName)){
            button.click();
        }
    });
}
