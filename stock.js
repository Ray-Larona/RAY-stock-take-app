let currentLocation = "";

let stockItems = [];

// Cache DOM elements
let itemListBox = null;
let totalElement = null;
let currentLocationElement = null;
let bluetoothInputElement = null;
let barcodeElement = null;


// ===============================
// LOCATION
// ===============================

function setLocation(){

  const input =
    document.getElementById("locationInput").value.trim();

  if(input === ""){

    alert("Please enter location");
    return;

  }

  currentLocation = input.toUpperCase();

  localStorage.setItem(
    "currentLocation",
    currentLocation
  );

  if(!currentLocationElement){
    currentLocationElement =
      document.getElementById("currentLocation");
  }

  if(currentLocationElement){
    currentLocationElement.textContent =
      currentLocation;
  }

  alert("Location set: " + currentLocation);
}


function loadLocation(){

  const saved =
    localStorage.getItem("currentLocation");

  if(saved){

    currentLocation = saved;

    if(!currentLocationElement){
      currentLocationElement =
        document.getElementById("currentLocation");
    }

    if(currentLocationElement){
      currentLocationElement.textContent =
        currentLocation;
    }

  }

}


// ===============================
// LOAD SAVED DATA
// ===============================

function loadItems(){

  const saved =
    localStorage.getItem("stockItems");

  if(saved){

    try{

      stockItems = JSON.parse(saved);

      if(!Array.isArray(stockItems)){
        stockItems = [];
      }

    }catch(error){

      console.log(
        "Unable to load saved stock items:",
        error
      );

      stockItems = [];

    }

  }

  displayItems();

}


// ===============================
// ADD BARCODE
// ===============================

function addBarcode(barcode){

  barcode = String(barcode).trim();

  if(barcode === ""){
    return;
  }


  let foundIndex = -1;

  for(let i = 0; i < stockItems.length; i++){

    if(stockItems[i].barcode == barcode){

      foundIndex = i;
      break;

    }

  }


  if(foundIndex !== -1){

    stockItems[foundIndex].qty += 1;


    // Move scanned item to top
    if(foundIndex !== 0){

      const item =
        stockItems.splice(foundIndex, 1)[0];

      stockItems.unshift(item);

    }

  }else{

    stockItems.unshift({

      barcode: barcode,
      qty: 1

    });

  }


  saveItems();
  displayItems();

}


// ===============================
// SAVE STORAGE
// ===============================

function saveItems(){

  try{

    localStorage.setItem(
      "stockItems",
      JSON.stringify(stockItems)
    );

  }catch(error){

    console.log(
      "Local storage error:",
      error
    );

  }

}


// ===============================
// DISPLAY LIST
// ===============================

function displayItems(){

  if(!itemListBox){
    itemListBox =
      document.getElementById("itemList");
  }

  if(!itemListBox){
    return;
  }


  // Build entire HTML in memory first.
  // This avoids repeated innerHTML += operations.
  let html = "";

  for(let index = 0; index < stockItems.length; index++){

    const item = stockItems[index];

    html +=
    '<div class="item-row">' +

      '<div class="barcode">' +
        escapeHtml(item.barcode) +
      '</div>' +

      '<div class="qty-control">' +

        '<button ' +
          'class="qty-btn" ' +
          'onclick="changeQty(' + index + ',-1)">' +
          '-' +
        '</button>' +

        '<span ' +
          'class="qty" ' +
          'onclick="editQty(' + index + ')" ' +
          'style="cursor:pointer;">' +
          item.qty +
        '</span>' +

        '<button ' +
          'class="qty-btn" ' +
          'onclick="changeQty(' + index + ',1)">' +
          '+' +
        '</button>' +

      '</div>' +

    '</div>';

  }


  itemListBox.innerHTML = html;


  if(!totalElement){
    totalElement =
      document.getElementById("total");
  }

  if(totalElement){
    totalElement.textContent = totalItems();
  }

}


// ===============================
// SAFE HTML
// ===============================

function escapeHtml(value){

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ===============================
// CHANGE QTY (+ / -)
// ===============================

function changeQty(index, value){

  if(!stockItems[index]){
    return;
  }

  stockItems[index].qty += value;


  if(stockItems[index].qty <= 0){

    stockItems.splice(index, 1);

  }


  saveItems();
  displayItems();

  focusBluetoothScanner();

}


// ===============================
// EDIT QTY
// ===============================

function editQty(index){

  if(!stockItems[index]){
    return;
  }

  const newQty =
    prompt(
      "Enter quantity:",
      stockItems[index].qty
    );

  if(newQty === null){
    return;
  }


  const parsedQty =
    parseInt(newQty, 10);


  if(isNaN(parsedQty) || parsedQty <= 0){

    alert("Please enter a valid quantity.");
    return;

  }


  stockItems[index].qty =
    parsedQty;

  saveItems();
  displayItems();

  focusBluetoothScanner();

}


// ===============================
// DIRECT QTY INPUT
// ===============================

function setQty(index, value){

  if(!stockItems[index]){
    return;
  }

  const qty =
    parseInt(value, 10);


  if(isNaN(qty) || qty <= 0){

    stockItems.splice(index, 1);

  }else{

    stockItems[index].qty = qty;

  }


  saveItems();
  displayItems();

  focusBluetoothScanner();

}


// ===============================
// QTY ENTER KEY
// ===============================

function qtyKeyDown(event, index, input){

  if(event.key === "Enter"){

    event.preventDefault();

    setQty(index, input.value);

  }

}


// ===============================
// BLUETOOTH SCANNER FOCUS
// ===============================

function focusBluetoothScanner(){

  if(!bluetoothInputElement){

    bluetoothInputElement =
      document.getElementById("bluetoothInput");

  }

  if(!bluetoothInputElement){
    return;
  }


  const mode =
    document.querySelector(
      'input[name="scanMethod"]:checked'
    );


  if(mode && mode.value === "bluetooth"){

    setTimeout(function(){

      bluetoothInputElement.focus();

    }, 100);

  }

}


// ===============================
// TOTAL
// ===============================

function totalItems(){

  let total = 0;

  for(let i = 0; i < stockItems.length; i++){

    total += Number(stockItems[i].qty) || 0;

  }

  return total;

}


// ===============================
// CLEAR LIST
// ===============================

function clearList(){

  const confirmClear =
    confirm(
      "⚠️ Clear all scanned items?"
    );


  if(!confirmClear){
    return;
  }


  stockItems = [];

  localStorage.removeItem(
    "stockItems"
  );


  displayItems();


  if(!barcodeElement){

    barcodeElement =
      document.getElementById("barcode");

  }

  if(barcodeElement){

    barcodeElement.textContent =
      "---";

  }


  alert("List cleared");

}


// ===============================
// MANUAL BARCODE INPUT
// ===============================

function manualAddBarcode(){

  const input =
    document.getElementById("manualBarcode");

  if(!input){
    return;
  }


  const barcode =
    input.value.trim();


  if(barcode === ""){

    alert("Please enter barcode");
    return;

  }


  addBarcode(barcode);

  input.value = "";

}


// ===============================
// SCAN MODE
// ===============================

function changeScanMode(){

  const selected =
    document.querySelector(
      'input[name="scanMethod"]:checked'
    );


  if(!selected){
    return;
  }


  const mode = selected.value;


  const scanBtn =
    document.getElementById("scanBtn");

  const bluetoothInput =
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

    scanBtn.style.display = "none";

    bluetoothInput.focus();

  }else{

    console.log(
      "CAMERA SCANNER MODE"
    );

    scanBtn.style.display = "block";

  }

}


// ===============================
// START
// ===============================

window.addEventListener(
  "load",
  function(){

    // Cache frequently used elements
    itemListBox =
      document.getElementById("itemList");

    totalElement =
      document.getElementById("total");

    currentLocationElement =
      document.getElementById("currentLocation");

    bluetoothInputElement =
      document.getElementById("bluetoothInput");

    barcodeElement =
      document.getElementById("barcode");


    loadItems();

    loadLocation();


    if(bluetoothInputElement){

      bluetoothInputElement.addEventListener(
        "keydown",
        function(e){

          if(e.key === "Enter"){

            e.preventDefault();

            const barcode =
              this.value.trim();


            if(barcode){

              console.log(
                "BLUETOOTH SCAN:",
                barcode
              );

              addBarcode(barcode);

            }


            this.value = "";

            this.focus();

          }

        }
      );

    }

  }
);
