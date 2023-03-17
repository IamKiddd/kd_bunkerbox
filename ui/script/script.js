$(function() {
    var time = 666;
    var clickButton = 0;
    var clickButtons = 0;
    var lvl = 1;
    var allButtons = 10;
    var progressBarInterval;
    var buttonsTimeout;
    var finish = true;
    var progressBarInterval;
    var buttonsInterval;
    var symbols = 'AWSD'; //Change if you want player press another key
    window.addEventListener('message', function(e) {
        var item = e.data;
        if (item.action == "start") {
            $(document).on('contextmenu', function(event) {
                event.preventDefault();
            });
            lvl = item.lvl;
            allButtons = item.button
            gameReset();
            $('.hackBox').fadeIn(500);
            $('#textInfo').html("Prepare...");
            progressBarStart('start', 2);
        }
    });
    
    const hackClick = $('#hackClick');

    const button = i => {
      return $('#button' + i)[0];
    };
    
    function isColliding(a, b) {
      const rect1 = a.getBoundingClientRect();
      const rect2 = b[0].getBoundingClientRect();
      const isInHoriztonalBounds = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
      const isInVerticalBounds = rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
      const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
      return isOverlapping;
    }
    
    window.addEventListener('keypress', function(event) {
      var name = event.key;
      if (finish) return;
      if (!((event.keyCode > 64 && event.keyCode < 91) || (event.keyCode > 96 && event.keyCode < 123))) return;
      if (isColliding(button(clickButtons), hackClick)) {
        if (button(clickButtons).dataset.char === name.toLocaleUpperCase()) {
          $(button(clickButtons)).remove();
          $('#hackClickButtons').addClass('click');
          setTimeout(() => {
            $('#hackClickButtons').removeClass('click');
          }, 100);
        } else {
          gameOver();
        }
        clickButtons++;
      } else gameOver();
    });

    const gameReset = () => {
        clearTimeout(buttonsTimeout);
        clearInterval(buttonsInterval);
        clickButtons = 0;
        clickButton = 0;
        $('#hackAllButtons').html("");
    };    

    const gameWin = () => {
        gameReset();
        $('.hackInfo').show();
        $('#textInfo').html('Success!!!');
        $('.hackFunction').hide();
        $('.hackText').hide();
        finish = true;
        $('#progressBox').show();
        progressBarStart('end', 5);
        setTimeout(function(){
            $.post('https://kd_bunkerbox/success');
        }, 3000);
    };
    

    const gameOver = () => {
        gameReset();
        $('.hackInfo').show();
        $('#textInfo').html('Fail!!!');
        $('.hackFunction').hide();
        $('.hackText').hide();
        finish = true;
        $('#progressBox').show();
        progressBarStart('end', 5);
        setTimeout(function(){
            $.post('https://kd_bunkerbox/fail');
        }, 3000);
    };
    
    function progressBarStart(type, times) {
        var maxwidth = 1000;
        var width = maxwidth;
        const process = () => {
            if (width > 0) {
                if (type == 'start' || type == 'end') 
                    {width = width - 3;}
                else 
                    {width--;}
                    var per =  (width * 100.0) / maxwidth + '%'
                    $(".progressBar").css("width", per);
            } else {
                if (type == 'start') {
                    $(".hackFunction").show();
                    $(".hackText").show();
                    $(".hackInfo").hide();
                    $("#progressBox").hide();
                    finish = false;
                    createButton();
				    moveButtons();
                    progressBarStart('game', time);
                    return;
                }
   
                if (type == 'game') {
                    $('.hackFunction').hide();
                    $('.hackInfo').show();
                    $('.hackText').hide();
                    gameOver();
                    return;
                }
            
                if (type == 'end') {
                    $('.hackBox').fadeOut(500);
                } 
            }
        };
        clearInterval(progressBarInterval);
        progressBarInterval = setInterval(process, times);
    }
    
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    function createButton() {
        if (clickButton >= allButtons) return;
        var min = (1000 - (lvl -1) * 200)
        var max = (2000 - (lvl -1) * 200)
        if (min < 50) {
            min = 50
        }
        if (max < 50) {
            max = 50
        }
        const randomChar = symbols[Math.floor(Math.random() * symbols.length)];
        const button = $('<div>')
            .addClass('button')
            .attr('id', 'button' + clickButton)
            .attr('data-char', randomChar)
            .text(randomChar)
            .css('left', getRndInteger(0, 466) + 'px')
            .css('top', '-10px');
        $('#hackAllButtons').append(button);
        clickButton++;
        buttonsTimeout = setTimeout(() => {
            createButton();
        }, getRndInteger(min, max));
    }
    

    function moveButtons() {
        buttonsInterval = setInterval(function () {
            if (!finish) {
                if (clickButtons === clickButton) {
                    let allB = 0;
                    $('.button').each(function() {
                        allB++;
                    });
                    if (!allB) 
                    {
                        gameWin();
                    }
                }
                for (let i = clickButtons; i < clickButton; i++) {
                    var y = parseInt($('#button' + i).css('top'), 10); // Change to interger
                    y += lvl; // Fast or Slow
                    if (y >= 590) {
                        gameOver();
                        return;
                    }
                    $('#button' + i).css('top', y);
                }
            }
        }, 15);
    }

});