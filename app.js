const API_URL = "https://script.google.com/macros/s/AKfycbyPmYgCYVx4nhm6eqSzPG8CuD0IsC_-7SwT8K6ZH-F8dy1jA2NoHS0eJwT-5aS83OdpqQ/exec";



function login(){


const username =
document.getElementById("username").value;


const password =
document.getElementById("password").value;



document.getElementById("message").innerHTML =
"Logging in...";



fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"login",

username:username,

password:password

})

})


.then(response=>response.json())


.then(data=>{


console.log(data);



if(data.success){


localStorage.setItem(
"token",
data.token
);


localStorage.setItem(
"name",
data.name
);


localStorage.setItem(
"role",
data.role
);


document.getElementById("message").innerHTML =
"Welcome " + data.name;


// GO TO STOCK PAGE

setTimeout(function(){

window.location.href="stock.html";

},1000);


}
else{


document.getElementById("message").innerHTML =
data.message;


}



})


.catch(error=>{


document.getElementById("message").innerHTML =
"Connection Error";


console.log(error);


});


}
function checkLogin(){


let token = localStorage.getItem("token");


if(!token){

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


if(data.success){


document.getElementById("user").innerHTML =
"👤 " + data.name + " (" + data.role + ")";


loadSession();


}

else{


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


if(data.success){


document.getElementById("session").innerHTML =
data.session;


}


});


}





function logout(){


let token =
localStorage.getItem("token");


fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"logout",

token:token

})

})

.then(()=>{


localStorage.clear();

window.location.href="index.html";


});


}

