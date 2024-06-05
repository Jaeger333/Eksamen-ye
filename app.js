const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const sqlite3 = require('better-sqlite3')
const db = sqlite3('./users.db', {verbose: console.log})
const session = require('express-session')
const dotenv = require('dotenv'); 

dotenv.config()


const saltRounds = 10
const app = express()
const staticPath = path.join(__dirname, '/public')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))



// Define your middleware and routes here


app.use(express.static(staticPath));


app.post('/login', (req, res) => {
    console.log('req.body:', req.body)
    let user = checkUserPassword(req.body.username, req.body.password) 
    if ( user != null) {
        req.session.loggedIn = true
        req.session.username = req.body.username
        req.session.userrole = user.role
        req.session.userid = user.userid
        if (user.role === "Administrasjon") {
            req.session.isAdmin = true
        } else {
            req.session.isAdmin = false
        }
        if (user.role === "Administrasjon" || user.role === "Salg" || user.role === "Montering") {
            req.session.isEmployee = true
        } else {
            req.session.isEmployee = false
        }

    //res.redirect('/');
    // Pseudocode - Adjust according to your actual frontend framework or vanilla JS

    } 

    if (user == null || !req.session.loggedIn) {
        res.json(null);
    }
    else {res.json(user)}


})

function checkUserPassword(username, password){
    console.log(username, password)
    const sql = db.prepare('SELECT user.id as userid, user.username, role.name as role, password FROM user inner join role on user.roleId = role.id WHERE username  = ?');
    let user = sql.get(username);
    if (user) {
        if (user && bcrypt.compareSync(password, user.password)) {
            return user 
        } else {
            null;
        }
    }
}

app.post('/selfRegister', (req, res) => {
    console.log("selfRegisterUser", req.body);
    const reguser = req.body;
    reguser.username = createUsername(reguser.firstname, reguser.lastname)
    const user = selfAddUser(reguser.username, reguser.firstname, reguser.lastname, reguser.password, reguser.mobile)
    // Redirect to user list or confirmation page after adding user
    res.redirect('/');
});

function createUsername(firstname, lastname) {
    const firstPart = firstname.substring(0, 3).toLowerCase()
    const secondPart = lastname.substring(0, 3).toLowerCase()
    const username = firstPart + secondPart
    return username
}

function selfAddUser(username, firstname, lastname, password, mobile) {
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)
    let sql = db.prepare("INSERT INTO user (username, firstname, lastname, password, mobile, roleId) " + 
                         " values (?, ?, ?, ?, ?, ?)")
    const info = sql.run(username, firstname, lastname, hash, mobile, 5)
    
    //sql=db.prepare('select user.id as userid, username, task.id as taskid, timedone, task.name as task, task.points from done inner join task on done.idtask = task.id where iduser = ?)')
    sql = db.prepare('SELECT user.id as userId, user.username, role.name AS role FROM user INNER JOIN role on user.roleId = role.id WHERE user.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  

    return rows[0]
}

app.post("/updateUser", checkLoggedIn, (req, res) => {
    console.log(req.body)
    const user = req.body
    if (user.password != "") {
        updateUserDB2(user.userID, user.username, user.firstname, user.lastname, user.mobile, user.password, user.role)
    } else {
        updateUserDB(user.userID, user.username, user.firstname, user.lastname, user.mobile, user.role)
    }
    res.redirect('/');
})

function updateUserDB(id, username, firstname, lastname, mobile, role) {
    const sql = db.prepare("update user set username=(?), firstname=(?), lastname=(?), mobile=(?), roleId=(?) WHERE id=(?)")
    const info = sql.run(username, firstname, lastname, mobile, role, id)
}

function updateUserDB2(id, username, firstname, lastname, mobile, password, role) {
    const sql = db.prepare("update user set username=(?), firstname=(?), lastname=(?), mobile=(?), password=(?), roleId=(?) WHERE id=(?)")

    const hash = bcrypt.hashSync(password, saltRounds);

    const info = sql.run(username, firstname, lastname, mobile, hash, role, id)
}

app.post("/updateSolcelle", checkLoggedIn, (req, res) => {
    console.log(req.body)
    const user = req.body
    if (user) {
        updateSolcelleDB(user.name, user.description, user.model, user.built, user.output, user.type, user.solcelleID)
    }
    res.redirect('/');
})

function updateSolcelleDB (name, description, model, built, output, typeId, id) {
    const sql = db.prepare("update solcelle set name=(?), description=(?), model=(?), built=(?), output=(?), typeId=(?) WHERE id=(?)")
    const info = sql.run(name, description, model, built, output, typeId, id)
}

app.post('/register', checkLoggedIn, checkIsAdmin, (req, res) => {
    console.log("registerUser", req.body);
    const reguser = req.body;
    reguser.username = createUsername(reguser.firstname, reguser.lastname)
    const user = addUser(reguser.username, reguser.firstname, reguser.lastname, reguser.password, reguser.mobile, reguser.role)
    // Redirect to user list or confirmation page after adding user
    res.redirect('/');
});

function addUser(username, firstname, lastname, password, mobile, roleId) {
    //Denne funksjonen må endres slik at man hasher passordet før man lagrer til databasen
    //rolle skal heller ikke være hardkodet.
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)
    let sql = db.prepare("INSERT INTO user (username, firstname, lastname, password, mobile, roleId) " + 
                         " values (?, ?, ?, ?, ?, ?)")
    const info = sql.run(username, firstname, lastname, hash, mobile, roleId)
    
    //sql=db.prepare('select user.id as userid, username, task.id as taskid, timedone, task.name as task, task.points from done inner join task on done.idtask = task.id where iduser = ?)')
    sql = db.prepare('SELECT user.id as userId, user.username, role.name AS role FROM user INNER JOIN role on user.roleId = role.id WHERE user.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  

    return rows[0]
}

app.post('/registerSolcelle', checkLoggedIn, checkIsEmployee, (req, res) => {
    console.log("registerSolcelle", req.body);
    const reguser = req.body;
    const solcelle = addSolcelle(reguser.name, reguser.description, reguser.model, reguser.built, reguser.output, reguser.type)
    // Redirect to user list or confirmation page after adding user
    res.redirect('/');
});

function addSolcelle(name, description, model, built, output, typeId) {
    let sql = db.prepare("INSERT INTO solcelle (name, description, model, built, output, typeId) " + 
                         " values (?, ?, ?, ?, ?, ?)")
    const info = sql.run(name, description, model, built, output, typeId)
    
    //sql=db.prepare('select user.id as userid, username, task.id as taskid, timedone, task.name as task, task.points from done inner join task on done.idtask = task.id where iduser = ?)')
    sql = db.prepare('SELECT solcelle.id as solcelleId, solcelle.name, type.name AS type FROM solcelle INNER JOIN type on solcelle.typeId = type.id WHERE solcelle.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  

    return rows[0]
}

function checkLoggedIn(req, res, next) {
    console.log('CheckLoggedIn')
    if (!req.session.loggedIn) {
        res.sendFile(path.join(__dirname, "./public/login.html"));
    } else {
        next();
    }
}

function checkIsAdmin(req, res, next) {
    console.log('checkIsAdmin')
    if (!req.session.isAdmin) {
        res.sendFile(path.join(__dirname, "/public/app.html"));
    } else {
        next();
    }
}

function checkIsEmployee(req, res, next) {
    console.log('checkIsEmployee')
    if (!req.session.isEmployee) {
        res.sendFile(path.join(__dirname, "/public/app.html"));
    } else {
        next();
    }
}

app.get('/users', checkLoggedIn, (req, res) => {
    const sql = db.prepare("SELECT user.id, user.username, user.firstname, user.lastname, user.mobile, user.roleId, role.name AS roleName FROM user INNER JOIN role ON user.roleId = role.id")
    let rows = sql.all()
    
    res.send(rows)
})

app.get('/roles', checkLoggedIn, (req, res) => {
    const sql = db.prepare("SELECT id, name FROM role")
    let rows = sql.all()
    
    res.send(rows)
})

app.get('/solceller', checkLoggedIn, (req, res) => {
    const sql = db.prepare("SELECT solcelle.id as id, solcelle.name, solcelle.description, solcelle.model, solcelle.built, solcelle.output, solcelle.typeId, type.name as type FROM solcelle INNER JOIN type ON solcelle.typeId = type.id")
    let rows = sql.all()

    res.json(rows)
})

app.get('/customers', checkLoggedIn, (req, res) => {
    const sql = db.prepare("SELECT user.id, user.username, role.name FROM user INNER JOIN role ON user.roleId = role.id WHERE role.name = 'Kunde'")
    let rows = sql.all()

    res.json(rows)
})

app.get('/showsolceller', (req, res) => {
    const sql = db.prepare("SELECT solcelle.id as id, solcelle.name, solcelle.description, solcelle.model, solcelle.built, solcelle.output, solcelle.typeId, type.name as type FROM solcelle INNER JOIN type ON solcelle.typeId = type.id")
    let rows = sql.all()

    res.json(rows)
})

app.post('/deleteSolcelle', checkLoggedIn, checkIsEmployee, (req, res) => {
    const sql = db.prepare("DELETE FROM solcelle WHERE id = ?")
    sql.run(req.body.id)
    res.redirect('/')
})

app.post('/deleteUserSolcelle', checkLoggedIn, checkIsEmployee, (req, res) => {
    const sql = db.prepare("DELETE FROM solcelle_user WHERE solcelle_user.userId = ? AND solcelle_user.solcelleId = ?")
    sql.run(req.body.customerId, req.body.solcelleId)
    res.redirect('/')
})

app.get('/types', (req, res) => {
    const sql = db.prepare("SELECT id, name, description, imgURL FROM type")
    let rows = sql.all()

    res.json(rows)
})

app.get('/ownSolceller/:userId', checkLoggedIn, (req, res) => {
    try {
        const sql = db.prepare(`
            SELECT 
                solcelle_user.id, 
                solcelle.name, 
                solcelle.description, 
                solcelle.model, 
                solcelle.built, 
                solcelle.output, 
                type.name AS type 
            FROM solcelle_user
            INNER JOIN solcelle ON solcelle_user.solcelleId = solcelle.id
            INNER JOIN type ON solcelle.typeId = type.id
            WHERE solcelle_user.userId = ?
        `);
        const rows = sql.all(req.params.userId);
        res.send(rows);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/currentUser', checkLoggedIn,  (req, res) => {
    
    res.send([req.session.userid, req.session.username, req.session.userrole]);
});

app.get('/', checkLoggedIn,(req, res) => {
    if (req.session.userrole === 'Administrasjon') {
        res.sendFile(path.join(__dirname, "public/admin.html"));
    } else if (req.session.userrole === 'Salg' || req.session.userrole === 'Montering') {
        res.sendFile(path.join(__dirname, "public/salgmont.html"));
    } else {
        res.sendFile(path.join(__dirname, "public/app.html"));

    }
});
  

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

//denne må defineres etter middleware. 
//Jeg prøvde å flytte den opp, for å rydde i koden og da fungerte det ikke
app.use(express.static(staticPath));


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});





