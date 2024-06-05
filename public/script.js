const usersDiv = document.getElementById('users')
const usersTable = document.getElementById('usersTable')

const registerForm = document.getElementById('registerForm');

const solcellerDiv = document.getElementById('solcellerDiv')

const testDiv = document.getElementById('testDiv')

const ownSolcellerTable = document.getElementById('ownSolcellerTable')



async function main() {
    console.log("main")
    await fetchData()
}

async function fetchData() {
    console.log ("fetchData")

    await fetchUsers()
    await fetchCurrentUser()
    await fetchRoles()
    await fetchTypes()
    await fetchOwnSolceller()
    await fetchShowSolceller()
}

document.addEventListener('DOMContentLoaded', main)


async function fetchUsers() {
    try {
        console.log("fetchUsers")
        const response = await fetch('/users')
        const response2 = await fetch('/roles')

        users = await response.json()
        roles = await response2.json()
        console.log("users" + users)
        //populateUsers(users)
        populateUsersTable(users, roles)
    } catch (error) {
        console.log("fetchUsers error: " + error)
    }
}

/*
function populateUsers(users) {
    usersDiv.innerHTML = ''
    for (let i = 0; i < users.length; i++) {
        const option = document.createElement('option')
        option.value = users[i].id
        option.textContent = users[i].username
        usersDiv.appendChild(option)
    }
}
*/

function populateUsersTable(students, roles) {
    const sortedStudents = students.slice().sort((a, b) => a.username.localeCompare(b.username));
    const tableBody = document.getElementById('userstbody');
    tableBody.innerHTML = ""; // Clear existing rows
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < sortedStudents.length; i++) {
        const user = sortedStudents[i];
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.username}</td>
            <td>${user.mobile}</td>
            <td>${user.roleName}</td>
        `;

        newRow.addEventListener('click', () => {
            const editForm = document.getElementById('editForm');
            editForm.role.innerHTML = "";


            editForm.userID.value = user.id;
            editForm.firstname.value = user.firstname;
            editForm.lastname.value = user.lastname;
            editForm.username.value = user.username;
            editForm.mobile.value = user.mobile;
            
            const selectedOption = document.createElement("option");
            selectedOption.value = user.roleId;
            selectedOption.textContent = user.roleName;
            editForm.role.appendChild(selectedOption);

            roles.forEach(roleItem => {
                if (roleItem.id !== user.roleId) { // Exclude the current class
                    const option = document.createElement("option");
                    option.value = roleItem.id;
                    option.textContent = roleItem.name;
                    editForm.role.appendChild(option);
                }
            });
        });
        tableBody.appendChild(newRow);
    }
}

async function fetchCurrentUser() {
    try {
        const response = await fetch('/currentUser')
        
        let user = await response.json()
        thisUser = new User(user[0], user[1])
        console.log(thisUser)
    } catch (error) {
        console.log('Failed to fetch thisUser:', error);
    }
}
  

async function fetchRoles() {
    try {
        const response = await fetch('/roles')
        roles = await response.json()
        populateRoles(roles)
    } catch (error) {
        console.log("fetchRoles error: " + error)
    }
}

function populateRoles(roles) {
    roles.forEach(roleItem => {
        const option = document.createElement("option");
        option.value = roleItem.id;
        option.textContent = roleItem.name;
        registerForm.role.appendChild(option);
    });
}

async function fetchTypes() {
    try {
        const response = await fetch('/types');
        const types = await response.json();
        populateTypes(types);
    } catch (error) {
        console.log("fetchTypes error: " + error);
    }
}

function populateTypes(types) {
    testDiv.innerHTML = ""; // Clear existing content
    types.forEach(typeItem => {
        const div = document.createElement("div");
        div.classList.add("panel");
        div.classList.add(typeItem.className); // Add the class for styling
        const innerDiv = document.createElement("div");
        innerDiv.classList.add("text-overlay");
        const h2 = document.createElement("h2");
        h2.textContent = typeItem.name;
        const p = document.createElement("p");
        p.textContent = typeItem.description;
        innerDiv.appendChild(h2);
        innerDiv.appendChild(p);
        div.appendChild(innerDiv);

        // Dynamically set background image
        div.style.backgroundImage = `url('${typeItem.imgURL}')`;
        
        // Append the div to the target div container
        testDiv.appendChild(div);

    });

}





async function fetchOwnSolceller() {
    try {
        console.log("fetchOwnSolceller")
        const response2 = await fetch('/currentUser');
        let user = await response2.json()
        let userid = user[0]
        const response = await fetch(`/ownSolceller/${userid}`)

        const solceller = await response.json()
        console.log("solceller" + solceller)
        //populateUsers(users)
        populateOwnSolcellerTable(solceller)
    } catch (error) {
        console.log("fetchOwnSolceller error: " + error)
    }
}

function populateOwnSolcellerTable(students) {
    const sortedStudents = students.slice().sort((a, b) => a.name.localeCompare(b.name));
    const tableBody = document.getElementById('ownsolcellertbody');
    tableBody.innerHTML = ""; // Clear existing rows
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < sortedStudents.length; i++) {
        const user = sortedStudents[i];
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${user.name}</td>
            <td>${user.description}</td>
            <td>${user.model}</td>
            <td>${user.built}</td>
            <td>${user.output} W</td>
            <td>${user.type}</td>
        `;
        tableBody.appendChild(newRow);
    }
}

async function fetchShowSolceller() {
    try {
        console.log("fetchShowSolceller")
        const response = await fetch('/showsolceller')

        solceller = await response.json()
        console.log("solceller" + solceller)
        //populateUsers(users)
        populateShowSolcellerTable(solceller)
    } catch (error) {
        console.log("fetchShowSolceller error: " + error)
    }
}

function populateShowSolcellerTable(students) {
    const sortedStudents = students.slice().sort((a, b) => a.name.localeCompare(b.name));
    const tableBody = document.getElementById('showsolcellertbody');
    tableBody.innerHTML = ""; // Clear existing rows
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < sortedStudents.length; i++) {
        const user = sortedStudents[i];
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${user.name}</td>
            <td>${user.description}</td>
            <td>${user.model}</td>
            <td>${user.built}</td>
            <td>${user.output} W</td>
            <td>${user.type}</td>
        `;
        tableBody.appendChild(newRow);
    }
}

function search() {
    var input, filter, table, tr, tds, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("showSolcellerTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        tds = tr[i].getElementsByTagName("td");
        for (j = 0; j < tds.length; j++) {
            if (tds[j]) {
                txtValue = tds[j].textContent || tds[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}