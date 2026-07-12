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

      alert("✅ Upload Successful!");

      stockItems = [];
      currentLocation = "";

      localStorage.removeItem("stockItems");
      localStorage.removeItem("currentLocation");

      document.getElementById("locationInput").value = "";
      document.getElementById("currentLocation").innerText = "---";

      displayItems();

    }else{

      alert(result.message);

    }

  })
  .catch(err=>{
    alert("Upload failed.\n" + err);
  })
  .finally(()=>{

    btn.disabled = false;
    btn.innerHTML = "📤 UPLOAD LOCATION";

  });

}
