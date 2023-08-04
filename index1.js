const http = require('http');
const con = require('./connection');
const { error, Console } = require('console');
const server = http.createServer((req, res) => {

//to get all records 
  if (req.url == '/bankinfo' && req.method == 'GET') {
    con.getAll()
      .then(data => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch(error => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred while fetching data.' }));
      });
  }


//to get specific record
  else if (req.url.startsWith('/bankinfo') && req.method == 'GET') {

    const pars = JSON.stringify(req.url).split("?").pop();
    const par = pars.split("=")
    var col = par[0]
    var value = par[1].split(`"`)[0]
    //console.log(col)
    //console.log(value)
    con.getBy(col, value)
      .then((data) => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch(error => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred while inserting data.' }));
      });
  }


//To insert data
  else if (req.url == '/bankinfo' && req.method == 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      console.log(body)
    });
    
    req.on('end', () => {
        const data = JSON.parse(body);
        console.log(data);
        con.insertData(data)
          .then(() => {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data inserted successfully.' }));
          })
          .catch(error => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'An error occurred while inserting data.' }));
          });
    });
  }


//To update data
  else if (req.url.startsWith('/bankinfo') && req.method == 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    console.log(body)
    req.on('end', () => {

        const pars = JSON.stringify(req.url).split("?").pop();
        const par = pars.split("=")
        var col = par[0]
        var value = par[1].split(`"`)[0]
        const data = JSON.parse(body);
        con.update(data,col,value)
        .then(() => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Data updated successfully.' }));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'An error occurred while updating data.' }));
        });
      
         
         });
  }


//for deleting data
  else if (req.url.startsWith('/bankinfo') && req.method == 'DELETE') {
    const pars = JSON.stringify(req.url).split("?").pop();
    const par = pars.split("=")
    var col = par[0]
    var value = par[1].split(`"`)[0]
    console.log(col)
    console.log(value)
    con.deleteBy(col, value)
      .then((data) => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch(error => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred while inserting data.' }));
      });
  }


  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found.' }));
  }


});
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

