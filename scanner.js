let scanner;


// ===============================
// START BARCODE SCANNER
// ===============================

function startScanner(){


  document.getElementById("cameraBox").style.display = "block";

  document.getElementById("closeCameraBtn").style.display = "none";

  document.getElementById("scanBtn").style.display = "none";


  scanner = new Html5Qrcode("reader", {

    formatsToSupport:[

      Html5QrcodeSupportedFormats.EAN_13,

      Html5QrcodeSupportedFormats.EAN_8,

      Html5QrcodeSupportedFormats.UPC_A,

      Html5QrcodeSupportedFormats.UPC_E,

      Html5QrcodeSupportedFormats.CODE_128,

      Html5QrcodeSupportedFormats.CODE_39,

      Html5QrcodeSupportedFormats.QR_CODE

    ],

    verbose:false

  });



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


      }


    },


    (decodedText)=>{


      console.log("SCAN:",decodedText);



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



      console.log("ADDED:",decodedText);



      // STOP AFTER SUCCESS SCAN

      scanner.stop().then(()=>{


        document.getElementById("cameraBox").style.display="none";


        document.getElementById("closeCameraBtn").style.display="none";


        document.getElementById("scanBtn").style.display="block";


      });



    },


    function(){


      // ignore scan misses


    }


  )


  .then(()=>{


    document.getElementById("closeCameraBtn").style.display="block";


  })


  .catch(error=>{


    console.log("CAMERA ERROR:",error);


    alert(
      "Camera unavailable:\n\n" + error
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
