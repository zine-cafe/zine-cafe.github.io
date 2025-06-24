// parse csv into objects
$.get( "assets/database.csv", function(CSVdata) {
    // CSVdata is populated with the file contents, then turn into objects
    var data = $.csv.toObjects(CSVdata)
    console.log(data);

    // Create rows in table for those objects, and cells for each bit of data
    var table = document.getElementById("table");

    data.forEach(obj => {
        // ---------- Row div containing one entire listing ----------
        const row = createDiv("row");
        row.id = obj["ID"];

        // ----- UPPER SECTION - title and type
        const titleSection = createDiv("titleSection");
        row.appendChild(titleSection);

        // separate into title div and type div
        const title = createDiv("title");
        const type = createDiv("type");

        // add title link and type button(s)
        title.className = "title"
        title.innerHTML = "<a href='"+obj["URL"]+"'>"+obj["Title"]+"</a>";
        type.className = "type"
        parseTags(obj["Type"]).forEach(tag => {
        type.innerHTML+="<button class='typebutton'>"+tag+"</button>";
        });

        // add to title section
        titleSection.appendChild(type);
        titleSection.appendChild(title);

        
        // ----- MIDDLE SECTION - tag bar

        const tagBar = createDiv("tagbar");

        const taglist = createDiv("taglist");

        // for each tag, make a button
        const splitTags = parseTags(obj["Tags"]);
        if (splitTags != ""){
        splitTags.forEach(tag => {
            taglist.innerHTML+="<button class='tagbutton'>"+tag+"</button>";
        });
        }

        tagBar.appendChild(taglist);
        
        // add dropdown arrow if there are notes
        if(obj["Notes/Context"]!="")
        {
            const dropdownDiv = createDiv("dropdowndiv");
            const dropdownArrow = document.createElement("input");
            dropdownArrow.type = "image";
            dropdownArrow.classList.add("noteDropDownButton");
            dropdownArrow.src = "/assets/leftarrow.png";
            dropdownArrow.alt = "Dropdown arrow."
            dropdownArrow.dataset.target = obj["ID"]+"dropdownContent"
            dropdownDiv.appendChild(dropdownArrow);
            
            // add dropdown div to the tags section
            tagBar.appendChild(dropdownDiv);
        }
        
        // add tags section to row
        row.appendChild(tagBar);

        // ----- LOWER SECTION - notes
        const notesection = createDiv("notesection");
        notesection.innerHTML = "<p>"+obj["Notes/Context"]+"</p>";
        notesection.id = obj["ID"]+"dropdownContent";
        row.appendChild(notesection);


        // add row to the table
        table.appendChild(row);
    });

    attachButtonListeners();
});


function createDiv(classname) {
    let div = document.createElement("div");
    div.className = classname;
    return div;
}

function parseTags(tags){
    return tags.split(', ');
} 

function attachButtonListeners() {
const dropdownbtns = document.querySelectorAll(".noteDropDownButton")
// for each button...
dropdownbtns.forEach(button => {
    // ...add an event listener that shows its target (found by id)
    button.addEventListener('click', function() {
    const targetId = this.dataset.target;
    const dropdownContent = document.getElementById(targetId);

    // if found, show the notes section
    if (dropdownContent) {
        dropdownContent.classList.toggle('show');
        if (this.src.includes("leftarrow")){ // displaying
            this.src = "/assets/downarrow.png";
            this.parentElement.parentElement.style["border-radius"] = "15px 15px 0 0";
        }
        else if(this.src.includes("downarrow")) { // hiding
            this.src = "/assets/leftarrow.png";
            this.parentElement.parentElement.style["border-radius"] = "15px";
        }
    }
    })
});
}