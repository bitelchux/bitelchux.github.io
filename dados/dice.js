
/*
Little HTML5/coffeescript dice app
By Bart Nagel <bart@tremby.net>
Licence undecided: email me to enquire
 */

(function() {
  var diceSelector, getDice, getDiceList, getDiceNum, getTotal, updateHistory, updateTotal;

  getDiceList = function() {
    return $('#dice > ul');
  };

  diceSelector = '#dice > ul > li';

  getDice = function() {
    return $(diceSelector);
  };

  getDiceNum = function() {
    return getDice().length;
  };

  getTotal = function() {
    var total;
    total = 0;
    getDice().each(function() {
      var value;
      value = $(this).data('value');
      if (value == null) {
        value = 0;
      }
      return total += value;
    });
    return total;
  };

  updateTotal = function() {
    var $t;
    $t = $('#total');
    $t.text(getTotal());
    $t.addClass('notransition');
    $t.css('color', 'yellow');
    return setTimeout(function() {
      $t.removeClass('notransition');
      return $t.css('color', '');
    }, 0);
  };

  updateHistory = function() {
	if (!LOG)
		return;
    var $history, $li, $ol;
    $history = $('#history > ol');
    $li = $('<li/>');
    $li.append($('<strong/>').text(GLOBALUSER+ " ->" + getTotal()+" out of " + GLOBALSIDES));
  //  $ol = $('<ol/>');
//    $li.append($ol);
	/*
    getDice().each(function() {
      var $innerli;
      $innerli = $('<li/>').text($(this).data('value'));
      if ($(this).find('input.hold').is(':checked')) {
        $innerli.addClass('hold');
      }
      return $ol.append($innerli);
    });
	*/
    $history.append($li);
    return $history.scrollTop($history.prop('scrollHeight'));
  };

  $(function() {
    var duplicateDie, resize;
    $('#configuration-toggle').click(function(e) {
      var configuring;
      e.stopPropagation();
      $('body').toggleClass('configuring');
      configuring = $('body').is('.configuring');
      getDiceList().sortable('option', {
        disabled: !configuring
      });
      if (configuring) {
        return getDice().each(function() {
          $(this).data('rotation', 0);
          return $(this).find('.content').css({
            'transform': '',
            '-webkit-transform': ''
          });
        });
      }
    });
    getDiceList().sortable({
      disabled: true
    });
    getDiceList().on('click', 'button.remove', function() {
      if (getDiceNum() <= 1) {
        return alert("can't remove the last die");
      } else {
        $(this).closest(diceSelector).remove();
        return resize();
      }
    });
    duplicateDie = function() {
      var $clone;
      getDiceList().append($clone = $(this).closest(diceSelector).clone());
      if (!Modernizr.inputtypes.color) {
        $clone.find('.sp-replacer').remove();
        $clone.find('input.color').show();
        $.fn.spectrum.processNativeColorInputs();
      }
      return resize();
    };
    getDiceList().on('click', 'button.duplicate', duplicateDie);
    getDiceList().on('change', 'input.colour', function() {
      var $die, light, newcolour;
      newcolour = new Colour($(this).val());
      light = newcolour.shade() > 0.5;
      $die = $(this).closest(diceSelector);
      $die.find('.image .content').css({
        'background-color': newcolour.hex(),
        'color': light ? 'black' : 'white',
        'border-color': newcolour.shiftshade(light ? -0.3 : 0.3).hex()
      });
      return $die.toggleClass('light', light);
    });
    getDiceList().on('change', 'input.sides', function() {
      var geometry;
      geometry = parseInt($(this).val());
      return $(this).closest(diceSelector).find('.image .sides').text('d' + geometry);
    });
    getDiceList().on('click', 'div.hold', function(e) {
      return e.stopPropagation();
    });
    getDiceList().on('change', 'input.label', function() {
      return $(this).closest(diceSelector).find('> .label').text($(this).val());
    });
    $('#dice').click(function() {
      if ($('body').is('.configuring')) {
        return;
      }
      if (getDiceNum() === getDice().filter(':has(input.hold:checked)').length) {
        return;
      }
	  alert(GLOBALSIDES+"-"+GLOBALUSER+"-" + GLOBALWITHZERO);
      $('#sound').html('<audio autoplay="autoplay"><source src="roll.ogg" type="audio/ogg"><source src="roll.mp3" type="audio/mpeg"><embed hidden="true" autostart="true" loop="false" src="roll.mp3"></audio>');
      getDice().each(function() {
        var $circles, basezero, sides, value;
        if ($(this).find('input.hold').is(':checked')) {
          return;
        }
        //sides = parseInt($(this).find('input.sides').val());
		sides=GLOBALSIDES;
        //basezero = $(this).find('input.base-zero').is(':checked');
		basezero = GLOBALWITHZERO;
        value = Math.floor(Math.random() * sides) + (basezero ? 0 : 1);
        $(this).data('value', value);
        $(this).find('svg').toggle(!basezero && sides === 6);
        $circles = $(this).find('svg circle');
        $circles.hide();
        switch (value) {
          case 1:
            $circles.filter('.dot-2-2').show();
            break;
          case 2:
            $circles.filter('.dot-1-1, .dot-3-3').show();
            break;
          case 3:
            $circles.filter('.dot-1-1, .dot-2-2, .dot-3-3').show();
            break;
          case 4:
            $circles.filter('.dot-1-1, .dot-1-3, .dot-3-1, .dot-3-3').show();
            break;
          case 5:
            $circles.filter('.dot-1-1, .dot-1-3, .dot-2-2, .dot-3-1, .dot-3-3').show();
            break;
          case 6:
            $circles.filter('.dot-1-1, .dot-1-2, .dot-1-3, .dot-3-1, .dot-3-2, .dot-3-3').show();
        }
        $(this).find('.value').toggle(basezero || sides !== 6).text(value).css('text-decoration', /^[69]*$/.test(String(value)) ? 'underline' : '');
        if (!$(this).data('rotation')) {
          $(this).data('rotation', 0);
        }
        $(this).data('rotation', $(this).data('rotation') + (Math.round(Math.random()) * 2 - 1) * 360 * (0.5 + Math.random() * 1));
        return $(this).find('.content').css({
          'transform': 'rotate(' + $(this).data('rotation') + 'deg)',
          '-webkit-transform': 'rotate(' + $(this).data('rotation') + 'deg)'
        });
      });
      updateTotal();
      return updateHistory();
    });
    resize = function() {
      var height, idealDieLength, length, nh, nw, width;
      width = $(window).width();
      height = $(window).height();
      idealDieLength = Math.sqrt(width * height / getDiceNum());
      nw = Math.ceil(width / idealDieLength);
      nh = Math.ceil(height / idealDieLength);
      length = Math.max(width / nw, height / nh) * 0.8;
      getDice().width(length);
      return getDice().find('.content .value').css({
        'font-size': (length * 0.6) + 'px',
        'line-height': length + 'px'
      });
    };
    $(window).resize(resize);
    resize();
    return getDice().first().children(':first');
  });

}).call(this);

//# sourceMappingURL=../build/dice.js.map