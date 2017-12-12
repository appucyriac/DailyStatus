let newRowFlag = false;;
let isAdded = false;
$(document).ready(() => {
  addPrevSevenDays(); // previous 7 days are added to date dropdown
  if (localStorage.getItem('empLog') !== null) {
    let jsonData = JSON.parse(localStorage.getItem("empLog"));
    let arrayLength = ((jsonData.length) - 1);
    jsonData.forEach((value) => {
      repeatRow(arrayLength);//display my history rows
      arrayLength--;
    });
  }
  $("#hours").val(8);
  $.getJSON('resources/employee-log.json', (data) => {
    let arrayLength = data.projects.length;
    data.projects.forEach((value) => {
      next = data.projects[arrayLength - 1].title;
      $("#emp-project").append("<option value=" + next + ">" + next + "</option>");//projects are appended
      arrayLength--;
    });
  });
});

/** Counts input characters in activity description**/
charCounter = () => {
  let max = 180;
  let len = $('.activity-descr').val().length;
  if (len <= max) {
    $('#character-counter')[0].innerHTML = max - len;
  }
}
/** Saves input data **/
storeInput = () => {

  let empStatus = {
    date: $("#log-date option:selected").attr('value'),
    project: $("#emp-project option:selected").attr('value'),
    activityType: $("#emp-activity-type option:selected").attr('value'),
    timeSpent: $("#hours option:selected").attr('value') + ":" + $("#minutes option:selected").attr('value'),
    activityDesc: $(".activity-descr")[0].value
  }
  if (localStorage.getItem('empLog') === null) {
    let empLog = [];
    empLog.push(empStatus);
    localStorage.setItem('empLog', JSON.stringify(empLog));
  } else {
    let empLog = JSON.parse(localStorage.getItem("empLog"));
    empLog.push(empStatus);

    localStorage.setItem('empLog', JSON.stringify(empLog));
    newRowFlag = true;
  }
  isAdded = true;
  $.getJSON("resources/employee-log.json", (data) => {
    data.bursts[0].push(JSON.parse(localStorage.getItem("empLog")));
  });
  repeatRow((JSON.parse(localStorage.getItem("empLog"))).length - 1);//for displaying the newly saved row

}

/** Displays my history row**/
repeatRow = (rowNumber) => {
  let tempdt = new Date();
  tempdt = tempdt.toString();
  curDate = tempdt.substring(4, 15);
  curTime = tempdt.substring(16, 24);
  let clone = $("#emp-log-row").clone(true);
  retrievedData = JSON.parse(localStorage.getItem("empLog"));
  clone.find(".logged-date")[0].innerHTML = retrievedData[rowNumber].date;
  clone.find(".log-time")[0].innerHTML = retrievedData[rowNumber].timeSpent + " hour(s)";
  clone.find(".log-descr")[0].innerHTML = retrievedData[rowNumber].activityDesc;
  clone.find(".log-activity")[0].innerHTML = retrievedData[rowNumber].activityType;
  clone.find(".log-project")[0].innerHTML = retrievedData[rowNumber].project;
  clone.find(".post-date")[0].innerHTML = "posted on:" + curDate;
  clone.find(".post-time")[0].innerHTML = curTime;
  clone.attr("id", "cloned-row-" + rowNumber); /*new id is assigned to cloned row*/
  if (newRowFlag) {
    id = "#cloned-row-" + (rowNumber - 1);
    clone.insertBefore(id);
  } //the newly saved row  will be showed on top
  else
    clone.insertBefore("#emp-log-row"); //for displaying all rows on each page load
}

/**'activity description' and 'time spent' are validated**/
validateInput = () => {

  $("#max-limit-warning").hide()
  $("#min-limit-warning").hide();
  if ($(".activity-descr")[0].value == "") { //validate activity description
    var input = $(".activity-descr");
    if (!input.val()) {
      input.css("border", "1px solid #D56161");
      input.css("background-color", "rgb(255, 240, 240)");
      $("#empty-warning").show();
    }
  } else {
    if (($("#hours option:selected").attr('value') == "16") && ($("#minutes option:selected").attr('value') != "0")) { //validate time spent 
      $("#max-limit-warning").show(); // 16.00 is the maximum limit
    } else if ((($("#hours option:selected").attr('value') == "0") && ($("#minutes option:selected").attr('value') == "0"))) {
      $("#min-limit-warning").show(); //time spent cant be zero
    } else if ($("#hours option:selected").attr('value') != "16") {
      retrievedData = JSON.parse(localStorage.getItem("empLog"));
      if (retrievedData === null) {
        retrievedData = [];
      }
      let arrayLength = ((retrievedData.length) - 1);
      let totalHours = parseInt($("#hours option:selected").attr('value'));
      let totalMinutes = parseInt($("#minutes option:selected").attr('value'));
      retrievedData.forEach((value) => {
        if (retrievedData[arrayLength].date == $("#log-date option:selected").attr('value')) {
          let temp = retrievedData[arrayLength].timeSpent.toString(); //getting already saved hours for the day
          totalHours += parseInt(temp.substring(0, temp.indexOf(":"))); //total hours charged for the day
          totalMinutes += parseInt(temp.substring(temp.indexOf(":") + 1, temp.indexOf(":") + 3)) + parseInt($("#minutes option:selected").attr('value'));
          if (totalMinutes > 60) {
            totalHours += 1;
          }

        }
        arrayLength--;
      });
      if (totalHours > 16) {
        $("#max-limit-warning").show();
      } else {
        storeInput();
        $("#log-form")[0].reset();
        if (totalHours < 8) //remaining hours that can be charged for a day  will be slected as default.
        {
          $("#hours").val((8 - totalHours));
        }
        showSuccessToaster();
      }
    }

  }
}

/**Previous 7 days are added **/
addPrevSevenDays = () => {
  let days=[0,1,2,3,4,5,6,];
  for (const value of days) {
    let currentDate = new Date();
    currentDate.setDate((currentDate.getDate()) - value);
    let next = [currentDate.getDate(), (currentDate.getMonth() + 1), currentDate.getFullYear()].join("/");
    $("#log-date").append("<option value=" + next + ">" + next + "</option>");
  }
}

/**Shows the success toaster */
let showSuccessToaster = () => {

  if (isAdded) {
    $("#successToaster").fadeIn();
    setTimeout(() => {
      $("#successToaster").fadeOut();
      isAdded = false;
    }, 2000)
  }
}