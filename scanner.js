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



      // TRY TO FIND BACK CAMERA

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
      fps:15,
    
      qrbox:{
        width:300,
        height:300
      },
    
      aspectRatio:1

        },


        (decodedText)=>{


          console.log("SCAN:",decodedText);


          let beep = new Audio(
            "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
          );

          beep.play();


          document.getElementById("barcode").innerHTML =
          decodedText;


          addBarcode(decodedText);



          scanner.stop().then(()=>{


            document.getElementById("cameraBox").style.display="none";

            document.getElementById("closeCameraBtn").style.display="none";

            document.getElementById("scanBtn").style.display="block";


          });


        }


      ).then(()=>{


        // CAMERA STARTED SUCCESSFULLY

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
