// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
var tableData = require("./db/db");
var fs = require("fs");
var path = require("path");

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.post("/api/notes", function (req, res) {
    let newID = tableData.length + 1;
    let newNote = req.body;
    let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    newNote.id = newID;
    notes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
    let id = req.params.id;
    let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    notes = notes.filter(e => {
        return e.id != id;
    });
    let newID = 0;
    for(note of notes) {
        note.id = newID.toString();
        newID++; 
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    res.json(notes);
});
// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});