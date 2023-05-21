const d = "2023-06-11T08:00:00.000Z"
const regex = /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}):\d{2}/;
const match = d.match(regex);

const [ _, date, time ] = match

console.log(date);
console.log(time);
//-------------------------------------------

