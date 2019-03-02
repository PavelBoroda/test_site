(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD - register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    var $ = require('jquery');
    factory($);
    module.exports = $;
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function($) {
$('#circle').circleProgress({
  value: 0.97, // значение в процентах
  size: 80, // размер в пикселях
  startAngle: 4.7, // стартовая позиция
  fill: {
    gradient: ["orange"] // цвет заливки
  },
  emptyFill: "white" // цвет пустого пространства
})
$('#circle2').circleProgress({
  value: 0.95, // значение в процентах
  size: 80, // размер в пикселях
  startAngle: 4.7, // стартовая позиция
  fill: {
    gradient: ["orange"] // цвет заливки
  },
  emptyFill: "white" // цвет пустого пространства
})
$('#circle3').circleProgress({
  value: 0.99, // значение в процентах
  size: 80, // размер в пикселях
  startAngle: 4.7, // стартовая позиция
  fill: {
    gradient: ["orange"] // цвет заливки круга
  },
  emptyFill: "white" // цвет пустого пространства
})
}
)
