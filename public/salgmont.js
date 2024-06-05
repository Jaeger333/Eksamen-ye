async function main3() {
  
    await fetchTypes2()
    await fetchSolceller2()
    await fetchSolceller()
}
  
  

document.addEventListener('DOMContentLoaded', main3)


async function fetchTypes2() {
    try {
        const response = await fetch('/types');
        const types = await response.json();
        populateTypes2(types);
    } catch (error) {
        console.log("fetchTypes error: " + error);
    }
}

function populateTypes2(types) {
    const registerSolcelleForm = document.getElementById('registerSolcelleForm');

    types.forEach(typeItem => {
        const option = document.createElement("option");
        option.value = typeItem.id;
        option.textContent = typeItem.name;
        registerSolcelleForm.type.appendChild(option);

    });
}

async function fetchSolceller2() {
    try {
        const response = await fetch('/solceller');
        const solceller = await response.json();
        populateSolceller2(solceller)
    } catch (error) {
        console.log("fetchSolceller error: " + error);
    }
}

function populateSolceller2(solceller) {
    solcellerSelect.innerHTML = "";

    solceller.forEach(solcelleItem => {
        const option = document.createElement("option");
        option.value = solcelleItem.id;
        option.textContent = solcelleItem.name;
        solcellerSelect.appendChild(option);
    });

}

async function fetchSolceller() {
    try {
        console.log("fetchSolceller")
        const response = await fetch('/solceller')
        const response2 = await fetch('/types')

        solceller = await response.json()
        types = await response2.json()
        console.log("users" + users)
        //populateUsers(users)
        populateSolcellerTable(solceller, types)
    } catch (error) {
        console.log("fetchSolcellersalgmont error: " + error)
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

function populateSolcellerTable(students, types) {
    const sortedStudents = students.slice().sort((a, b) => a.name.localeCompare(b.name));
    const tableBody = document.getElementById('solcellertbody');
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
            <td>${user.output}</td>
            <td>${user.type}</td>
        `;

        newRow.addEventListener('click', () => {
            const editForm = document.getElementById('solcellerEditForm');
            editForm.type.innerHTML = "";


            editForm.solcelleID.value = user.id;
            editForm.name.value = user.name;
            editForm.description.value = user.description;
            editForm.model.value = user.model;
            editForm.built.value = user.built;
            editForm.output.value = user.output;
            
            const selectedOption = document.createElement("option");
            selectedOption.value = user.typeId;
            selectedOption.textContent = user.type;
            editForm.type.appendChild(selectedOption);

            types.forEach(typeItem => {
                if (typeItem.id !== user.typeId) { // Exclude the current class
                    const option = document.createElement("option");
                    option.value = typeItem.id;
                    option.textContent = typeItem.name;
                    editForm.type.appendChild(option);
                }
            });
        });
        tableBody.appendChild(newRow);
    }
}