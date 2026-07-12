function uploadStockTake(){

  if(!currentLocation){
    alert("Please set location first");
    return;
  }


  if(stockItems.length==0){
    alert("No items to upload");
    return;
  }


  const btn = document.getElementById("uploadBtn");


  btn.disabled = true;
  btn.innerHTML = "⏳ UPLOADING...";


  const token = localStorage.getItem("token");


  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({

      action:"uploadStockTake",

      token:token,

      location:currentLocation,

      items:stockItems

    })

  })


  .then(res=>res.json())


  .then(result=>{


    if(result.success){

      console.log("LOCATION BEFORE CLEAR:", currentLocation);
console.log("SAVED LOCATION:", localStorage.getItem("currentLocation"));

      alert(
        "✅ Upload Successful!\n\nBatch: "
        + result.batchID
      );


      // CLEAR ONLY ITEMS

      stockItems = [];


      localStorage.removeItem("stockItems");


      // KEEP LOCATION


      displayItems();


      const barcodeText =
      document.getElementById("barcode");


      if(barcodeText){

        barcodeText.innerText="---";

      }


      const total =
      document.getElementById("total");


      if(total){

        total.innerText="0";

      }


    }

    else{


      alert(result.message);


    }


  })


  .catch(err=>{


    alert(
      "Upload failed.\n" + err
    );


  })


  .finally(()=>{


    btn.disabled = false;

    btn.innerHTML =
    "📤 UPLOAD LOCATION";


  });


}
