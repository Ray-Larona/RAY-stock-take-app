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

}

);
