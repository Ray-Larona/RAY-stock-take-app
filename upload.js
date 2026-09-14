async function uploadStockTake(){

  // =========================================================
  // PRE-CHECK
  // =========================================================

  if(!currentLocation){
    alert("Please set location first");
    return;
  }

  if(stockItems.length === 0){
    alert("No items to upload");
    return;
  }


  // =========================================================
  // GET BUTTON
  // =========================================================

  const btn = document.getElementById("uploadBtn");


  // =========================================================
  // EXTRA LOCK
  // Prevent double upload even if function is triggered twice
  // =========================================================

  if(btn.dataset.uploading === "true"){
    return;
  }


  // LOCK IMMEDIATELY

  btn.dataset.uploading = "true";
  btn.disabled = true;
  btn.innerHTML = "⏳ UPLOADING...";


  // =========================================================
  // SAVE CURRENT DATA
  // Prevent changes to the upload data while uploading
  // =========================================================

  const uploadLocation = currentLocation;

  const uploadItems = stockItems.slice();

  const token = localStorage.getItem("token");


  try{

    // =======================================================
    // SEND UPLOAD
    // =======================================================

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },

      body: JSON.stringify({

        action: "uploadStockTake",

        token: token,

        location: uploadLocation,

        items: uploadItems

      })

    });


    // =======================================================
    // CHECK SERVER RESPONSE
    // =======================================================

    if(!response.ok){

      throw new Error(
        "Server error: " + response.status
      );

    }


    const result = await response.json();


    // =======================================================
    // SUCCESS
    // =======================================================

    if(result.success){

      alert(
        "✅ Upload Successful!\n\nBatch: "
        + result.batchID
      );


      // -----------------------------------------------------
      // CLEAR ONLY ITEMS
      // -----------------------------------------------------

      stockItems = [];

      localStorage.removeItem("stockItems");


      // -----------------------------------------------------
      // KEEP LOCATION
      // -----------------------------------------------------

      displayItems();


      // -----------------------------------------------------
      // RESET BARCODE DISPLAY
      // -----------------------------------------------------

      const barcodeText =
        document.getElementById("barcode");

      if(barcodeText){

        barcodeText.innerText = "---";

      }


      // -----------------------------------------------------
      // RESET TOTAL
      // -----------------------------------------------------

      const total =
        document.getElementById("total");

      if(total){

        total.innerText = "0";

      }

    }

    else{

      alert(
        result.message || "Upload failed"
      );

    }


  }

  catch(err){

    alert(
      "Upload failed.\n" + err.message
    );

  }

  finally{

    // =======================================================
    // UNLOCK ONLY AFTER UPLOAD REQUEST IS COMPLETELY FINISHED
    // =======================================================

    btn.dataset.uploading = "false";

    btn.disabled = false;

    btn.innerHTML =
      "📤 UPLOAD LOCATION";

  }

}
