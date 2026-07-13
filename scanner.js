let scanner;

function startScanner(){


document.getElementById("reader").style.display="block";


scanner = new Html5Qrcode("reader");


Html5Qrcode.getCameras().then(cameras => {


if(cameras && cameras.length){


let cameraId = cameras[0].id;


// piliin ang rear camera

for(let cam of cameras){

  if(cam.label.toLowerCase().includes("back") ||
     cam.label.toLowerCase().includes("rear")){

    cameraId = cam.id;
    break;

  }

}



scanner.start(

cameraId,

{

fps:10,

qrbox:250,

aspectRatio:1.777

},


(decodedText)=>{


console.log("SCAN:",decodedText);


// BEEP

let beep = new Audio(
"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
);

beep.play();



// SHOW RESULT

document.getElementById("barcode").innerHTML =
decodedText;


addBarcode(decodedText);


console.log("ADDED:", decodedText);


scanner.stop();


}


);


}


});


}



function stopScanner(){


if(scanner){

scanner.stop();

}

}
