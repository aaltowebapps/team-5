/**
 * User: mikkoruokojoki
 * Date: 20.5.2012
 * Time: 14.39
 */

// Draw selected month from day.
function drawMonth(selectedDay) {
  $('#jump_month_title').html(selectedDay.toString("MMM yyyy"));
  days.reset();
  // TODO: Draw days.
  days.add(new Day({id: "1", day_no: "1"}));
  days.add(new Day({id: "2", day_no: "2"}));
  days.add(new Day({id: "3", day_no: "3"}));
}