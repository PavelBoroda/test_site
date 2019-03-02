import './main.scss';
import "./jquery-3.3.1.js"
import "./includes/PieChart/PieChart.js";
import "./includes/PieChart/PieChartSetting.js";
import "./includes/PieChart/pie2.js";
import "./includes/sliders/ion.rangeSlider.js";
import "./includes/sliders/sliders.js";
import "./includes/progressBar/progressBar.js";
import "./includes/stageBar/stepbar.js";
import "./includes/stageBar/stageBar.js";
import "./includes/dropdown/dropdown.js";
import "./includes/userprofile/userprofile.js";
import "./includes/calendar/cssworld.ru-xcal.js";
import "./includes/calendar/calendar.js";



$(document).ready(function(){
  $("#menu").on("click","a", function (event) {
      event.preventDefault();
      var id  = $(this).attr('href'),
          top = $(id).offset().top;
      $('body,html').animate({scrollTop: top}, 1500);
  });
});


if (process.env.NODE_ENV !== 'production') {
  require('./index.pug')
}


