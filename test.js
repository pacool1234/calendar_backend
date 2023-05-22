const mongoose = require("mongoose");

const id = new mongoose.Types.ObjectId();

console.log(id);


//-------------------------------------------

// {
//   "name": "John",
//   "surname": "Doe",
//   "email": "john@doe.com",
//   "password": "1234",
//   "position": "CEO",
//   "company": "Acme Inc",
//   "field": "Heavy Industries"
// }
// {
//   "name": "Luigi",
//   "surname": "Pasteloni",
//   "email": "mamma@mia.com",
//   "password": "1234",
//   "position": "Project manager",
//   "company": "Ferrero Spa",
//   "field": "Food"
// }
// {
//   "name": "Napoleon",
//   "surname": "Bonaparte",
//   "email": "meetme@waterloo.com",
//   "password": "1234",
//   "position": "emperor",
//   "company": "Most Europe LLC",
//   "field": "Defense"
// }