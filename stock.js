let scanner = null;
let scannerStarting = false;

// Reuse ONE audio object instead of creating a new one every scan
const scanBeep = new Audio(
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
);

scanBeep.preload = "auto";


// ===============================
// START BARCODE SCANNER
// ===============================

function startScanner(){

  // Prevent accidental double-start
  if(scanner || scannerStarting){
    return;
  }

  scannerStarting = true;


  const cameraBox =
    document.getElementById("cameraBox");

  const closeCameraBtn =
    document.getElementById("closeCameraBtn");

  const scanBtn =
    document.getElementById("scanBtn");


  if(cameraBox){
    cameraBox.style.display = "block";
  }

  if(closeCameraBtn){
    closeCameraBtn.style.display = "none";
  }

  if(scanBtn){
    scanBtn.style.display = "none";
  }


  // Create scanner
  scanner = new Html5Qrcode("reader", {

    formatsToSupport: [

      Html5QrcodeSupportedFormats.EAN_13,

      Html5QrcodeSupportedFormats.EAN_8,

      Html5QrcodeSupportedFormats.UPC_A,

      Html5QrcodeSupportedFormats.UPC_E,

      Html5QrcodeSupportedFormats.CODE_128,

      Html5QrcodeSupportedFormats.CODE_39,

      Html5QrcodeSupportedFormats.QR_CODE

    ],

    verbose: false

  });


  scanner.start(

    {
      facingMode: "environment"
    },

    {

      fps: 10,

      qrbox: function(
        viewfinderWidth,
        viewfinderHeight
      ){

        const width =
          Math.min(
            Math.floor(viewfinderWidth * 0.9),
            350
          );

        return {

          width: width,

          height:
            Math.floor(width * 0.45)

        };

      }

    },


    function(decodedText){

      console.log(
        "SCAN:",
        decodedText
      );


      // =========================
      // BEEP
      // =========================

      try{

        scanBeep.currentTime = 0;

        const beepPromise =
          scanBeep.play();

        if(beepPromise){
          beepPromise.catch(function(){
            // Ignore browser audio restrictions
          });
        }

      }catch(error){

        console.log(
          "Beep error:",
          error
        );

      }


      // =========================
      // SHOW BARCODE
      // =========================

      const barcodeElement =
        document.getElementById("barcode");

      if(barcodeElement){

        barcodeElement.textContent =
          decodedText;

      }


      // =========================
      // ADD ITEM
      // =========================

      addBarcode(decodedText);


      console.log(
        "ADDED:",
        decodedText
      );


      // =========================
      // STOP AFTER SUCCESS
      // =========================

      const activeScanner = scanner;

      if(!activeScanner){
        return;
      }


      // Prevent another successful
      // callback from processing
      scanner = null;


      activeScanner
        .stop()
        .then(function(){

          if(cameraBox){
            cameraBox.style.display = "none";
          }

          if(closeCameraBtn){
            closeCameraBtn.style.display = "none";
          }

          if(scanBtn){
            scanBtn.style.display = "block";
          }


          // Clear scanner resources
          try{

            activeScanner.clear();

          }catch(error){

            console.log(
              "Scanner clear error:",
              error
            );

          }

        })
        .catch(function(error){

          console.log(
            "Scanner stop error:",
            error
          );

          if(cameraBox){
            cameraBox.style.display = "none";
          }

          if(closeCameraBtn){
            closeCameraBtn.style.display = "none";
          }

          if(scanBtn){
            scanBtn.style.display = "block";
          }

        });

    },


    function(){

      // Ignore scan misses

    }

  )

  .then(function(){

    scannerStarting = false;


    if(closeCameraBtn){
      closeCameraBtn.style.display = "block";
    }

  })

  .catch(function(error){

    console.log(
      "CAMERA ERROR:",
      error
    );


    scannerStarting = false;
    scanner = null;


    if(cameraBox){
      cameraBox.style.display = "none";
    }

    if(scanBtn){
      scanBtn.style.display = "block";
    }


    alert(
      "Camera unavailable:\n\n" +
      error
    );

  });

}


// ===============================
// CLOSE CAMERA X
// ===============================

function stopScanner(){

  if(!scanner){
    return;
  }


  const activeScanner = scanner;

  scanner = null;


  const cameraBox =
    document.getElementById("cameraBox");

  const closeCameraBtn =
    document.getElementById("closeCameraBtn");

  const scanBtn =
    document.getElementById("scanBtn");


  activeScanner
    .stop()
    .then(function(){

      if(cameraBox){
        cameraBox.style.display = "none";
      }

      if(closeCameraBtn){
        closeCameraBtn.style.display = "none";
      }

      if(scanBtn){
        scanBtn.style.display = "block";
      }


      try{

        activeScanner.clear();

      }catch(error){

        console.log(
          "Scanner clear error:",
          error
        );

      }

    })
    .catch(function(error){

      console.log(
        "Scanner stop error:",
        error
      );


      if(cameraBox){
        cameraBox.style.display = "none";
      }

      if(closeCameraBtn){
        closeCameraBtn.style.display = "none";
      }

      if(scanBtn){
        scanBtn.style.display = "block";
      }

    });

}
