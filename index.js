var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase("https://cloud-project:b.fq68iSjZlV1V.mIeVHQSgZmeo2me2@hobby-ikemhkkeanodgbkejcmpbfdl.dbs.graphenedb.com:24780/db/data/");

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
  .use(express.urlencoded())

  .use(express.static(path.join(__dirname, 'public')))

  .set('view engine', 'pug')
  .set('views', path.join(__dirname, 'views'))
  
  .get('/', (req, res) => res.render('pages/index'))

  .get('/list', (req, res) => res.render('pages/list'))
  .get('/list/create', (req, res) => res.render('pages/create'))

  .get('/graph', (req, res) => res.render('pages/graph'))


  .post('/list/create', (req, res) => {

    db.cypher({
      query: 'CREATE (n:Person {name: {personName}}) RETURN n',
      params: {
          personName: 'Bob'
      }
    }, function(err, results){
        var result = results[0];
        if (err) {
            console.error('Error saving new node to database:', err);
        } else {
            console.log('Node saved to database with id:', result['n']['_id']);
        }
    });

    res.redirect('/list')
    
  })


  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


