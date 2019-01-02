'use strict'

// Dependencies

const express = require('express');
const superagent = require('superagent');
const app = express();
const pg = require('pg');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.get('/', home);
app.get('/new', newSearch);
app.post('/searches', search);

app.get('/books/:id', visitBookDetail);


//database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

function home(request, response) {
  let SQL = 'SELECT * FROM books';
  return client.query(SQL)
    .then(result => {
      if(result.rowCount === 0) {//If there is nothing there go search for books
        response.render('pages/searches/new')
      } else {
        response.render('pages/index', {books:result.rows});//get it from the database
        console.log({books:result.rows});
      }
    })
    .catch( err => {
      console.log('database request error')
      return handleError(err, response);
    })
}

function search(request, response) {
  const searchStr = request.body.search[0];
  const searchType = request.body.search[1];
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(searchType === 'title') {
    url += `+intitle:${searchStr}`;
  } else if (searchType === 'author') {
    url += `+inauthor:${searchStr}`;
  }

  return superagent.get(url)
    .then( result => {
      let books = result.body.items.map(book => new Book(book));
      response.render('pages/searches/show', {books});
      console.log(books);
    })
    .catch( err => {
      console.log('superagent error')
      return handleError(err, response);
    })
}

function newSearch (request, response){
  response.render('pages/searches/new');
}

function Book(book) {
  console.log(book);
  this.author = book.volumeInfo.authors || 'Author Unknown';
  this.title = book.volumeInfo.title || 'Title Missing';
  this.isbn = book.volumeInfo.industryIdentifiers[0].type + book.volumeInfo.industryIdentifiers[0].identifier || 'ISBN Missing';
  this.image_url = book.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpeg';
  this.description = book.volumeInfo.description || 'Description Missing';
}

function handleError (err, response) {
  console.error(err);
  response.render('pages/error', err);
}

function visitBookDetail(request, response) {
  let SQL = 'SELECT * FROM books where id=$1';
  console.log('this is the value', [request.params.id]);
  let values = [request.params.id];
  return client.query(SQL, values)
    .then(result => {
      console.log(result.rows[0])
      response.render('pages/books/show', {selected_book:result.rows[0]}
      )
    })
    .catch( err => {
      console.log('database request error')
      return handleError(err, response);
    })
}


app.listen( PORT, () => console.log(`APP is up on PORT:${PORT}`));
