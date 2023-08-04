const http = require('http');
const con = require('./connection');
const { isNull } = require('util');
const { error } = require('console');

const server = http.createServer((req, res) => {

  //to get all records 
  if (req.url.startsWith('/bankinfo') && req.method == 'GET') {
    const vary = new URLSearchParams((req.url).split("?").pop())

    let limit = 5;
    let page = 1;
    if (vary.has('limit')) {
      limit = vary.get('limit');
    }
    if (vary.has("page")) {
      page = vary.get('page');
    }
    let offset = (page - 1) * limit;
    const valuesToCheck = ['id', 'cname', 'ac_no', 'ac_open', 'ifsc', 'have_loan', 'phone'];
    //to get specific record
    if (valuesToCheck.some(value => vary.has(value))) {

      const { col, value } = parameter(vary)
      con.getBy(limit, offset, col, value)
        .then((data) => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'An error occurred while fetching data.' }));
        });


    }
    else {
      con.getAll(limit, offset)
        .then(data => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'An error occurred while fetching data.' }));
        });
    }

  }

  //To insert data
  else if (req.url.startsWith('/bankinfo') && req.method == 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      //console.log(body)
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        //console.log(data);
        const { id, cname, ac_no, ac_open, ifsc, have_loan, phone } = data;
        const values = [id, cname, ac_no, ac_open, ifsc, have_loan, phone];
        // console.log(values)
        if (values.some(value => value == undefined)) {
          res.end("please Enter the all values")
        }
        else if (!(Number.isInteger(values[0])))  {
           res.end("please Enter id in interger") 
        }
        else if (typeof values[1] != 'string') {
           res.end("please Enter the name in string") 
        }
        else if (!(Number.isInteger(values[0]))) { 
          res.end("please Enter ac_no in string") 
        }
        else if (typeof values[4] != 'string') {
           res.end("please Enter the ifsc in string") 
        }
        else if (typeof values[5] != 'boolean') {
          res.end("please Enter the have_loan in boolean") 
        }
        else if (!(Number.isInteger(values[6]))) {
           res.end("please Enter phone in interger") 
        }
        else {
          con.insertData(values)
            .then(() => {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Data inserted successfully.' }));
            })
            .catch(error => {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'the id is all ready present while inserting data.' }));
            });
        }

      }
      catch {
        res.end(JSON.stringify({ error: 'please enter the data in correct json formate.' }));
      }
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
      const vary = new URLSearchParams((req.url).split("?").pop())
      const { col, value } = parameter(vary)
      try {
        const data = JSON.parse(body);
        console.log(data);
        const { id, cname, ac_no, ac_open, ifsc, have_loan, phone } = data;
        const values = [id, cname, ac_no, ac_open, ifsc, have_loan, phone];
        console.log(values)
        if (values.some(value => value == undefined)) {
          res.end("please Enter the all values")
        }
        else if (!(Number.isInteger(values[0]))) { res.end("please Enter id in interger") }
        else if (typeof values[1] != 'string') {
          { res.end("please Enter the name in string") }
        }
        else if (typeof values[2] != 'string') { res.end("please Enter ac_no in string") }
        else if (typeof values[4] != 'string') {
          { res.end("please Enter the ifsc in string") }
        }
        else if (typeof values[5] != 'boolean') {
          { res.end("please Enter the have_loan in boolean") }
        }
        else if (!(Number.isInteger(values[6]))) { res.end("please Enter phone in interger") }

        else {
          con.update(data, col, value)
            .then(() => {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Data updated successfully.' }));
            })
            .catch(error => {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'An error occurred while updating data.' }));
            });
        }
      }
      catch {
        res.end(JSON.stringify({ error: 'please enter the data in correct json object format .' }));
      }
    });
  }


  //for deleting data
  else if (req.url.startsWith('/bankinfo') && req.method == 'DELETE') {
    const vary = new URLSearchParams((req.url).split("?").pop())
    const { col, value } = parameter(vary)
    con.deleteBy(col, value)
      .then((data) => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch(error => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred while deleting data.' }));
      });
  }


  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'This Endpoint doesnot exist found.' }));
  }


});
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
con.updatebal()
.then(()=>{console.log("all done")})

function parameter(vary) {
  let col;
  let value;
  if (vary.has('id')) {
    col = "id";
    value = vary.get('id');
  }
  else if (vary.has("cname")) {
    col = "cname";
    value = vary.get('cname');
  }
  else if (vary.has("ac_no")) {
    col = "ac_no";
    value = vary.get('ac_no');
  }
  else if (vary.has("ac_open")) {
    col = "ac_open";
    value = vary.get('ac_open');
  }
  else if (vary.has("ifsc")) {
    col = "ifsc";
    value = vary.get('ifsc');
  }
  else if (vary.has("have_loan")) {
    col = "have_loan";
    value = vary.get('have_loan');
  }
  else if (vary.has("phone")) {
    col = "phone";
    value = vary.get('phone');
  }
  else {
    col = "id";
    value = 1;
  }
  return { col, value }
}
