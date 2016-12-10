app.filter('digits', function() {
  return function(input) {
    if (input < 10) {
      input = '0' + input;
    }

    return input;
  };
});
