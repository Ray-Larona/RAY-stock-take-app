let scanner;


// ===============================
// START BARCODE SCANNER
// ===============================

function startScanner(){


  document.getElementById("cameraBox").style.display = "block";

  document.getElementById("closeCameraBtn").style.display = "none";

  document.getElementById("scanBtn").style.display = "none";


  scanner = new Html5Qrcode("reader");



  scanner.start(

    {
      facingMode:"environment"
    },


    {

      fps:10,


      qrbox:function(viewfinderWidth, viewfinderHeight){


        let width = Math.min(
          Math.floor(viewfinderWidth * 0.9),
          350
        );


        return {

          width:width,

          height:Math.floor(width * 0.45)

        };


      },


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


  ).then(()=>{


    // CAMERA START SUCCESS

    document.getElementById("closeCameraBtn").style.display="block";


  })


  .catch(error=>{


    console.log("CAMERA ERROR:",error);


    alert(
      "CAMERA ERROR:\n\n" + error
    );


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
