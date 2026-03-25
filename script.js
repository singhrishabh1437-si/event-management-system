const API_BASE = "https://hpnic54jx1.execute-api.ap-south-1.amazonaws.com/prod";

let allEvents = [];

fetch(`${API_BASE}/events`)
.then(res => res.json())
.then(events => {

allEvents = events;

renderEvents(events);

})
.catch(err => {

console.error(err);

document.getElementById("events-list").innerHTML =
"<p>Failed to load events.</p>";

});


function renderEvents(events){

const container = document.getElementById("events-list");

container.innerHTML = "";

if(events.length === 0){

container.innerHTML = "<p>No events available.</p>";
return;

}

events.forEach(event => {

const div = document.createElement("div");

div.className = "event";

div.innerHTML = `

<h3>${event.title}</h3>

<p><strong>Category:</strong> ${event.category}</p>

<p><strong>Date:</strong> ${event.date}</p>

<p>${event.description}</p>

<p><strong>Seats Left:</strong> ${event.seatsRemaining} / ${event.Capacity}</p>

<div class="form">

<input placeholder="Your name" id="name-${event.eventsId}" />

<input placeholder="Your email" id="email-${event.eventsId}" />

<button onclick="register('${event.eventsId}')">
Register
</button>

</div>

`;

container.appendChild(div);

});

}


function filterEvents(category){

if(category === "All"){

renderEvents(allEvents);
return;

}

const filtered = allEvents.filter(e => e.category === category);

renderEvents(filtered);

}


function register(eventId){

const name = document.getElementById(`name-${eventId}`).value;
const email = document.getElementById(`email-${eventId}`).value;

if(!name || !email){

alert("Please enter name and email");
return;

}

fetch(`${API_BASE}/register-event`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

eventId,
name,
email

})

})

.then(res=>res.json())
.then(data=>{

alert(data.message);
location.reload();

})

.catch(err=>{

console.error(err);
alert("Registration failed");

});

}