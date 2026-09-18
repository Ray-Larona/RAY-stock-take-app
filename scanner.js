let scanner = null;
let scannerStarting = false;
let scanProcessed = false;


// ===============================
// REUSE BEEP
// ===============================

const scanBeep = new Audio(
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
);

scanBeep.preload = "auto";


// ===============================
// START BARCODE SCANNER
// ===============================

function startScanner(){

  if(scanner || scannerStarting){
    return;
  }

  scannerStarting = true;
  scanProcessed = false;


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

      // Prevent duplicate callback
      if(scanProcessed){
        return;
      }

      scanProcessed = true;


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
            // Ignore browser audio restriction
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
      // STOP CAMERA
      // =========================

      const activeScanner =
        scanner;


      if(!activeScanner){

        finishScannerUI();

        return;

      }


      activeScanner
        .stop()

        .then(function(){

          console.log(
            "CAMERA STOPPED"
          );


          // Clear scanner resources
          try{

            activeScanner.clear();

          }catch(error){

            console.log(
              "Scanner clear error:",
              error
            );

          }


          scanner = null;

          scannerStarting = false;

          finishScannerUI();

        })

        .catch(function(error){

          console.log(
            "Scanner stop error:",
            error
          );


          // Even if stop reports an error,
          // restore the original UI.
          scanner = null;

          scannerStarting = false;

          finishScannerUI();

        });

    },


    function(){

      // Ignore scan misses

    }

  )

  .then(function(){

    scannerStarting = false;


    // Only show X while camera is actually running
    if(
      scanner &&
      !scanProcessed &&
      closeCameraBtn
    ){

      closeCameraBtn.style.display = "block";

    }

  })

  .catch(function(error){

    console.log(
      "CAMERA ERROR:",
      error
    );


    scanner = null;

    scannerStarting = false;
    scanProcessed = false;


    if(cameraBox){
      cameraBox.style.display = "none";
    }

    if(closeCameraBtn){
      closeCameraBtn.style.display = "none";
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
// FINISH CAMERA UI
// ===============================

function finishScannerUI(){

  const cameraBox =
    document.getElementById("cameraBox");

  const closeCameraBtn =
    document.getElementById("closeCameraBtn");

  const scanBtn =
    document.getElementById("scanBtn");


  if(cameraBox){

    cameraBox.style.display =
      "none";

  }

  if(closeCameraBtn){

    closeCameraBtn.style.display =
      "none";

  }

  if(scanBtn){

    scanBtn.style.display =
      "block";

  }


  scanProcessed = false;

}


// ===============================
// CLOSE CAMERA X
// ===============================

function stopScanner(){

  if(!scanner){
    return;
  }


  const activeScanner =
    scanner;


  const cameraBox =
    document.getElementById("cameraBox");

  const closeCameraBtn =
    document.getElementById("closeCameraBtn");

  const scanBtn =
    document.getElementById("scanBtn");


  // Prevent another scan callback
  scanProcessed = true;


  activeScanner
    .stop()

    .then(function(){

      try{

        activeScanner.clear();

      }catch(error){

        console.log(
          "Scanner clear error:",
          error
        );

      }


      scanner = null;

      scannerStarting = false;


      if(cameraBox){
        cameraBox.style.display = "none";
      }

      if(closeCameraBtn){
        closeCameraBtn.style.display = "none";
      }

      if(scanBtn){
        scanBtn.style.display = "block";
      }


      scanProcessed = false;

    })

    .catch(function(error){

      console.log(
        "Scanner stop error:",
        error
      );


      scanner = null;

      scannerStarting = false;


      if(cameraBox){
        cameraBox.style.display = "none";
      }

      if(closeCameraBtn){
        closeCameraBtn.style.display = "none";
      }

      if(scanBtn){
        scanBtn.style.display = "block";
      }


      scanProcessed = false;

    });

}
