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


  let found = stockItems.find(
    item => item.barcode == barcode
  );


  if(found){

    found.qty += 1;


  }else{


    stockItems.push({

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


  let box =
  document.getElementById("itemList");


  if(!box){

    return;

  }


  box.innerHTML="";


  stockItems.forEach((item,index)=>{


    box.innerHTML += `

    <div class="item">

      <b>${item.barcode}</b>

      <br>

      Qty:
      <button onclick="changeQty(${index},-1)">
      -
      </button>

      ${item.qty}

      <button onclick="changeQty(${index},1)">
      +
      </button>

    </div>

    `;


  });

document.getElementById("total").innerHTML =
totalItems();  

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
