let dbUsername = 'cloudprojectuser'
let dbPassword = 'b.9jCoZaxEsKca.UdvPlipZHiKBljDS'
let dbUrl = "hobby-blfmhkkeanodgbkepkofbfdl.dbs.graphenedb.com:24780/db/data/"

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase("https://" + dbUsername + ":" + dbPassword + "@" + dbUrl);


const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
   .use(express.urlencoded({
      extended: true
   }))

   .use(express.static(path.join(__dirname, 'public')))

   .set('view engine', 'pug')
   .set('views', path.join(__dirname, 'views'))

   .get('/', (req, res) => res.render('pages/index'))

   .get('/list', (req, res) => {
      db.cypher({
         query: 'MATCH (n:Person) RETURN ID(n) AS id, n.name AS name, n.surname AS surname ORDER BY n.id'
      }, function (err, results) {
         if (err) {
            res.render('pages/error')
         } else {
            res.render('pages/list', {
               people: results
            })
         }
      })
   })

   .get('/list/create', (req, res) => {
      db.cypher({
         query: 'MATCH (n:Person) RETURN ID(n) AS id, n.name AS name, n.surname AS surname'
      }, function (err, results) {
         if (err) {
            res.render('pages/error')
         } else {
            res.render('pages/create', {
               people: results,
               knownPeople: []
            })
         }
      })
   })

   .post('/list/create', (req, res) => {
      var list = req.body.list
      var intArray = [];

      if (list) {
         intArray = list.map(Number)
      }

      db.cypher({
         query: 'CREATE (n:Person {name:{paramName}, surname:{paramSurname}}) RETURN n',
         params: {
            paramName: req.body.name,
            paramSurname: req.body.surname
         }
      }, function (err, results) {
         if (err) {
            res.render('pages/error')
         } else {
            let newPersonId = results[0].n._id

            var processed = 0
            if (intArray.length > 0) {
               intArray.forEach(id => {
                  db.cypher({
                     query: 'MATCH (p) WHERE ID(p)={paramPersonId} MATCH (p2) WHERE ID(p2)={paramOtherPersonId} CREATE (p)-[:KNOWS]->(p2)',
                     params: {
                        paramPersonId: newPersonId,
                        paramOtherPersonId: id
                     }
                  }, function (err, results) {
                     if (err) {
                        res.render('pages/error')
                     } else {
                        processed += 1
                        if (processed == intArray.length) {
                           res.redirect('/list')
                        }
                     }
                  })
               });
            } else {
               res.redirect('/list')
            }
         }
      })
   })

   .get('/list/update/:id', (req, res) => {
      let query = 'MATCH (n) WHERE ID(n) = ' + req.params.id + ' RETURN ID(n) AS id, n.name AS name, n.surname AS surname'
      db.cypher({
         query: query
      }, function (err, results) {
         if (err) {
            res.render('pages/error')
         } else {
            let person = results[0];
            let query = 'MATCH (n:Person) WHERE NOT ID(n) = ' + req.params.id + ' RETURN ID(n) AS id, n.name AS name, n.surname AS surname ORDER BY n.id'
            db.cypher({
               query: query
            }, function (err, results) {
               if (err) {
                  res.render('pages/error')
               } else {
                  let remainingPeople = results
                  db.cypher({
                     query: `
                        MATCH (x:Person) WHERE ID(x) = ` + req.params.id + `
                        MATCH (n:Person) WHERE NOT ID(n) = ` + req.params.id + `
                        MATCH (x:Person)-[:KNOWS]->(n:Person) RETURN ID(n) AS id
                     `
                  }, function (err, results) {
                     if (err) {
                        res.render('pages/error')
                     } else {
                        let knownPeople = []
                        results.forEach(function (result) {
                           knownPeople.push(result.id)
                        })
                        console.log(knownPeople)
                        res.render('pages/create', {
                           person: person,
                           knownPeople: knownPeople,
                           people: remainingPeople,
                           edit: true
                        })
                     }
                  })
               }
            })
         }
      })
   })

   .post('/list/update/:id', (req, res) => {
      let query = 'MATCH (n) WHERE ID(n) = ' + req.params.id + ' SET n.name = "' + req.body.name + '", n.surname = "' + req.body.surname + '"'
      console.log(query)
      db.cypher({
         query: query
      }, function (err, results) {
         if (err) {
            res.render('pages/error')
         } else {
            res.redirect('/list')
         }
      })
   })

   .post('/list/delete/:id', (req, res) => {
      let query = 'MATCH (n) WHERE ID(n) = ' + req.params.id + ' DETACH DELETE n'
      db.cypher({
         query: query
      }, function (err, results) {
         if (err) {
            res.render('pages/error')
         } else {
            res.redirect('/list')
         }
      })
   })

   .get('/reports', (req, res) => {
      let query = `
      MATCH (b:Person)
      WITH b, SIZE(()-[:KNOWS]->(b)) as relationCount
      ORDER BY relationCount DESC LIMIT 1
      MATCH (a)-[:KNOWS]->(b)
      RETURN ID(a) AS id, a.name AS name, a.surname AS surname
         `

      db.cypher({
         query: query
      }, function (err, results) {
         if (err) {
            res.render('pages/error')
         } else {
            let mostPopular = results[0];
            res.render('pages/reports', {
               mostPopular
            })
         }
      })
   })

   .get('/graph', (req, res) => {
      res.render('pages/graph')
   })

   .listen(PORT, () => console.log(`Listening on ${ PORT }`))