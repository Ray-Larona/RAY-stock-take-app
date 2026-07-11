function uploadStockTake(){


if(!currentLocation){

alert("Please set location first");

return;

}



if(stockItems.length==0){

alert("No items to upload");

return;

}



let token =
localStorage.getItem("token");



let data = {


action:"uploadStockTake",

token:token,

location:currentLocation,

items:stockItems


};



fetch(
"https://script.google.com/macros/s/AKfycbyPmYgCYVx4nhm6eqSzPG8CuD0IsC_-7SwT8K6ZH-F8dy1jA2NoHS0eJwT-5aS83OdpqQ/exec",
{

method:"POST",

body:JSON.stringify(data)

}

)

.then(res=>res.json())

.then(result=>{


if(result.success){


alert("Upload Successful");


stockItems=[];


localStorage.removeItem(
"stockItems"
);


displayItems();


}

else{


alert(result.message);


}



});


}
