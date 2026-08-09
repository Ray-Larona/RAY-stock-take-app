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



// ===============================
// STOCK ITEMS
// ===============================

let stockItems = [];



// ===============================
// LOAD SAVED DATA
// ===============================

function loadItems(){

  let saved =
  localStorage.getItem("stockItems");

  if(saved){

    stockItems = JSON.parse(saved);

  }

  displayItems();

}



// ===============================
// ADD BARCODE
// ===============================

function addBarcode(barcode){

  let foundIndex = stockItems.findIndex(
    item => item.barcode == barcode
  );


  if(foundIndex !== -1){

    stockItems[foundIndex].qty += 1;


    let item =
    stockItems.splice(foundIndex,1)[0];

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



// ===============================
// SAVE STORAGE
// ===============================

function saveItems(){

  localStorage.setItem(
    "stockItems",
    JSON.stringify(stockItems)
  );

}



// ===============================
// DISPLAY LIST
// ===============================
function displayItems(){

let box =
document.getElementById("itemList");

if(!box){

return;

}

box.innerHTML = "";

stockItems.forEach((item,index)=>{

box.innerHTML += `

<div class="stock-item">

  <div class="barcode-name">
    ${item.barcode}
  </div>

  <div class="qty-controls">

    <button
      onclick="changeQty(${index},-1)">
      -
    </button>

    <span
      onclick="editQty(${index})"
      style="cursor:pointer;">
      ${item.qty}
    </span>

    <button
      onclick="changeQty(${index},1)">
      +
    </button>

  </div>

</div>

`;

});

let total =
document.getElementById("total");

if(total){

total.innerHTML = totalItems();

}

}


// ===============================
// CHANGE QTY (+ / -)
// ===============================

function changeQty(index,value){

  stockItems[index].qty += value;


  if(stockItems[index].qty <=0){

    stockItems.splice(index,1);

  }


  saveItems();

  displayItems();


  // Return to Bluetooth scanner
  focusBluetoothScanner();

}

function editQty(index){

let newQty =
prompt(
"Enter quantity:",
stockItems[index].qty
);

if(newQty === null){

return;

}

newQty =
parseInt(newQty,10);

if(isNaN(newQty) || newQty <= 0){

alert("Please enter a valid quantity.");

return;

}

stockItems[index].qty =
newQty;

saveItems();

displayItems();

focusBluetoothScanner();

}
// ===============================
// DIRECT QTY INPUT
// ===============================

function setQty(index,value){

  let qty =
  parseInt(value,10);


  if(isNaN(qty) || qty <= 0){

    stockItems.splice(index,1);

  }else{

    stockItems[index].qty = qty;

  }


  saveItems();

  displayItems();


  // Return to Bluetooth scanner
  focusBluetoothScanner();

}



// ===============================
// QTY ENTER KEY
// ===============================

function qtyKeyDown(event,index,input){

  if(event.key === "Enter"){

    event.preventDefault();

    setQty(index,input.value);

  }

}



// ===============================
// BLUETOOTH SCANNER FOCUS
// ===============================

function focusBluetoothScanner(){

  let bluetoothInput =
  document.getElementById("bluetoothInput");

  if(!bluetoothInput){

    return;

  }


  let mode =
  document.querySelector(
    'input[name="scanMethod"]:checked'
  );


  if(mode && mode.value === "bluetooth"){

    setTimeout(function(){

      bluetoothInput.focus();

    },100);

  }

}



// ===============================
// TOTAL
// ===============================

function totalItems(){

  let total = 0;


  stockItems.forEach(item=>{

    total += item.qty;

  });


  return total;

}



// ===============================
// CLEAR LIST
// ===============================

function clearList(){

  let confirmClear =
  confirm(
    "⚠️ Clear all scanned items?"
  );


  if(confirmClear){

    stockItems = [];

    localStorage.removeItem(
      "stockItems"
    );


    displayItems();


    document.getElementById("barcode").innerHTML =
    "---";


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



// ===============================
// SCAN MODE
// ===============================

function changeScanMode(){

  let mode =
  document.querySelector(
    'input[name="scanMethod"]:checked'
  ).value;


  let scanBtn =
  document.getElementById("scanBtn");

  let bluetoothInput =
  document.getElementById("bluetoothInput");


  if(!scanBtn || !bluetoothInput){

    console.log(
      "Bluetooth elements missing"
    );

    return;

  }


  if(mode === "bluetooth"){

    console.log(
      "BLUETOOTH SCANNER MODE"
    );


    scanBtn.style.display="none";

    bluetoothInput.focus();

  }else{

    console.log(
      "CAMERA SCANNER MODE"
    );


    scanBtn.style.display="block";

  }

}



// ===============================
// START
// ===============================

window.addEventListener(
  "load",
  function(){

    loadItems();

    loadLocation();


    let bluetoothInput =
    document.getElementById("bluetoothInput");


    if(bluetoothInput){

      bluetoothInput.addEventListener(
        "keydown",
        function(e){

          if(e.key === "Enter"){

            let barcode =
            this.value.trim();


            if(barcode){

              console.log(
                "BLUETOOTH SCAN:",
                barcode
              );


              addBarcode(barcode);

            }


            this.value="";

            this.focus();

          }

        }

      );

    }

  }
);
