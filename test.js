const d = "2023-06-11T08:00:00.000Z"
const regex = /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}):\d{2}/;
const match = d.match(regex);

const [ _, date, time ] = match

console.log(date);
console.log(time);
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