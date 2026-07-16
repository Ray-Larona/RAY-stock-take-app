let scanner;


// ===============================
// START BARCODE SCANNER
// ===============================

function startScanner(){


  document.getElementById("cameraBox").style.display = "block";

  document.getElementById("closeCameraBtn").style.display = "block";

  document.getElementById("scanBtn").style.display = "none";


  scanner = new Html5Qrcode("reader");



  scanner.start(

    {
      facingMode:{
        ideal:"environment"
      }
    },

    {
      fps:10,
      qrbox:250,
      aspectRatio:1.777
    },


    (decodedText)=>{


      console.log("SCAN:", decodedText);



      // BEEP

      let beep = new Audio(
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
      );

      beep.play();



      // SHOW BARCODE

      document.getElementById("barcode").innerHTML =
      decodedText;



      // ADD ITEM

      addBarcode(decodedText);



      console.log("ADDED:", decodedText);



      // AUTO CLOSE AFTER SUCCESS SCAN

      scanner.stop().then(()=>{


        document.getElementById("cameraBox").style.display="none";

        document.getElementById("closeCameraBtn").style.display="none";

        document.getElementById("scanBtn").style.display="block";


      });


    }


  ).catch(error=>{

    console.log("CAMERA ERROR:",error);

  });


}





// ===============================
// CLOSE CAMERA X
// ===============================

function stopScanner(){


  if(scanner){


    scanner.stop().then(()=>{


      document.getElementById("cameraBox").style.display="none";


      document.getElementById("closeCameraBtn").style.display="none";


      document.getElementById("scanBtn").style.display="block";


      scanner.clear();


    });


  }


}
