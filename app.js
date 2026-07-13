const API_URL = "https://script.google.com/macros/s/AKfycbyPmYgCYVx4nhm6eqSzPG8CuD0IsC_-7SwT8K6ZH-F8dy1jA2NoHS0eJwT-5aS83OdpqQ/exec";


// ===============================
// LOGIN
// ===============================

function login(){

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if(username=="" || password==""){
    document.getElementById("message").innerHTML="Please enter username and password.";
    return;
  }

  const btn=document.getElementById("loginBtn");

  if(btn){
    btn.disabled=true;
    btn.innerHTML="⏳ LOGGING IN...";
  }

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

    }else{

      document.getElementById("message").innerHTML=data.message;

      if(btn){
        btn.disabled=false;
        btn.innerHTML="LOGIN";
      }

    }

  })

  .catch(err=>{

    document.getElementById("message").innerHTML="Connection Error";

    console.log(err);

    if(btn){
      btn.disabled=false;
      btn.innerHTML="LOGIN";
    }

  });

}



// ===============================
// CHECK STOCK PAGE
// ===============================

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

    }else{

      alert("INVALID SESSION");

      localStorage.clear();

      window.location.href="index.html";

    }

  });

}



// ===============================
// LOAD SESSION
// ===============================

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



// ===============================
// LOGOUT
// ===============================

function logout(){

  let token = localStorage.getItem("token");

  if(!token){
    window.location.href="index.html";
    return;
  }


  fetch(API_URL,{

    method:"POST",

    body:JSON.stringify({

      action:"logout",
      token:token

    })

  })

  .then(res=>res.json())

  .then(data=>{

    console.log("LOGOUT RESULT:",data);


    localStorage.clear();


    window.location.href="index.html";


  })

  .catch(err=>{

    console.log(err);

    localStorage.clear();

    window.location.href="index.html";

  });

}

// ===============================
// HEARTBEAT EVERY 5 MINUTES
// ===============================

function startHeartbeat(){

  console.log("HEARTBEAT STARTED");

  setInterval(function(){


    let token = localStorage.getItem("token");


    if(token){


      fetch(API_URL,{

        method:"POST",

        body:JSON.stringify({

          action:"heartbeat",

          token:token

        })

      })

      .then(res=>res.json())

      .then(data=>{

        console.log("HEARTBEAT:",data);


        if(!data.success){

          localStorage.clear();

          window.location.href="index.html";

        }


      })

      .catch(err=>{

        console.log("Heartbeat error:",err);

      });


    }


  },10000); // 10 sec test


}

// ===============================
// START
// ===============================

window.onload=function(){

  if(document.getElementById("user")){

    console.log("STOCK PAGE DETECTED");

    checkLogin();

    startHeartbeat();

  }

}
    
