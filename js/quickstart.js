
document.addEventListener('DOMContentLoaded', function() {
    const startSection = document.getElementById('start');
    const teacherSection = document.getElementById('teacher');
    const organizerSection = document.getElementById('organizer');
    const socialJusticeSection = document.getElementById('socialjustice');
    const sections = [startSection,teacherSection,organizerSection,socialJusticeSection];
    let currentSection = startSection;

    showSection(startSection);
    addButtonListeners();

    function showSection(sectionToShow) {
        sections.forEach(section => {
            if(section==sectionToShow){
                section.classList.add("show");
                currentSection = section;
            } else {
                section.classList.remove("show");
            }
        });
    }

    function addButtonListeners() {
        const newSectionButtons = document.querySelectorAll(".qsButton.toSection");
        newSectionButtons.forEach(button => {
            button.addEventListener("click", function(event){
                event.preventDefault();
                const nextSectionID = this.dataset.next;
                const nextSection = document.getElementById(nextSectionID);
                showSection(nextSection);
            })
        })
        
        const goBackButtons = document.querySelectorAll(".goBackButton");
        console.log(goBackButtons)
        goBackButtons.forEach(button => {
            button.addEventListener("click", function(){
                goBack();
            })
        })
    }

    function goBack() {
        if (currentSection==teacherSection || currentSection==organizerSection){
            showSection(startSection);
        } else if (currentSection==socialJusticeSection) {
            showSection(organizerSection);
        } else {
            showSection(startSection);
        }
    }
});