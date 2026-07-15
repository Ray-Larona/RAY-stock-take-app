let scanner;


// ===============================
// START BARCODE SCANNER
// ===============================

function startScanner(){


  document.getElementById("cameraBox").style.display="block";

  document.getElementById("scanBtn").style.display="none";


  scanner = new Html5Qrcode("reader");



  Html5Qrcode.getCameras().then(cameras => {


    if(cameras && cameras.length){


      let cameraId = cameras[0].id;



      // piliin ang rear camera

      for(let cam of cameras){


        if(
          cam.label.toLowerCase().includes("back") ||
          cam.label.toLowerCase().includes("rear")
        ){

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



          // STOP AFTER SCAN

          scanner.stop().then(()=>{


            document.getElementById("cameraBox").style.display="none";


            document.getElementById("scanBtn").style.display="block";


          });



        }


      );


    }


  });


}





// ===============================
// CLOSE CAMERA BUTTON (X)
// ===============================

function stopScanner(){


  if(scanner){


    scanner.stop().then(()=>{


      document.getElementById("cameraBox").style.display="none";


      document.getElementById("scanBtn").style.display="block";


      scanner.clear();


    });


  }


}
