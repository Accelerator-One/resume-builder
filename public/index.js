// State object
let state = {
    edit: true,
    viewer: null,
    editor: null,
    qualifications: [],
    projects: []
}

// Helper functions
function refreshProjectList() {

    // for editor screen
    let projRef = document.getElementById('projList');
    projRef.innerHTML = "";
    let index = 0;
    state.projects.forEach((data) => {
        projRef.innerHTML += `<div class="card" style="padding:12px; margin: 12px;">
            <div class='row'>
            <div class='col-sm-10'>
                <h6>${data.title}</h6>
                <small>${data.skills}</small><br/>
                <p>${data.description}</p>
            </div>
            <div class='col-sm-2'>
                <button type="button" class="btn-close" aria-label="Close" onclick="removeProj(${index})"></button>
            </div>
        </div>`;
        index++;
    });

    // for viewer screen
    projRef = document.getElementById('projView');
    projRef.innerHTML = "";
    index = 0;
    state.projects.forEach((data) => {
        projRef.innerHTML += `<div class="card" style="padding:12px; margin: 12px;">
            <div class='row'>
            <div class='col-sm-10'>
                <h6>${data.title}</h6>
                <small>${data.skills}</small><br/>
                <p>${data.description}</p>
            </div>
            <div class='col-sm-2'>
                <button type="button" class="btn-close" aria-label="Close" onclick="removeProj(${index})"></button>
            </div>
        </div>`;
        index++;
    });

}

function refreshQualList() {

    // for editor screen
    let projRef = document.getElementById('qualList');
    projRef.innerHTML = "";
    let index = 0;
    state.qualifications.forEach(data => {
        projRef.innerHTML += `<div class="card" style="padding:12px; margin: 12px;">
            <div class='row'>
            <div class='col-sm-10'>
                <h6>${data.university}</h6>
                ${data.course}  <small>(${data.cstart}-${data.cend})</small>
            </div>
            <div class='col-sm-2'>
                <button type="button" class="btn-close" aria-label="Close" onclick="removeQual(${index})"></button>
            </div>
        </div>`;
        index++;
    });

    // for viewer screen
    projRef = document.getElementById('qualView');
    projRef.innerHTML = "";
    index = 0;
    state.qualifications.forEach(data => {
        projRef.innerHTML += `<div class="card" style="padding:12px; margin: 12px;">
            <div class='row'>
            <div class='col-sm-10'>
                <h6>${data.university}</h6>
                ${data.course}  <small>(${data.cstart}-${data.cend})</small>
            </div>
            <div class='col-sm-2'>
                <button type="button" class="btn-close" aria-label="Close" onclick="removeQual(${index})"></button>
            </div>
        </div>`;
        index++;
    });

}

// Initiate application
document.addEventListener('DOMContentLoaded', () => {

    // find screen references
    state.viewer = document.getElementById('viewer');
    state.editor = document.getElementById('editor');

    // update viewer panel
    function updateScreen() {
        document.getElementById('nameView').innerHTML = document.getElementById('name').value;
        document.getElementById('emailView').innerHTML = document.getElementById('email').value;
        document.getElementById('phoneView').innerHTML = document.getElementById('phone').value;
    }

    // toggle listener (swap screens if valid)
    const controlRef = document.getElementById('swap');
    controlRef.addEventListener('click', (evt) => {

        evt.preventDefault();
        if (!(validateName() && validateEmail() && validatePhone())) {
            return;
        }

        // if(state.qualifications.length == 0) {
        //     alert("Add atleast one qualification!");
        //     return;
        // }

        // if(state.projects.length == 0) {
        //     alert("Add atleast one project!");
        //     return;
        // }

        updateScreen();

        if (state.edit) {
            state.viewer.classList.remove('hide');
            state.editor.classList.add('hide');
            controlRef.innerText = 'Edit';
        } else {
            state.viewer.classList.add('hide');
            state.editor.classList.remove('hide');
            controlRef.innerText = 'Submit';
        }

        state.edit = !state.edit;

    });

    // add project entry
    document.getElementById('addProject').addEventListener('click', (evt) => {

        evt.preventDefault();

        if (!(validateTitle() && validateDescription() && validateSkills()))
            return;

        // append to global state
        state.projects.push({
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            skills: document.getElementById('skills').value
        });

        // console.log(state.projects);
        refreshProjectList();

        // clear appended entry
        setTimeout(() => {

            document.getElementById('title').classList.remove('is-valid');
            document.getElementById('title').value = "";
            document.getElementById('description').classList.remove('is-valid');
            document.getElementById('description').value = "";
            document.getElementById('skills').classList.remove('is-valid');
            document.getElementById('skills').value = "";

        }, 2400);

    });

    // add qualification entry
    document.getElementById('addQual').addEventListener('click', (evt) => {

        evt.preventDefault();

        if (!(validateCourse() && validateUniversity() && validateStart() && validateEnd()))
            return;

        // append to global state
        state.qualifications.push({
            course: document.getElementById('course').value,
            university: document.getElementById('university').value,
            cstart: document.getElementById('cstart').value,
            cend: document.getElementById('cend').value
        });

        // console.log(state.qualifications);
        refreshQualList();

        // clear appended entry
        setTimeout(() => {

            document.getElementById('course').classList.remove('is-valid');
            document.getElementById('course').value = "";
            document.getElementById('university').classList.remove('is-valid');
            document.getElementById('university').value = "";
            document.getElementById('cstart').classList.remove('is-valid');
            document.getElementById('cstart').value = "";
            document.getElementById('cend').classList.remove('is-valid');
            document.getElementById('cend').value = "";

        }, 2400);

    });

});

// Validation helper functions
function validateName() {
    
    const ref = document.getElementById('name');
    if (ref.value.length == 0) {
        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

function validateEmail() {

    const ref = document.getElementById('email');
    if (ref.value.length == 0 ||
        ref.value.search(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/g) === -1) {

        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

function validatePhone() {
    
    const ref = document.getElementById('phone');
    if (!(ref.value.length == 10 && parseInt(ref.value) >= 0 && parseInt(ref.value) <= 9999999999)) {
        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

function validateCourse() {
    
    const ref = document.getElementById('course');
    if (ref.value.length == 0) {
        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

function validateUniversity() {
    
    const ref = document.getElementById('university');
    if (ref.value.length == 0) {
        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

function validateStart() {
    
    const ref = document.getElementById('cstart');
    if (!(parseInt(ref.value) >= 1980 && parseInt(ref.value) <= 2021)) {
        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

function validateEnd() {
    
    const ref = document.getElementById('cend');
    if (!(parseInt(ref.value) >= 1980 && parseInt(ref.value) <= 2025)) {
        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

function validateTitle() {
    
    const ref = document.getElementById('title');
    if (ref.value.length == 0) {
        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

function validateDescription() {
    
    const ref = document.getElementById('description');
    if (ref.value.length == 0) {
        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

function validateSkills() {
    
    const ref = document.getElementById('skills');
    if (ref.value.length == 0) {
        ref.classList.remove('is-valid');
        ref.classList.add('is-invalid');
        return false;
    }

    ref.classList.remove('is-invalid');
    ref.classList.add('is-valid');
    return true;
}

// Entry removal helpers
function removeQual(id) {
    state.qualifications.splice(id, 1);
    refreshQualList();
}

function removeProj(id) {
    state.projects.splice(id, 1);
    refreshProjectList();
}
