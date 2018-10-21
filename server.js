var express=require('express');
var fileSystem = require("fs")
var usersJsonObj=require('./users.json');
var parser = require("body-parser");
var app=express();

app.use(parser.urlencoded({extended:true}));
app.use(parser.json());
app.use(express.static("./client"));

function getPersonsDB(){
    var file = fileSystem.readFileSync("./users.json", "utf-8");
    var jsonDB = JSON.parse(file);
    return jsonDB;
}

function addPersonToDB(person){
    var jsonDB = getPersonsDB();
    jsonDB.persons.push(person);
    fileSystem.writeFileSync("./users.json", JSON.stringify(jsonDB));
}

function isPersonExist(personToAdd){
    var isExist = false;

    var jsonDB = getPersonsDB();

    for(var person of jsonDB.persons){
        if(person.name.toLowerCase() == personToAdd.name.toLowerCase())
            isExist = true;
    }
    return isExist;
}

app.post("/api/addPerson", function(request, response) {
    var person =request.body;
    
    if(isPersonExist(person)){
        response.status(400);
    }else{
        response.status(201);
        addPersonToDB(person);        
    }  
    response.send();           
});

app.get('/api/persons',(req,res)=>{
    res.status(200);
    var jsonDB = getPersonsDB();
    res.send(JSON.stringify(jsonDB));
});
app.listen(process.env.PORT||3500);