let dbUsername = 'cloudprojectuser'
let dbPassword = 'b.9jCoZaxEsKca.UdvPlipZHiKBljDS'
let dbUrl = "hobby-blfmhkkeanodgbkepkofbfdl.dbs.graphenedb.com:24780/db/data/"

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase("https://" + dbUsername + ":" + dbPassword + "@" + dbUrl);


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

  .get('/list', (req, res) => {
    db.cypher({
        query: 'MATCH (n:Person) return ID(n) AS id, n.name AS name, n.surname AS surname'
      }, function(err, results){
        if(err){
          res.render('pages/error')
        } else {
          res.render('pages/list', { people: results })
        }      
    })
  })

  .get('/list/create', (req, res) => {
    db.cypher({
      query: 'MATCH (n:Person) return ID(n) AS id, n.name AS name, n.surname AS surname'
      }, function(err, results){
        if(err){
          res.render('pages/error')
        } else {
          res.render('pages/create', { people: results })
        }      
    })
  })

  .post('/list/create', (req, res) => {
    db.cypher({
        query: 'CREATE (:Person {name:{paramName}, surname:{paramSurname}})',
        params: {
          paramName: req.body.name,
          paramSurname: req.body.surname
        }
      }, function(err, results){
        if(err){
          res.render('pages/error')
        } else {
          res.redirect('/list')
        }      
    })
  })

  .get('/list/update/:id', (req, res) => {
    db.cypher({
      query: 'MATCH (n:Person) WHERE ID(n) = {paramId} return ID(n) AS id, n.name AS name, n.surname AS surname',
      params: {
        paramId: req.body.id
      }
      }, function(err, results){
        if(err){
          res.render('pages/error')
        } else {
          console.log(results)
          res.render('pages/create', { person: results[0], edit: true })
        }      
    })
  })

  .post('/list/delete/:id', (req, res) => {
    console.log("deleting: " + req.body.id)
  })

  .get('/graph', (req, res) => {
    
    db.cypher({
        query: 'MATCH (n:Person) return ID(n) AS id'
      }, function(err, results){
        if(err){
          res.render('pages/error')
        } else {
          console.log(results)
          res.render('pages/create', { people: results })
        }      
    })

  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


