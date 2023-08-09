const http = require('http');
const con = require('./connect');


const server = http.createServer((req, res) => {

  //to get all records 
  if (req.url.startsWith('/bankinfo') && req.method == 'GET') {
   try{ const vary = new URLSearchParams((req.url).split("?").pop())
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
     // console.log(body)
    });
    req.on('end', () => {
      const vary = JSON.parse(body);
      console.log(vary, typeof vary);
      const { id, cname, ac_no, ac_open, ifsc, have_loan, phone } = vary;
      const values = [id, cname, ac_no, ac_open, ifsc, have_loan, phone];
    let limit = 10;
    let page = 1;
    if ('limit' in vary) {
      limit = vary.get('limit');
    }
    if ("page" in vary) {
      page = vary.get('page');
    }
    let offset = (page - 1) * limit;
    const valuesToCheck = ['id', 'cname', 'ac_no', 'ac_open', 'ifsc', 'have_loan', 'phone'];
    //to get specific record
    if (valuesToCheck.some(value => value in vary)) {

      con.getBy(limit, offset, vary)
        .then((data) => {
        
          if (data.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          }
          else {
            const keys =Object.keys(vary);
            let err=""
            keys.forEach(key => {
              if(key!="limit" && key!="page" ){
                let keyval=vary[key]
                err=err+ `${key}= '${keyval}' , `
              }})
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(`${err} this record is not present`);
          }
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
  });}
  catch{
    console.log("hello")
  }
  }

  //To insert data
  else if (req.url.startsWith('/bankinfo') && req.method == 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
     // console.log(body)
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        //console.log(data, typeof data);
        const { id, cname, ac_no, ac_open, ifsc, have_loan, phone } = data;
        const values = [id, cname, ac_no, ac_open, ifsc, have_loan, phone];
        // console.log(values)
        const valide=validate(data)
       // console.log("aaaaa",valide)
        if(valide[0])
         {
          con.insertData(values)
            .then((data) => {
              res.writeHead(data[1], { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data[0]));
            })
            .catch(error => {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: ' Error while inserting data.' }));
            });
        }
        else{
          res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(valide[1]));
        }
      }
      catch {
        res.writeHead(406, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Please enter the data in correct json formate.' }));
      }
    });

  }


  //To update data
  else if (req.url.startsWith('/bankinfo') && req.method == 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    // console.log(body)
    req.on('end', () => {
      const vary = new URLSearchParams((req.url).split("?").pop())
      //const { col, value } = parameter(vary)
      try {
        const data = JSON.parse(body);
        //console.log(data);
        const { id, cname, ac_no, ac_open, ifsc, have_loan, phone } = data;
        const values = [id, cname, ac_no, ac_open, ifsc, have_loan, phone];
        //console.log(values)

        if (typeof values[1] != 'string' | values[1].trim() === "") {
          res.writeHead(406, { 'Content-Type': 'application/json' });
          res.end("please Enter the name in string format ")
        }
        else if (!(Number.isInteger(values[2]))) {
          res.writeHead(406, { 'Content-Type': 'application/json' });
          res.end("please Enter ac_no in integer")
        }
        else if (isNaN(Date.parse(values[3]))) {
          res.writeHead(406, { 'Content-Type': 'application/json' });
          res.end("Please enter a valid date for ac_open in yyyy-mm-dd formate.");
        }
        else if (typeof values[4] != 'string' | values[1].trim() === "") {
          res.writeHead(406, { 'Content-Type': 'application/json' });
          res.end("please Enter the ifsc in string")
        }
        else if (typeof values[5] != 'boolean') {
          res.writeHead(406, { 'Content-Type': 'application/json' });
          res.end("please Enter the have_loan in boolean")
        }
        else if (!(Number.isInteger(values[6]))) {
          res.writeHead(406, { 'Content-Type': 'application/json' });
          res.end("please Enter phone in interger")
        }
        else {
          con.update(data, vary)
            .then((data) => {
              res.writeHead(data[1], { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data[0]));
            })
            .catch(error => {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'An error occurred while updating data.' }));
            });
        }
      }
      catch {
        res.writeHead(406, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'please enter the data in correct json object format .' }));
      }
    });
  }


  //for deleting data
  else if (req.url.startsWith('/bankinfo') && req.method == 'DELETE') {
    const vary = new URLSearchParams((req.url).split("?").pop())
   // const { col, value } = parameter(vary)
    con.deleteBy(vary)
      .then((data) => {
        res.writeHead(data[1], { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data[0]));
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



function validate(data){
    const values =Object.keys(data);
   //console.log(values)
    var valide=true;
    var result="Error "
      if (!values.includes('id')){
        //console.log("id not")
        result=result+", Enter value of id in interger"
        valide=false;
      }
      else if(!(Number.isInteger(data.id))){
       // console.log('id is not string')
        result=result+", Enter value of id in interger"
        valide=false;
      }
      else if(!data.id>0){
        // console.log('id is not string')
         result=result+", Id should be positive interger"
         valide=false;
       }
 

      if(!values.includes('cname')){
        result=result+", Enter the name in string format  "
        valide=false;
      }
      else if (typeof data.cname != 'string') {
        result=result+ ", Enter the name in string format"
        valide=false;
      }
      else if (data.cname.trim() === "") {
        result=result+ ",  cname shouldnot be empty"
        valide=false;
      }

      if(!values.includes('ac_no')){
        result=result +",  Enter ac_no in integer "
        valide=false;
      }
      else if (!(Number.isInteger(data.ac_no)) ) {
        result=result +",  Enter ac_no in integer "
        valide=false;
      }
      else if (! data.ac_no>0) {
        result=result +", Enter ac_no in positive integer "
        valide=false;
      }
      
      
      if(!values.includes('ac_open')){
        result=result +", Enter the open date for account in yyyy-mm-dd formate "
        valide=false;
      }
      else if (isNaN(Date.parse(data.ac_open))) {
        result=result +", Enter a valid open date for account in yyyy-mm-dd formate "
        valide=false;
      }

      if(!values.includes('ifsc')){
        result=result +", Enter the ifsc in string "
        valide=false;
      }
      else if (typeof data.ifsc != 'string' | data.ifsc.trim() === "") {
        result=result +", Enter the ifsc in string "
        valide=false;
      }
      else if (data.ifsc.trim() === "") {
        result=result +", ifsc in stould not be empty "
        valide=false;
      }

      if(!values.includes('have_loan')){
        result=result +", Enter the have_loan in boolean "
        valide=false;
      }
      else if (typeof data.have_loan != 'boolean') {
        result=result +", Enter the have_loan in boolean "
        valide=false;
      }

      if(!values.includes('phone')){
        result=result +", Enter phone in interger "
        valide=false;
      }
      else if (!(Number.isInteger(data.phone))) {
        result=result +", Enter phone in interger "
        valide=false;
      }
  
      return [valide, result];

}