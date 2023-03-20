const fs = require('fs');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();
const uuid = require('uuid')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//handles default address
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

//handles notes adress
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//handles database address
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'db/db.json'))
});

//handles new notes recieved from user
app.post('/api/notes', (req, res) => {
  const database = fs.readFileSync('db/db.json');
  const data = JSON.parse(database);
  req.body.id = uuid.v1();
  data.push(req.body);
  const update = JSON.stringify(data, null, 2);
  fs.writeFileSync('db/db.json', update);
  res.json(req.body);
});

//handles removing notes selected by user
app.delete('/api/notes/:id', (req, res) => {
  const database = fs.readFileSync('db/db.json');
  const data = JSON.parse(database);
  var flag = false;
  for(var i = 0; i < data.length && !flag; i++){
    if(data[i].id === req.params.id){
      data.splice(i, 1);
      flag = true;
    }
  }
  const update = JSON.stringify(data, null, 2);
  fs.writeFileSync('db/db.json', update);
  res.json("Success");
});

// port open
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);