
// ----- parses csv into html for resources database ------

$.get( "assets/database.csv", function(CSVdata) {
    // CSVdata is populated with the file contents, then turn into objects
    var data = $.csv.toObjects(CSVdata);
    var existingTypes = [];
    var existingTags = [];
    
    // manipulate CSV data obj for correct rendering
    data.forEach(entry => {

        // split type and tags string into buttons
        var [buttonString, typesFound] = makeTagButtons(entry["Type"],"typebutton",existingTypes);
        entry["Type"] = buttonString; 
        existingTypes = typesFound; 

        if(entry["Tags"]!=""){ // only make tags if any are present
            var [buttonString, tagsFound] = makeTagButtons(entry["Tags"],"tagbutton",existingTags);
            entry["Tags"] = buttonString; // replace names with html buttons
            existingTags = tagsFound; // record what tags were present
        }

        // create ID for note sections
        entry["noteID"] = entry['ID']+"note";

        // add dropdown button if there are any notes
        if(entry["Notes/Context"]!=""){
            entry["Dropdown-Visibility"] = "<input type='image' class='noteDropDownButton' src='/assets/leftarrow.png' alt='Close dropdown arrow.'>";
        } else {
            entry["Dropdown-Visibility"] = "";
            // if there are also no tags, hide the bar
            if(entry["Tags"]=="") {
                entry["tagbar"] = "display:none;"
            }
        }

    });

    // --- make master tag buttons ---
    existingTags.forEach(tag => {
        const tagButtonDiv = document.getElementById("mastertagbuttons");
        const tagButton = "<input type='checkbox' class='tagbutton' id='"+tag+"MasterButton' name='"+tag+"'>"+tag+"</input>";
        tagButtonDiv.innerHTML+=tagButton;
    })
    existingTypes.forEach(type => {
        const typeButtonDiv = document.getElementById("mastertypebuttons");
        const typeButton = "<input type='checkbox' class='typebutton' id='"+type+"MasterButton' name='"+type+"'>"+type+"</input>";
        typeButtonDiv.innerHTML+=typeButton;
    })

    

    // --- make the resources list (dataTable) ---
    var options = {
        valueNames: ["Title","Type","Tags","Notes/Context", "Dropdown-Visibility",
            {data: ["Priority","ID"]},
            {name:"noteID", attr:"id"},
            {name:"URL", attr:"href"},
            {name:"tagbar", attr:"style"}
        ],
        item: "template-item"
    }

    var dataTable = new List('table',options,data);
    // sort by priority by default
    dataTable.sort('Priority', {order:"asc"});


    $('#search-field').on('keyup', function() {
        var searchString = $(this).val();
        dataTable.fuzzySearch(searchString);
    });

    attachDropdownButtonListeners();
    attachFilterWindowListeners();
    attachTagButtonListeners(dataTable,"tag");
    attachTagButtonListeners(dataTable,"type");
});




function createDiv(classname) {
    let div = document.createElement("div");
    div.className = classname;
    return div;
}

function makeTagButtons(tags, buttontype, existingTags){
    var htmlstring = "";

    tags.split(', ').forEach(tag => {
        if(tag!=""){
            htmlstring+="<button class='"+buttontype+"'>"+tag+"</button>";
            if(!existingTags.includes(tag)) {
                existingTags.push(tag);
            }
        }
    });
    
    //console.log(htmlstring);
    return [htmlstring, existingTags];
} 



function attachDropdownButtonListeners() {    
    const dropdownbtns = document.querySelectorAll(".noteDropDownButton")
    // for each button...
    dropdownbtns.forEach(button => {
        // ...add an event listener that shows its target (found by id)
        button.addEventListener('click', function() {
            // go up to the row div to find ID for this entry
            const targetId = this.parentElement.parentElement.parentElement.dataset.id; 
            // get the note with that ID
            const dropdownContent = document.getElementById(targetId+"note");

            // if found, show the notes section
            if (dropdownContent) {
                dropdownContent.classList.toggle('show');
                if (this.src.includes("leftarrow")){ // displaying
                    this.src = "/assets/downarrow.png";
                    this.alt = "Close dropdown arrow."
                    this.parentElement.parentElement.style["border-radius"] = "15px 15px 0 0";
                }
                else if(this.src.includes("downarrow")) { // hiding
                    this.src = "/assets/leftarrow.png";
                    this.alt = "Dropdown arrow."
                    this.parentElement.parentElement.style["border-radius"] = "15px";
                }
            }
        })
    });
}



function attachFilterWindowListeners() {
    // ------ show button -----
    const showButton = document.getElementById("openFilterWindowButton");
    // show the show button on load
    showButton.classList.add("show");

    showButton.addEventListener('click', function() {
        const filterWindow = document.getElementById("filterWindow");
        filterWindow.classList.add("show");

        const table = document.getElementById("table") // database display
        table.classList.add("small");

        this.classList.remove("show");
    });

    // ------ hide button ------
    const hideButton = document.getElementById("closeFilterWindowArrow");
    hideButton.addEventListener('click', function(){
        const filterWindow = document.getElementById("filterWindow");
        filterWindow.classList.remove("show");

        const table = document.getElementById("table")
        table.classList.remove("small");

        const showButton = document.getElementById("openFilterWindowButton");
        showButton.classList.add("show");
    })
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


function attachTagButtonListeners(dataTable, tagOrType) {

    // --- add listeners to master buttons ---
    const buttonDiv = document.getElementById("master"+tagOrType+"buttons");
    const buttons = Array.from(buttonDiv.children);
    buttons.forEach(button => {
        button.addEventListener('change', function() {
            let tagName = button.name;
            if(button.checked){
                // add this filter to current filters
                currentFilters.push(tagName);
                applyCurrentFilters(dataTable);
            } else {
                // remove this filter from the list
                currentFilters = currentFilters.filter(oldTag => oldTag!=tagName);
                applyCurrentFilters(dataTable);
            }
        })
    })
    
    // --- connect all buttons to the master filter button ---
    const allbuttons = document.querySelectorAll("."+tagOrType+"button")
    // for each filter button...
    allbuttons.forEach(button => {
        // ..other than master buttons...
        if(!button.id.includes("MasterButton")){ 
            // ...add an event listener that clicks its master button
            button.addEventListener('click', function() {
                // find the corresponding master filter button
                const tagName = this.innerHTML;
                const filterButton = document.getElementById(tagName+"MasterButton");
                filterButton.click();
            })
        }
    });
    
}