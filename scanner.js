let scanner;


// ===============================
// START BARCODE SCANNER
// ===============================

function startScanner(){


  document.getElementById("cameraBox").style.display = "block";

  document.getElementById("closeCameraBtn").style.display = "none";

  document.getElementById("scanBtn").style.display = "none";


  scanner = new Html5Qrcode("reader");



  Html5Qrcode.getCameras().then(cameras => {


    if(cameras && cameras.length){


      let cameraId = cameras[cameras.length - 1].id;



      // FIND BACK CAMERA

      for(let cam of cameras){

        let label = cam.label.toLowerCase();


        if(
          label.includes("back") ||
          label.includes("rear") ||
          label.includes("environment")
        ){

          cameraId = cam.id;

          break;

        }

      }



      scanner.start(

        cameraId,


        {

          fps:20,


          qrbox:{
            width:320,
            height:160
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



          // STOP AFTER SUCCESS SCAN

          scanner.stop().then(()=>{


            document.getElementById("cameraBox").style.display="none";


            document.getElementById("closeCameraBtn").style.display="none";


            document.getElementById("scanBtn").style.display="block";


          });



        }


      ).then(()=>{


        // SHOW X ONLY AFTER CAMERA STARTS

        document.getElementById("closeCameraBtn").style.display="block";


      });



    }


  }).catch(error=>{


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
