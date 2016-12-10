app.service('Datepicker', function() {

  var today = new Date();
  var carouselDates, selectedDate;
  var carouselDays = [-2, -1, 0, 1, 2];

  var generateCarousel = function(date) {
    if (!date) date = today;

    carouselDates = carouselDays.map(function(day) {
      var shiftDate = new Date(date.getTime());
      shiftDate.setDate(shiftDate.getDate() + day);
      return shiftDate;
    });
  };

  var rotateCarousel = function(backwards) {
    if (!carouselDates) generateCarousel();

    if (backwards) {
      generateCarousel(carouselDates[1]);
    } else {
      generateCarousel(carouselDates[3]);
    }
  };

  var getCarousel = function() {
    if (!carouselDates) generateCarousel();
    return carouselDates;
  };

  var resetCarousel = function() {
    generateCarousel();
  };

  var selectDate = function(date) {
    selectedDate = date ? date : today;
  };

  var isDateSelected = function(date) {
    return selectedDate && date.getTime() === selectedDate.getTime();
  };

  var getToday = function() {
    return today;
  };

  var isEqual = function(date1, date2) {
    return Date.parse(date1) === Date.parse(date2);
  };

  return {
    getCarousel : getCarousel,
    selectDate : selectDate,
    isDateSelected : isDateSelected,
    rotateCarousel : rotateCarousel,
    getToday : getToday,
    isEqual : isEqual,
    resetCarousel : resetCarousel
  };

});
