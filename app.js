const API_URL = "https://script.google.com/macros/s/AKfycbyPmYgCYVx4nhm6eqSzPG8CuD0IsC_-7SwT8K6ZH-F8dy1jA2NoHS0eJwT-5aS83OdpqQ/exec";


// LOGIN

function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;


fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"login",
username:username,
password:password

})

})

.then(res=>res.json())

.then(data=>{


console.log(data);


if(data.success){


localStorage.setItem("token",data.token);
localStorage.setItem("name",data.name);
localStorage.setItem("role",data.role);


window.location.href="stock.html";


}
else{

document.getElementById("message").innerHTML=data.message;

}


});


}




// CHECK STOCK PAGE

function checkLogin(){


let token = localStorage.getItem("token");


console.log("TOKEN:",token);



if(!token){

alert("NO TOKEN");

window.location.href="index.html";

return;

}



fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"checkSession",

token:token

})

})


.then(res=>res.json())

.then(data=>{


console.log("SESSION RESULT:",data);



if(data.success){


document.getElementById("user").innerHTML =
"👤 "+data.name+" ("+data.role+")";



loadSession();


}

else{


alert("INVALID SESSION");

localStorage.clear();

window.location.href="index.html";


}



});


}





function loadSession(){


fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"getSession"

})

})


.then(res=>res.json())

.then(data=>{


console.log("ACTIVE SESSION:",data);



if(data.success){


document.getElementById("session").innerHTML =
data.session;


}


});


}




function logout(){


localStorage.clear();

window.location.href="index.html";


}




window.onload=function(){


if(document.getElementById("user")){

console.log("STOCK PAGE DETECTED");

checkLogin();

}


}
