const API_URL = "https://script.google.com/macros/s/AKfycbyPmYgCYVx4nhm6eqSzPG8CuD0IsC_-7SwT8K6ZH-F8dy1jA2NoHS0eJwT-5aS83OdpqQ/exec";


// ===============================
// API HELPER
// ===============================

function apiPost(data){

  return fetch(API_URL, {

    method: "POST",

    body: JSON.stringify(data)

  })
  .then(function(response){

    if(!response.ok){

      throw new Error(
        "Server error: " + response.status
      );

    }

    return response.json();

  });

}


// ===============================
// LOGIN
// ===============================

function login(){

  const usernameElement =
    document.getElementById("username");

  const passwordElement =
    document.getElementById("password");

  const messageElement =
    document.getElementById("message");

  const username =
    usernameElement.value.trim();

  const password =
    passwordElement.value.trim();


  if(username === "" || password === ""){

    messageElement.innerHTML =
      "Please enter username and password.";

    return;

  }


  const btn =
    document.getElementById("loginBtn");


  if(btn){

    btn.disabled = true;

    btn.innerHTML =
      "⏳ LOGGING IN...";

  }


  apiPost({

    action: "login",

    username: username,

    password: password

  })

  .then(function(data){

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


      window.location.href =
        "stock.html";

    }else{

      messageElement.innerHTML =
        data.message;


      if(btn){

        btn.disabled = false;

        btn.innerHTML =
          "LOGIN";

      }

    }

  })

  .catch(function(error){

    console.log(error);


    messageElement.innerHTML =
      "Connection Error";


    if(btn){

      btn.disabled = false;

      btn.innerHTML =
        "LOGIN";

    }

  });

}


// ===============================
// CHECK STOCK PAGE
// ===============================

function checkLogin(){

  const token =
    localStorage.getItem("token");


  console.log(
    "TOKEN:",
    token
  );


  if(!token){

    alert("NO TOKEN");

    window.location.href =
      "index.html";

    return;

  }


  apiPost({

    action: "checkSession",

    token: token

  })

  .then(function(data){

    console.log(
      "SESSION RESULT:",
      data
    );


    if(data.success){

      const userElement =
        document.getElementById("user");


      if(userElement){

        userElement.innerHTML =
          "👤 " +
          data.name +
          " (" +
          data.role +
          ")";

      }


      loadSession();

    }else{

      alert("INVALID SESSION");

      localStorage.clear();

      window.location.href =
        "index.html";

    }

  })

  .catch(function(error){

    console.log(
      "Session check error:",
      error
    );

    alert("Connection Error");

  });

}


// ===============================
// LOAD SESSION
// ===============================

function loadSession(){

  apiPost({

    action: "getSession"

  })

  .then(function(data){

    console.log(
      "ACTIVE SESSION:",
      data
    );


    if(data.success){

      const sessionElement =
        document.getElementById("session");


      if(sessionElement){

        sessionElement.innerHTML =
          data.session;

      }

    }

  })

  .catch(function(error){

    console.log(
      "Session load error:",
      error
    );

  });

}


// ===============================
// LOGOUT
// ===============================

function logout(){

  const token =
    localStorage.getItem("token");


  const btn =
    document.querySelector(".logout-btn");


  if(btn){

    btn.disabled = true;

    btn.innerHTML =
      "⏳ LOGGING OUT...";

  }


  if(!token){

    localStorage.clear();

    window.location.href =
      "index.html";

    return;

  }


  apiPost({

    action: "logout",

    token: token

  })

  .then(function(data){

    console.log(
      "LOGOUT RESULT:",
      data
    );


    localStorage.clear();

    window.location.href =
      "index.html";

  })

  .catch(function(error){

    console.log(error);

    localStorage.clear();

    window.location.href =
      "index.html";

  });

}


// ===============================
// HEARTBEAT
// ===============================

let heartbeatRunning = false;
let heartbeatTimer = null;


function startHeartbeat(){

  console.log(
    "HEARTBEAT STARTED"
  );


  // Prevent duplicate heartbeat timers
  if(heartbeatTimer){

    clearTimeout(
      heartbeatTimer
    );

  }


  function sendHeartbeat(){

    const token =
      localStorage.getItem("token");


    if(!token){

      return;

    }


    // Prevent overlapping heartbeat requests
    if(heartbeatRunning){

      heartbeatTimer =
        setTimeout(
          sendHeartbeat,
          300000
        );

      return;

    }


    heartbeatRunning = true;


    apiPost({

      action: "heartbeat",

      token: token

    })

    .then(function(data){

      console.log(
        "HEARTBEAT:",
        data
      );


      if(!data.success){

        localStorage.clear();

        window.location.href =
          "index.html";

        return;

      }

    })

    .catch(function(error){

      console.log(
        "Heartbeat error:",
        error
      );

    })

    .finally(function(){

      heartbeatRunning = false;


      // Schedule next heartbeat
      heartbeatTimer =
        setTimeout(
          sendHeartbeat,
          300000
        );

    });

  }


  // Start first heartbeat after 5 minutes
  heartbeatTimer =
    setTimeout(
      sendHeartbeat,
      300000
    );

}


// ===============================
// START
// ===============================

window.addEventListener(
  "load",
  function(){

    const userElement =
      document.getElementById("user");


    if(userElement){

      console.log(
        "STOCK PAGE DETECTED"
      );


      checkLogin();

      startHeartbeat();

    }

  }
);
