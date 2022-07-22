/*
	Forty by HTML5 UP
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (browser.name == 'ie' || browser.name == 'edge' || browser.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			breakpoints.on('<=medium', off);
			breakpoints.on('>medium', on);

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Clear transitioning state on unload/hide.
		$window.on('unload pagehide', function() {
			window.setTimeout(function() {
				$('.is-transitioning').removeClass('is-transitioning');
			}, 250);
		});

	// Fix: Enable IE-only tweaks.
		if (browser.name == 'ie' || browser.name == 'edge')
			$body.addClass('is-ie');

	// Scrolly.
		$('.scrolly').scrolly({
			offset: function() {
				return $header.height() - 2;
			}
		});

	// Tiles.
		var $tiles = $('.tiles > article');

		$tiles.each(function() {

			var $this = $(this),
				$image = $this.find('.image'), $img = $image.find('img'),
				$link = $this.find('.link'),
				x;

			// Image.

				// Set image.
					$this.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide original.
					$image.hide();

			// Link.
				if ($link.length > 0) {

					$x = $link.clone()
						.text('')
						.addClass('primary')
						.appendTo($this);

					$link = $link.add($x);

					$link.on('click', function(event) {

						var href = $link.attr('href');

						// Prevent default.
							event.stopPropagation();
							event.preventDefault();

						// Target blank?
							if ($link.attr('target') == '_blank') {

								// Open in new tab.
									window.open(href);

							}

						// Otherwise ...
							else {

								// Start transitioning.
									$this.addClass('is-transitioning');
									$wrapper.addClass('is-transitioning');

								// Redirect.
									window.setTimeout(function() {
										location.href = href;
									}, 500);

							}

					});

				}

		});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() {
				$window.trigger('scroll');
			});

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.height() + 10,
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
				});

				window.setTimeout(function() {
					$window.triggerHandler('scroll');
				}, 100);

			});

		}

	// Banner.
		$banner.each(function() {

			var $this = $(this),
				$image = $this.find('.image'), $img = $image.find('img');

			// Parallax.
				$this._parallax(0.275);

			// Image.
				if ($image.length > 0) {

					// Set image.
						$this.css('background-image', 'url(' + $img.attr('src') + ')');

					// Hide original.
						$image.hide();

				}

		});

	// Menu.
		var $menu = $('#menu'),
			$menuInner;

		$menu.wrapInner('<div class="inner"></div>');
		$menuInner = $menu.children('.inner');
		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menuInner
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					window.setTimeout(function() {
						window.location.href = href;
					}, 250);

			});

		$menu
			.appendTo($body)
			.on('click', function(event) {

				event.stopPropagation();
				event.preventDefault();

				$body.removeClass('is-menu-visible');

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});

})(jQuery);





///////////// ABOUT PAGE BANNER ANIMATION /////////////

var words = document.getElementsByClassName('word');
var wordArray = [];
var currentWord = 0;

words[currentWord].style.opacity = 1;
for (var i = 0; i < words.length; i++) {
  splitLetters(words[i]);
}

function changeWord() {
  var cw = wordArray[currentWord];
  var nw = currentWord == words.length-1 ? wordArray[0] : wordArray[currentWord+1];
  for (var i = 0; i < cw.length; i++) {
    animateLetterOut(cw, i);
  }
  
  for (var i = 0; i < nw.length; i++) {
    nw[i].className = 'letter behind';
    nw[0].parentElement.style.opacity = 1;
    animateLetterIn(nw, i);
  }
  
  currentWord = (currentWord == wordArray.length-1) ? 0 : currentWord+1;
}

function animateLetterOut(cw, i) {
  setTimeout(function() {
		cw[i].className = 'letter out';
  }, i*10); //og i*80
}

function animateLetterIn(nw, i) {
  setTimeout(function() {
		nw[i].className = 'letter in';
  }, 340+(i*10));
}

function splitLetters(word) {
  var content = word.innerHTML;
  word.innerHTML = '';
  var letters = [];
  for (var i = 0; i < content.length; i++) {
    var letter = document.createElement('span');
    letter.className = 'letter';
    letter.innerHTML = content.charAt(i);
    word.appendChild(letter);
    letters.push(letter);
  }
  
  wordArray.push(letters);
}

changeWord();
setInterval(changeWord, 8000);



///////////////////////

var wordsTwo = document.getElementsByClassName('wordTwo');
var wordArrayTwo = [];
var currentWordTwo = 0;

wordsTwo[currentWordTwo].style.opacity = 1;
for (var i = 0; i < wordsTwo.length; i++) {
  splitLettersTwo(wordsTwo[i]);
}

function changeWordTwo() {
  var cwTwo = wordArrayTwo[currentWordTwo];
  var nwTwo = currentWordTwo == wordsTwo.length-1 ? wordArrayTwo[0] : wordArrayTwo[currentWordTwo+1];
  for (var i = 0; i < cwTwo.length; i++) {
    animateLetterOutTwo(cwTwo, i);
  }
  
  for (var i = 0; i < nwTwo.length; i++) {
    nwTwo[i].className = 'letterTwo behindTwo';
    nwTwo[0].parentElement.style.opacity = 1;
    animateLetterInTwo(nwTwo, i);
  }
  
  currentWordTwo = (currentWordTwo == wordArrayTwo.length-1) ? 0 : currentWordTwo+1;
}

function animateLetterOutTwo(cwTwo, i) {
  setTimeout(function() {
		cwTwo[i].className = 'letterTwo outTwo';
  }, i*10); //og i*80
}

function animateLetterInTwo(nwTwo, i) {
  setTimeout(function() {
		nwTwo[i].className = 'letterTwo inTwo';
  }, 340+(i*10));
}

function splitLettersTwo(wordTwo) {
  var contentTwo = wordTwo.innerHTML;
  wordTwo.innerHTML = '';
  var lettersTwo = [];
  for (var i = 0; i < contentTwo.length; i++) {
    var letterTwo = document.createElement('span');
    letterTwo.className = 'letterTwo';
    letterTwo.innerHTML = contentTwo.charAt(i);
    wordTwo.appendChild(letterTwo);
    lettersTwo.push(letterTwo);
  }
  
  wordArrayTwo.push(lettersTwo);
}

changeWordTwo();
setInterval(changeWordTwo, 8000);



///////////////////////

var wordsThree = document.getElementsByClassName('wordThree');
var wordArrayThree = [];
var currentWordThree = 0;

wordsThree[currentWordThree].style.opacity = 1;
for (var i = 0; i < wordsThree.length; i++) {
  splitLettersThree(wordsThree[i]);
}

function changeWordThree() {
  var cwThree = wordArrayThree[currentWordThree];
  var nwThree = currentWordThree == wordsThree.length-1 ? wordArrayThree[0] : wordArrayThree[currentWordThree+1];
  for (var i = 0; i < cwThree.length; i++) {
    animateLetterOutThree(cwThree, i);
  }
  
  for (var i = 0; i < nwThree.length; i++) {
    nwThree[i].className = 'letterThree behindThree';
    nwThree[0].parentElement.style.opacity = 1;
    animateLetterInThree(nwThree, i);
  }
  
  currentWordThree = (currentWordThree == wordArrayThree.length-1) ? 0 : currentWordThree+1;
}

function animateLetterOutThree(cwThree, i) {
  setTimeout(function() {
		cwThree[i].className = 'letterThree outThree';
  }, i*10); //og i*80
}

function animateLetterInThree(nwThree, i) {
  setTimeout(function() {
		nwThree[i].className = 'letterThree inThree';
  }, 340+(i*10));
}

function splitLettersThree(wordThree) {
  var contentThree = wordThree.innerHTML;
  wordThree.innerHTML = '';
  var lettersThree = [];
  for (var i = 0; i < contentThree.length; i++) {
    var letterThree = document.createElement('span');
    letterThree.className = 'letterThree';
    letterThree.innerHTML = contentThree.charAt(i);
    wordThree.appendChild(letterThree);
    lettersThree.push(letterThree);
  }
  
  wordArrayThree.push(lettersThree);
}

changeWordThree();
setInterval(changeWordThree, 8000);



///////////////////////

var wordsFour = document.getElementsByClassName('wordFour');
var wordArrayFour = [];
var currentWordFour = 0;

wordsFour[currentWordFour].style.opacity = 1;
for (var i = 0; i < wordsFour.length; i++) {
  splitLettersFour(wordsFour[i]);
}

function changeWordFour() {
  var cwFour = wordArrayFour[currentWordFour];
  var nwFour = currentWordFour == wordsFour.length-1 ? wordArrayFour[0] : wordArrayFour[currentWordFour+1];
  for (var i = 0; i < cwFour.length; i++) {
    animateLetterOutFour(cwFour, i);
  }
  
  for (var i = 0; i < nwFour.length; i++) {
    nwFour[i].className = 'letterFour behindFour';
    nwFour[0].parentElement.style.opacity = 1;
    animateLetterInFour(nwFour, i);
  }
  
  currentWordFour = (currentWordFour == wordArrayFour.length-1) ? 0 : currentWordFour+1;
}

function animateLetterOutFour(cwFour, i) {
  setTimeout(function() {
		cwFour[i].className = 'letterFour outFour';
  }, i*10); //og i*80
}

function animateLetterInFour(nwFour, i) {
  setTimeout(function() {
		nwFour[i].className = 'letterFour inFour';
  }, 340+(i*10));
}

function splitLettersFour(wordFour) {
  var contentFour = wordFour.innerHTML;
  wordFour.innerHTML = '';
  var lettersFour = [];
  for (var i = 0; i < contentFour.length; i++) {
    var letterFour = document.createElement('span');
    letterFour.className = 'letterFour';
    letterFour.innerHTML = contentFour.charAt(i);
    wordFour.appendChild(letterFour);
    lettersFour.push(letterFour);
  }
  
  wordArrayFour.push(lettersFour);
}

changeWordFour();
setInterval(changeWordFour, 8000);






/////////////// WORK SECTION ANIMATION ///////////////

window.addEventListener('scroll', reveal);

    function reveal(){
      var reveals = document.querySelectorAll('.revealWork');

      for(var i = 0; i < reveals.length; i++){

        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 350;

        if(revealtop < windowheight - revealpoint){
          reveals[i].classList.add('active');
        }
        // else{
        //   reveals[i].classList.remove('active');
        // }
      }
    }