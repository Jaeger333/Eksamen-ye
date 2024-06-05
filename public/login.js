const loginForm = document.getElementById('loginForm');


loginForm.addEventListener('submit', login)

async function login(evt) {
        evt.preventDefault(); // Prevent the default form submissionzz
    
        try {
            let username = loginForm.username.value;
            let password = loginForm.password.value;
            
            const formData = {
                username: username,
                password: password
            }

            const response = await fetch('/login', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            });
            
            const user = await response.json();
    
            // Assuming the JSON response structure is { id: "someId", username: "someUsername" }
            // Adjust this according to your actual response structure
            if (user){ 
                console.log(user);
                window.location.href = '/';
                // Possibly redirect the user or update UI to show a successful login
            } else {
                // Handle case where user data is not in the expected format
                throw new Error('Unsuccessful login. Please try again.');
            }
        } catch (error) {
            console.log('Failed to fetch thisUser:', error);
        }
    }
    
      