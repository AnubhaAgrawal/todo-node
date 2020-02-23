var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const MONODB_URI = 'mongodb+srv://Anubha:agrawal@cluster0-okm0x.mongodb.net/test?retryWrites=true&w=majority'
//mongoose connection
mongoose.connect(MONODB_URI || 'mongodb://localhost/todo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose is Connected !!')
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
//mongoose scema

var todoSchema = new mongoose.Schema({
    name:String,
    date:{
        type: String,
        default: Date.now()
    }
});
var Todo = mongoose.model("Todo", todoSchema);

//var todoList = [
//    "wash the car",
//    "Buy Groceries"
//]

//============= Express Routes Here ================//
app.get("/", function(req, res){
    Todo.find({}, function(err, todoList){
        if(err) console.log(err);
        else{
            res.render("index.ejs", {todoList: todoList});
        }
    })
    
});

app.post("/newtodo", function(req, res){
    console.log("item submitted");
    var newItem = new Todo ({
       name: req.body.item
    });
    Todo.create(newItem,function(err, Todo){
        if(err) console.log(err);
        else{
            console.log("Inserted Item: "+ newItem);
        }
    });
    res.redirect("/");
});

app.get('/destroy/:id', function(req, res){
    console.log("item Deleted");
    var mongodb = require('mongodb');
    var delItem ={_id: new mongodb.ObjectID(req.params.id)};
    
    Todo.deleteOne(delItem,function(err, Todo){
        if(err) console.log(err);
        else{
            console.log("Deleted Item: "+ delItem._id);
        }
    });
    res.redirect("/");
});




app.post('/edit/:id', function(req, res){
    console.log("item Edited");
    var mongodb = require('mongodb');
   
    var r_name = req.body.items;

    Todo.updateOne({'_id': new mongodb.ObjectID(req.params.id)}, 
    { $set: {'name': r_name } },function(err, Todo){
        if(err) console.log(err);
        else{
            console.log("Edited Item: "+ req.params.id);
        }
    });
    res.redirect("/");
});


/*app.get("/edit", function(req, res){
    console.log("item Edited");
    var mongodb = require('mongodb');

    var editItem =res.render( 'edit', {
        name: req.params.id
    });
    
    Todo.find(editItem,function(err, Todo){
        if(err) console.log(err);
        else{
            console.log("Deleted Item: "+ delItem);
        }
    });
    res.redirect("/");
});
*/
// catch all other routes 
app.get("*", function(req, res){
    res.send("<h1>Invalid Page </h1>");
})

// server listening on port 3000
PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log("Server started on port 3000");
});