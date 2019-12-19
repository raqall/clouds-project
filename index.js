let dbUsername = 'cloudprojectuser'
let dbPassword = 'b.9jCoZaxEsKca.UdvPlipZHiKBljDS'
let dbConnectionString = "bolt://hobby-blfmhkkeanodgbkepkofbfdl.dbs.graphenedb.com:24787"

var neo4j = require('neo4j-driver');
var driver = neo4j.driver(dbConnectionString, neo4j.auth.basic(dbUsername, dbPassword));


console.log(neo4j)


var session = driver.session();

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

/*
    Handlers for functionalities
*/

function createPerson(){
  console.log('addig person')
}

express()
  .use(express.urlencoded({ extended: true }))

  .use(express.static(path.join(__dirname, 'public')))

  .set('view engine', 'pug')
  .set('views', path.join(__dirname, 'views'))
  
  .get('/', (req, res) => res.render('pages/index'))

  .get('/list', (req, res) => res.render('pages/list'))
  .get('/list/create', (req, res) => res.render('pages/create'))

  .get('/graph', (req, res) => res.render('pages/graph'))


  .post('/list/create', (req, res) => {

    res.set('Content-Type', 'text/html');
    res.send(new Buffer( JSON.stringify(neo4j) ));

    // console.log(req.body)
    
    // session
    //     .run('CREATE (n:Person {name:"Bob"})')
    //     .then(function(result) {
    //         console.log(result)
    //         session.close();
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //     });

    // res.redirect('/list')
    
  })


  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


