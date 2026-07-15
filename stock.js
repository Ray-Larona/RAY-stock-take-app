let currentLocation = "";

// ===============================
// LOCATION
// ===============================


function setLocation(){


let input =
document.getElementById("locationInput").value.trim();



if(input==""){

alert("Please enter location");

return;

}



currentLocation = input.toUpperCase();



localStorage.setItem(
"currentLocation",
currentLocation
);



document.getElementById("currentLocation").innerHTML =
currentLocation;



alert(
"Location set: " + currentLocation
);


}




function loadLocation(){


let saved =
localStorage.getItem("currentLocation");



if(saved){


currentLocation = saved;


let display =
document.getElementById("currentLocation");


if(display){

display.innerHTML=currentLocation;

}


}


}

let stockItems = [];


// LOAD SAVED DATA

function loadItems(){

  let saved = localStorage.getItem("stockItems");

  if(saved){

    stockItems = JSON.parse(saved);

  }

  displayItems();

}



// ADD BARCODE

function addBarcode(barcode){


  let foundIndex = stockItems.findIndex(
    item => item.barcode == barcode
  );


  if(foundIndex !== -1){


    stockItems[foundIndex].qty += 1;


    // ilipat sa taas ang scanned item

    let item = stockItems.splice(foundIndex,1)[0];

    stockItems.unshift(item);



  }else{


    stockItems.unshift({

      barcode: barcode,

      qty:1

    });


  }


  saveItems();

  displayItems();


}


// SAVE PHONE STORAGE

function saveItems(){

  localStorage.setItem(
    "stockItems",
    JSON.stringify(stockItems)
  );

}



// DISPLAY LIST

function displayItems(){


  let box = document.getElementById("itemList");


  if(!box){

    return;

  }


  box.innerHTML = "";


  stockItems.forEach((item,index)=>{


    box.innerHTML += `

    <div class="item-row">


      <div class="barcode">

        ${item.barcode}

      </div>


      <div class="qty-control">


        <button class="qty-btn"
        onclick="changeQty(${index},-1)">
        -
        </button>


        <span class="qty">
        ${item.qty}
        </span>


        <button class="qty-btn"
        onclick="changeQty(${index},1)">
        +
        </button>


      </div>


    </div>

    `;


  });



  let total = document.getElementById("total");


  if(total){

    total.innerHTML = totalItems();

  }


}



// CHANGE QTY

function changeQty(index,value){


  stockItems[index].qty += value;


  if(stockItems[index].qty <=0){

    stockItems.splice(index,1);

  }


  saveItems();

  displayItems();


}



// TOTAL

function totalItems(){


 let total=0;


 stockItems.forEach(item=>{

  total += item.qty;

 });


 return total;


}



// START

window.addEventListener(
"load",
function(){

 loadItems();

 loadLocation();

}
);

// ===============================
// CLEAR LIST
// ===============================

function clearList(){

  let confirmClear = confirm(
    "⚠️ Clear all scanned items?"
  );


  if(confirmClear){


    stockItems = [];


    localStorage.removeItem(
      "stockItems"
    );


    displayItems();


    document.getElementById("barcode").innerHTML="---";


    alert(
      "List cleared"
    );


  }


}

// ===============================
// MANUAL BARCODE INPUT
// ===============================

function manualAddBarcode(){

  let barcode =
  document.getElementById("manualBarcode").value.trim();


  if(barcode==""){

    alert("Please enter barcode");

    return;

  }


  addBarcode(barcode);


  document.getElementById("manualBarcode").value="";


}
