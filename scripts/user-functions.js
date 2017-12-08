
$(document).ready(() => {
  addPrevSevenDays();
  if (localStorage.getItem('empLog') !== null) {
    let jsonData = JSON.parse(localStorage.getItem("empLog"));
    let arrayLength = ((jsonData.length) - 1);
    jsonData.forEach((value) => {
      repeatRow(arrayLength);
      arrayLength--;
    });
  }
  $("#empty-warning").hide();
  $("#hours").val(8);
});


charCounter = () => {
  let max = 180;
  let len = $('#activity-descr').val().length;
  if (len <= max) {
    $('#character-counter')[0].innerHTML = max - len;
  }
}
storeInput = () => {
  let empStatus = {
    date: $("#log-date option:selected").attr('value'),
    project: $("#emp-project option:selected").attr('value'),
    activityType: $("#emp-activity-type option:selected").attr('value'),
    timeSpent: $("#hours option:selected").attr('value') + ":" + $("#minutes option:selected").attr('value'),
    activityDesc: $("#activity-descr")[0].value
  }
  if (localStorage.getItem('empLog') === null) {
    let empLog = [];
    empLog.push(empStatus);
    localStorage.setItem('empLog', JSON.stringify(empLog));
  } else {
    let empLog = JSON.parse(localStorage.getItem("empLog"));
    empLog.push(empStatus);

    localStorage.setItem('empLog', JSON.stringify(empLog));
  }
  localStorage.setItem('isAdded', JSON.stringify(true));
  $.getJSON("resources/employee-log.json", function(data) {
    data.bursts.push(JSON.parse(empLog));
  });
}

repeatRow = (rowNumber) => {
  let tempdt = new Date();
  tempdt = tempdt.toString();
  curDate = tempdt.substring(4, 15);
  curTime = tempdt.substring(16, 24);
  let clone = $("#emp-log-row").clone(true);
  retrievedData = JSON.parse(localStorage.getItem("empLog"));
  clone.find(".logged-date")[0].innerHTML = retrievedData[rowNumber].date;
  clone.find(".log-time")[0].innerHTML = retrievedData[rowNumber].timeSpent+" hour(s)";
  clone.find(".log-descr")[0].innerHTML = retrievedData[rowNumber].activityDesc;
  clone.find(".log-activity")[0].innerHTML = retrievedData[rowNumber].activityType;
  clone.find(".post-date")[0].innerHTML = "posted on:" + curDate;
  clone.find(".post-time")[0].innerHTML = curTime;
  clone.attr("id", "cloned-row-" + rowNumber); /*new id is assigned to cloned row*/
  clone.insertBefore("#emp-log-row");
}
validateInput = () => {


  if ($("#activity-descr")[0].value == "") {
    var input = $("#activity-descr");
    if (!input.val()) {
      input.css("border", "1px solid #D56161");
      input.css("background-color", "rgb(255, 240, 240)");
      $("#empty-warning").show();
    }
  } else {
    storeInput();
    showSuccessToaster();
  }
}

addPrevSevenDays=()=>{
    for (var i = 0; i <= 6; i++) {
        let currentDate = new Date();
        currentDate.setDate((currentDate.getDate()) - i);
        let next=[currentDate.getDate(),(currentDate.getMonth()+1),currentDate.getFullYear()].join("/");
        $("#log-date").append("<option value="+next+">" + next + "</option>");
    }
}

  /**Shows the success toaster */
let showSuccessToaster = () => {
  let isAdded = JSON.parse(localStorage.getItem('isAdded'));
  if (isAdded) {
    $("#successToaster").fadeIn();
    setTimeout(() => {
      $("#successToaster").fadeOut();
      localStorage.setItem('isAdded', JSON.stringify(false));
    }, 2000)
  }
}