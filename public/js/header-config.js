$(document).ready(function () {
	// fixed header
	$(function(){
		var fixedHeader = 300;
		$(window).scroll(function() {
			var scroll = getCurrentScroll();
			if ( scroll >= fixedHeader ) {
				$('#header').css('opacity', '1');
				$('.arrow-up').css('display', 'block');
			}
			else {
				$('#header').css('opacity', '0');
				$('.arrow-up').css('display', 'none');
			}
		});
		function getCurrentScroll() {
			return window.pageYOffset || document.documentElement.scrollTop;
		}
	});
});