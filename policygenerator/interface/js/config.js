/*
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck

config.js starts the PrivacyFlash Pro interface; reads and analyzes the project files
 - Displays logo (on first load in session)
 - Displays disclaimer (on first load in browser)
 - Directory path dialog
 - Loading screen
*/

import { startWizard } from "./wizard.js";

export async function startGUI() {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  let result = await showBootLogo()

  if (result) {
    $('#boot').fadeIn('slow', function() {
    setTimeout(function() {
      $('#boot').fadeOut('slow', function() {
        consent()
      })}, 1500);
    })
  } else {
    consent()
  }
}

async function consent() {
    $("#consent").fadeIn("slow", function () {
      $("#agree").click(function () {
          let ag = $("input[name='age']:checked").val();
          let ud = $("input[name='understand']:checked").val();
          let pa = $("input[name='participate']:checked").val();
          if(ag==null){
            window.alert("Please make sure you are 18 years old");
            return
          }
          if(ud == null){
            window.alert("Please read and understand the consent form");
            return
          }
          if(pa == null){
            window.alert("Please agree to take part in the survey");
            return
          }
        $("#consent").fadeOut("slow",function () {
          disclaimer()
        })
      });
    });
}

async function disclaimer() {
  let result = await readDisclaimer()
  if (!result) {
    $("#disclaimer").fadeIn("slow", function () {
      $("#disclaimer-btn").click(function () {
        updateDisclaimer()
        inputPath();
      });
    });
  } else {
    inputPath();
  }
}

function inputPath() {
  $("#disclaimer").fadeOut("slow", function () {
      
      $("#disclaimer").remove();
      $("#directoryPicker").fadeIn("slow", function () {

        $("#path").click(async function () {
          const dir = await showFolderDialog()
          if (dir != null && dir.length !== 0) {
            $("#path").val(dir);
            $("#path").removeClass("invalid text-danger").addClass("focus");
            $(".validation").addClass("d-none");
          }
         })

        /*$("#csvpath").click(async function () {
          const dir = await showFolderDialog()
          if (dir != null && dir.length !== 0) {
            $("#csvpath").val(dir);
            $("#csvpath").removeClass("invalid text-danger").addClass("focus");
            $(".validation").addClass("d-none");
          }
         })*/

        $("#generate").click(async function () {
          let val = $("#path").val();
          // let csvVal = $("#csvpath").val();
          const result = await validate(val)

          /*let ag = $("input[name='age']:checked").val();
          let ud = $("input[name='understand']:checked").val();
          let pa = $("input[name='participate']:checked").val();
          if(ag==null){
            window.alert("Please make sure you are 18 years old");
            return
          }
          if(ud == null){
            window.alert("Please read and understand the consent form");
            return
          }
          if(pa == null){
            window.alert("Please agree to take part in the survey");
            return
          }*/

            if (result) {
              spinner(val + "/", "");
            } else {
              $("#path").addClass("invalid text-danger").removeClass("focus");
              $(".validation").removeClass("d-none");
            }

        });
      });
    });
}

function spinner(d,csvD) {
  $("#directoryPicker").fadeOut("slow", function () {
    $("#directoryPicker").remove();
    $("#spinner").fadeIn("slow", async function () {
      const result = await main(d,csvD)
      let practices = result[0];
      let sdks = result[1];
      let sdkPractices = result[2];
      $("#spinner").fadeOut("slow", function () {
        startWizard(practices, sdks, sdkPractices);
      });
    });
  });
}
