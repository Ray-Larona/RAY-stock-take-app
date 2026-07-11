let scanner;

function startScanner(){


document.getElementById("reader").style.display="block";


scanner = new Html5Qrcode("reader");


scanner.start(

{
  facingMode:"environment"
},

{
  fps:10,
  qrbox:250
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

scanner.stop();


}

);


}



function stopScanner(){


if(scanner){

scanner.stop();

}

}
