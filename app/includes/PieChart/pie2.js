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
}) 
// тут меняем цвет и процент диаграммы
(function($) {
var dataset = [
  {
    value: 30,
    color: '#4eb7a8' //салатовый
  }, {
    value: 30,
    color: '#e5e5e5' //серый
  }, {
    value: 10,
    color: '#747474' // почти черный
  }, {
    value: 30,
    color: '#e75735' // красненький
  }
];

var maxValue = 25;
var container = $('.container');

var addSector = function(data, startAngle, collapse) {
  var sectorDeg = 3.6 * data.value;
  var skewDeg = 90 + sectorDeg;
  var rotateDeg = startAngle;
  if (collapse) {
    skewDeg++;
  }

  var sector = $('<div>', {
    'class': 'sector'
  }).css({
    'background': data.color,
    'transform': 'rotate(' + rotateDeg + 'deg) skewY(' + skewDeg + 'deg)'
  });
  container.append(sector);

  return startAngle + sectorDeg;
};

dataset.reduce(function (prev, curr) {
  return (function addPart(data, angle) {
    if (data.value <= maxValue) {
      return addSector(data, angle, false);
    }

    return addPart({
      value: data.value - maxValue,
      color: data.color
    }, addSector({
      value: maxValue,
      color: data.color,
    }, angle, true));
  })(curr, prev);
}, 0);})
