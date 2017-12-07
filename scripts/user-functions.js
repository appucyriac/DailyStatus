$(document).ready(() => {
  if (localStorage.getItem('empLog') !== null) {
    let jsonData = JSON.parse(localStorage.getItem("empLog"));
    let arrayLength = jsonData.length - 1;
    jsonData.forEach((value) => {
      repeatRow(arrayLength);
      arrayLength--;
    });
  }
});


const charCounter = () => {
  let max = 180;
  let len = $('#activity-descr').val().length;
  if (len <= max) {
    $('#character-counter')[0].innerHTML = max - len;
  }
}
const storeInput = () => {
  let empStatus = {
    date: $("#log-date option:selected").attr('value'),
    project: $("#emp-project option:selected").attr('value'),
    activityType: $("#emp-activity-type option:selected").attr('value'),
    timeSpent: $("#hours option:selected").attr('value') + "." + $("#minutes option:selected").attr('value'),
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
    data.bursts[0].push(JSON.parse(empLog));
  });
}

const repeatRow = (rowNumber) => {
  let clone = $("#emp-log-row").clone(true);
  retrievedData = JSON.parse(localStorage.getItem("empLog"));
  clone.find("#logged-date")[0].innerHTML = retrievedData[rowNumber].date;
  clone.find("#log-descr")[0].innerHTML = retrievedData[rowNumber].activityDesc;
  clone.find("#log-activity")[0].innerHTML = retrievedData[rowNumber].activityType;
  clone.attr("id", "cloned-row-" + rowNumber); /*new id is assigned to cloned row*/
  clone.insertBefore("#emp-log-row");
}