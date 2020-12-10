// Dependencies
// ===========================================================
const fs = require("fs");
const express = require("express");
//const { response } = require("express");

const bodyParser = require("body-parser");
const db = require("./db/db.json");

// Sets up the Express App
// =============================================================
const server = express();
const SERVER_PORT = process.env.PORT || 2020;

const jsonParser = bodyParser.json();

// server.use(express.bodyParser());
server.use(express.static(__dirname + '/public'));

// Sets up the Express app to handle data parsing
server.use(express.urlencoded({ extended: true }));
server.use(express.json());



// Routes
// ===========================================================

// Ensure that you have at least one HTML page being served at the "/" route.
server.get("/", function (req, res) {
    res.json(path.join(__dirname, "public/index.html"));
});

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
server.get("/api/notes", (request, response) => {
    fs.readFile("./db/db.json", "utf8", (error, data) => {
        response.send(JSON.parse(data));
    })

});


// POST `/api/notes` - Should receive a new note to save on the request body, 
// add it to the `db.json` file, and then return the new note to the client.

// DATE and TIME will give each note a unique `id` when it's saved.
server.post("/api/notes", jsonParser, (request, response) => {

    // receive a new note to save on the request body
    const note = request.body;
    console.log(note);

    // READ the current `db.json` file
    fs.readFile("./db/db.json", "utf8", (error, data) => {
        let dbNotes = JSON.parse(data);

        // Use .getTime() method to assign a new id to the new note
        note.id = (new Date()).getTime();

        // ADD the new note to the dbNotes array of objects
        dbNotes.push(note);

        // Log updated dbNotes array of objects
        console.log(dbNotes);

        // SAVE updated db.json contents
        fs.writeFile("./db/db.json", JSON.stringify(dbNotes), function (err) {
            if (err) {
                return console.log(err);
            }
            // Log success message
            console.log("The db.json was updated with a new note!");
        });

        // RETURN the new note back to the client.
        // response.send(data);
        response.send(note);
    })

});


server.delete("/api/notes/:id", (request, response) => {

    // read all notes from the `db.json` file, 
    fs.readFile("./db/db.json", "utf8", (error, data) => {
        let dbNotes = JSON.parse(data);

        // REMOVE the existing note that matches the id provided
        dbNotes = dbNotes.filter(note => note.id !== parseInt(request.params.id));

        // Show resulting db.json contents
        console.log(dbNotes);

        // REWRITE the notes to the `db.json` file.
        fs.writeFile("./db/db.json", JSON.stringify(dbNotes), function (err) {
            if (err) {
                return console.log(err);
            }
            // Log success message
            console.log("The db.json was updated due to a deleted note!");
        });
        response.send(dbNotes);
    })

});

// GET `/notes` - Should return the `notes.html` file.
server.get("/notes", (request, response) => {
    fs.readFile("./public/notes.html", "utf8", (error, data) => {
        response.send(data);
    })

});

//GET `*` - Should return the `index.html` file
server.get("*", (request, response) => {
    fs.readFile("./public/index.html", "utf8", (error, data) => {
        response.send(data);
    })

});


// Listener
// ===========================================================

server.listen(SERVER_PORT, () => {
    console.log(`The server is listening on port ${SERVER_PORT}`);
});


