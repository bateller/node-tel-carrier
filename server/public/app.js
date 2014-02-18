$(function () {
  'use strict';

  var rePhone = /(?=^|\D)(\+?1)?\s*[\-\.]?\s*\(?\s*(\d{3})\s*\)?\s*[\-\.]?\s*(\d{3})\s*[\-\.]?\s*(\d{4})(?=\D|$)/g
    ;

  function log(redThing) {
    $('table').append('<tr><td>' + redThing + '</td></tr>\n');
    //$('table').append('<tr><td>' + redThing + '</td><td>' + (blueThing || '') + '</td></tr>\n');
  }

  function getNumbers(numbers) {
    var getUrl = '/lookup?numbers='
      ;

    // if total url length exceeds 2000, use a POST (10 digits + ',' === 11)
    if (getUrl.length + (numbers.length * 11) > 2000) {
      return $.ajax('/lookup', 
      { data: JSON.stringify({ numbers: numbers })
      , contentType: 'application/json'
      , type: 'POST'
      });
    } else {
      return $.get(getUrl + numbers.join(','));
    }
  }

  function doWork() {
    var parts
      , text = $('textarea.js-numbers').val()
      , numbers = []
      , numbersMap = {}
      , formatted = []
      , onesies = []
      , phone
      , onesie
      ;
    
    while ((parts = rePhone.exec(text)) !== null) {
      phone = '(' + parts[2] + ') ' + parts[3] + '-' + parts[4];
      onesie = parts[2].toString() + parts[3] + parts[4];

      if (!numbersMap[phone]) {
        numbersMap[phone] = true;
        numbers.push(parts);
        formatted.push(phone);
        onesies.push(onesie);
      }
    }

    $('table').html('');
    log('total numbers found:' + numbers.length);
    formatted.sort().forEach(function (phone) {
      log(phone);
    });

    getNumbers(onesies).then(function (data) {
      console.log('data.length', data.length);
      $('table').html('');
      log('info.number', 'info.smsGateway');
      data.forEach(function (info) {
        log(info.smsGateway || ('<b>' + info.number + ' - ' + (info.carrier || info.carrierComment) + '</b>'));
      });
    });
  }

  $('body').on('submit', '.js-form', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    doWork();
  });
});