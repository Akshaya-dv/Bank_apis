const { error } = require('console');
const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS bank_info (
    id SERIAL PRIMARY KEY,
    cname VARCHAR(50) NOT NULL,
    ac_no BIGINT NOT NULL,
    ac_open DATE NOT NULL,
    ifsc CHAR(20) NOT NULL,
    have_loan BOOLEAN NOT NULL,
    phone int 
  );
`;

// Function to create the 'bank_info' table if it doesn't exist
pool.connect()
  .then(client => {
    return client.query(createTableQuery)
      .then(() => client.release())
      .catch(error => {
        client.release();
        console.error('Error creating table:', error);
      });
  })
  .catch(error => console.error('Error connecting to database:', error));

// Function to fetch all data from the 'bank_info' table
function getAll(limit, offset) {
  return pool.query(`SELECT * FROM public.bank_info order by id limit ${limit} offset ${offset}`)
    .then(result => {
      const data = result.rows;
      console.log('Fetched all data:');
      return data;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

function getBy(limit, offset, values) {
  const keys = Object.keys(values);
  //console.log(keys)
  let where = "  id IS NOT NULL"
  keys.forEach(key => {
    if (key != "limit" && key != "page") {
      let keyval = values[key]
      if(key=='cname'|key=='ifsc'){
      where = where + ` and ${key} ILIKE '%${keyval}%'`
       //console.log(where)
    }  else{where = where + ` and ${key}='${keyval}'`}
  }
  });
  let select = `SELECT * FROM public.bank_info where ${where}  order by id limit ${limit} offset ${offset}`
  // console.log(select)
  return pool.query(select)
    .then(result => {
      const data = result.rows;
      console.log('Fetched data:');
      return data;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

async function insertData(values) {
  try {
    const allids = await pool.query(`SELECT id FROM public.bank_info ;`)
    // console.log(allids.rows.some(row => row.id == values[0]))

    if (allids.rows.some(row => row.id == values[0])) {
      return "Error this id is all ready present",406;
    }
    else {
      const insertQuery = `
    INSERT INTO public.bank_info(
    id, cname, ac_no, ac_open, ifsc, have_loan, phone)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
  `;
      return pool.query(insertQuery, values)
        .then(() => {
          return "The data is inserted sucessfully",200;
        })
        .catch(error => {
          console.error('Error some thing went wrong ', error);
          throw error;
        })
    }
  }
  catch { }

}

async function update(data, values) {
  // console.log(value,col)
  try {
    const { id, cname, ac_no, ac_open, ifsc, have_loan, phone } = data;
    const allids = await pool.query(`SELECT id FROM public.bank_info ;`)
    const keys = Array.from(values.keys());
    let where="  id IS NOT NULL"
    keys.forEach(key => {
      if (key != "limit" && key != "page") {
        let keyval = values.get(key)
        where = where + ` and ${key}='${keyval}'`
         //console.log(where)
      }
    });
    
    const alldata = await pool.query(`SELECT * FROM public.bank_info where ${where} ;`)

    //
    if (id === undefined) {
      if (alldata.rowCount > 0) {
        console.log(cname, ac_no, ac_open, ifsc, have_loan, phone)
        const updateque = `UPDATE public.bank_info
	SET  cname='${cname}', ac_no='${ac_no}', ac_open='${ac_open}', ifsc='${ifsc}', have_loan=${have_loan}, phone=${phone}
	WHERE ${where};`;
  //console.log(updateque)
        return pool.query(updateque)
          .then(() => {
            return "The data is updated sucessfully",200
          })
          .catch(error => {
            return 'Error: their are more than one record in occured while updating data.',500
          })

      }
      else {
        return `The ${where} is not present.`,404;
      }
    }
    else {
      return "Id can not be updated",406
    }
  }
  catch {
    return "Error while updating",500
  }
}

function deleteBy(values) {
  const keys = Array.from(values.keys());
  let where="  id IS NOT NULL"
  keys.forEach(key => {
    if (key != "limit" && key != "page") {
      let keyval = values.get(key)
      where = where + ` and ${key}='${keyval}'`
       //console.log(where)
    }
  });
  const deleteque = `Delete from public.bank_info where ${where};`
  return pool.query(deleteque)
    .then((data) => {
      if (data.rowCount > 0) {
        return "The data is deleted sucessfully",200;
      }
      else {
        return `The given ${where} is not present `,404;
      }
    })
    .catch(error => {
      console.error('Error deleting data:', error);
      throw error;
    });

}
function updatebal() {

  const updatebala = `UPDATE public.bank_info AS t
SET balance = new_values.balance,
    years = new_values.years
FROM (VALUES
        (1, 20000, 2),
        (2, 1000, 3),
        (3, 6000, 4),
        (4,5000, 3),
        (5, 7000, 5),
        (6, 6000, 3),
        (7, 7000, 7),
        (8, 50000, 3),
        (9, 1000, 7),
        (10, 2000, 3),
        (11, 60000, 5),
        (12, 10000, 2),
        (13, 5000, 6),
        (14, 16000, 4),
        (15, 7000, 3),
        (16, 5000, 1),
        (17, 10000, 3),
        (18, 10000, 6),
        (19, 11000, 4)
    ) AS new_values(id, balance, years)
WHERE t.id = new_values.id;
`
  return pool.query(updatebala);
}
module.exports = { getAll, insertData, getBy, deleteBy, update, updatebal };
//pool.end()
