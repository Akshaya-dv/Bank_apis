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
function getAll(limit,offset) {
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

function getBy(limit,offset,col,value) {
  
  let select = `SELECT * FROM public.bank_info where ${col}='${value}' order by id limit ${limit} offset ${offset}`
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

function insertData(values) {
  
  const insertQuery = `
  INSERT INTO public.bank_info(
    id, cname, ac_no, ac_open, ifsc, have_loan, phone)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
  `;
   return pool.query(insertQuery, values)
   .then(()=>{
    return "The data is inserted sucessfully";})
 .catch(error => {
   console.error('Error id is already present :', error);
   throw error;})
 
}
  
function update(data,col,value){
 
  const { id, cname, ac_no, ac_open, ifsc, have_loan, phone } = data;
  // console.log(id,cname, ac_no, ac_open, ifsc, have_loan, phone,col,value )
  const updateque=`UPDATE public.bank_info
	SET  id=${id},cname='${cname}', ac_no='${ac_no}', ac_open='${ac_open}', ifsc='${ifsc}', have_loan=${have_loan}, phone=${phone}
	WHERE ${col}=${value};`;
  return pool.query(updateque)
  .then(()=>{console.log("All done")})
  .catch(()=>{console.log("Leave it")})
}

function deleteBy(col,value){
  const deleteque=`Delete from public.bank_info where ${col}='${value}'`
  return pool.query(deleteque)
    .then(()=>{
       return "The data is deleted sucessfully";})
    .catch(error => {
      console.error('Error deleting data:', error);
      throw error;
    });

}
module.exports = { getAll, insertData, getBy ,deleteBy,update};
//pool.end()
