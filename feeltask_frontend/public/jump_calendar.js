/**
 * User: mikkoruokojoki
 * Date: 20.5.2012
 * Time: 14.39
 */

// Draw selected month from day.
function drawMonth() {
  console.log("Drawing month for " + selectedDay.toISOString());
  $('#jump_month_title').html(selectedDay.toString("MMM yyyy"));
  days.reset();
  var startTime = new Date();
  startTime.setTime(selectedDay.getTime());
  startTime.moveToFirstDayOfMonth();
  var endTime = new Date();
  endTime.setTime(selectedDay.getTime());
  endTime.moveToLastDayOfMonth();
  // First week
  for (loopCount = 1; loopCount <= endTime.getDate(); loopCount += 1) {
    var dateText = loopCount + "." + (startTime.getMonth() + 1) + "." + startTime.getFullYear();
    console.log("Draw day " + loopCount + ":" + dateText);
    var loopDate = Date.parseExact(dateText, "d.M.yyyy");
    var day = new Day({id:loopCount, day_no:loopCount, date:loopDate.toString("d.M.yyyy")});
    days.add(day);
  }
}