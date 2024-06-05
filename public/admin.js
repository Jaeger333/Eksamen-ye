const customerSelect = document.getElementById("customerSelect");
customerSelect.addEventListener("change", function() {
    fetchOwnSolceller2();
});

const customerSolcellerSelect = document.getElementById("customerSolcellerSelect");

async function main2() {
  
    await checkUserRole()
    console.log("checkUserRole")
    await fetchCustomers()
    await fetchOwnSolceller2()
}
  
  
async function checkUserRole() {
    await fetchUserRole()
    console.log("fetchUserRole")
};


document.addEventListener('DOMContentLoaded', main2)


async function fetchUserRole() {
    try {
        const response = await fetch('/currentUser')

        if (response.headers.get("content-type").includes("text/html")) {
            window.location.href = "/login.html";
            return;
        }
        
        let user = await response.json()
        console.log('user:', user)
        if (user[2] !== "Administrasjon") {
            console.log('Not admin')
            window.location.href = "/";
        } else {
            console.log('Admin is logged in')
        }
    } catch (error) {
        console.log('Failed to fetch thisUser:', error);
    }
}

async function fetchCustomers() {
    try {
        const response = await fetch('/customers')
        const customers = await response.json()
        populateCustomers(customers)
    } catch (error) {
        console.log("fetchCustomers error: " + error)
    }
}

function populateCustomers(customers) {
    customerSelect.innerHTML = "";
    customers.forEach(customerItem => {
        const option = document.createElement("option");
        option.value = customerItem.id;
        option.textContent = customerItem.username;
        customerSelect.appendChild(option);
    });

}

async function fetchOwnSolceller2() {
    try {
        console.log("fetchOwnSolceller")
        let userid = customerSelect.value
        const response = await fetch(`/ownSolceller/${userid}`)

        const solceller = await response.json()
        console.log("solceller" + solceller)
        //populateUsers(users)
        populateOwnSolcellerTable2(solceller)
    } catch (error) {
        console.log("fetchOwnSolceller error: " + error)
    }
}

function populateOwnSolcellerTable2(students) {
    const sortedStudents = students.slice().sort((a, b) => a.name.localeCompare(b.name));
    const tableBody = document.getElementById('showusersolcellertbody');
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
    customerSolcellerSelect.innerHTML = "";
    sortedStudents.forEach(studentItem => {
        const option = document.createElement("option");
        option.value = studentItem.id;
        option.textContent = studentItem.name;
        customerSolcellerSelect.appendChild(option);
    });
}