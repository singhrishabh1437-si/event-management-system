const API_BASE = "https://hpnic54jx1.execute-api.ap-south-1.amazonaws.com/prod";


/* LOAD EVENTS */

function loadEvents(){

fetch(`${API_BASE}/events`)
.then(res => res.json())
.then(events => {

const container=document.getElementById("events");
container.innerHTML="";

events.forEach(event=>{

const div=document.createElement("div");
div.className="event";

div.innerHTML=`

<h3>${event.title}</h3>

<p>${event.date}</p>

<p>${event.description}</p>

<p>Capacity: ${event.capacity}</p>

<button onclick="deleteEvent('${event.eventsId}')">
Delete
</button>

`;

container.appendChild(div);

});

});

}


/* CREATE EVENT */

function createEvent(){

const title=document.getElementById("title").value;
const date=document.getElementById("date").value;
const description=document.getElementById("description").value;
const capacity=parseInt(document.getElementById("capacity").value);

fetch(`${API_BASE}/create-event`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title,
date,
description,
capacity
})

})
.then(res=>res.json())
.then(data=>{

alert("Event created");

loadEvents();

});

}


/* DELETE EVENT */

function deleteEvent(id){

fetch(`${API_BASE}/delete-event/${id}`,{
method:"DELETE"
})
.then(res=>res.json())
.then(()=>{

loadEvents();

});

}


/* INITIAL LOAD */

loadEvents();