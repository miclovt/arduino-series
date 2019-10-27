const express = require('express');
const cors = require('cors')
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inmotica'
  })
const app= express();
const APIport = 8000;
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('COM3', {
  baudRate: 9600
});
const port2 = new SerialPort('COM4', {
  baudRate: 9600
});
/*const port2 = new SerialPort('COM3', {
  baudRate: 57600
});*/
const parser = port.pipe(new Readline({ delimiter: '\n' }))
const parser2 = port2.pipe(new Readline({ delimiter: '\n' }))
app.use(cors())
let depgas1=0;
let dephum1=0;
let depgas2=0;
let dephum2=0;
let post;
let post2;
let alldeps={
  dep1:false,
  dep2:false
};
parser.on('data', function(data){
  var res=data.replace('\r','').split(' ');
  if(!isNaN(parseInt(res[0])) && !isNaN(parseInt(res[1]))){
    depgas1 =parseInt(res[0]);
    dephum1 =parseInt(res[1]);
    
    if (parseInt(res[2])==1)
        {
          alldeps.dep1=true;
        }
        else{
          alldeps.dep1=false;
        }
      
    post= {gas: depgas1,hum: dephum1};
    connection.query('INSERT INTO departamento1001 SET ?', post, function (error, results, fields) {
        if (error) throw error;
        // Neat!
      });
}
});
parser2.on('data', function(data){
  var res=data.replace('\r','').split(' ');
  if(!isNaN(parseInt(res[0])) && !isNaN(parseInt(res[1]))){
    depgas2 =parseInt(res[0]);
    dephum2 =parseInt(res[1]);
    
    if (parseInt(res[2])==1)
        {
          alldeps.dep2=true;
        }
        else{
          alldeps.dep2=false;
        }
      
    post2= {gas: depgas2,hum: dephum2};
    connection.query('INSERT INTO departamento1002 SET ?', post2, function (error, results, fields) {
        if (error) throw error;
        // Neat!
      });
    }
});


app.get('/api/dep1',(req,res)=>{
    res.json([post]);
});
app.get('/api/dep2',(req,res)=>{
  res.json([post2]);
});
app.get('/api/alldeps',(req,res)=>{
  res.json([alldeps]);
});

app.listen(APIport,()=>console.log("servidor corriendo"));