$(document).ready(function () {
    $('#toggle').click(function() {
        $(this).toggleClass('active');
        $('#overlay').toggleClass('open');
        $('body').toggleClass('noscroll');
    });
    $('#overlay li a').click(function () {
        $('#overlay').toggleClass('open');
        $('#toggle').toggleClass('active');
        $('body').removeClass('noscroll');
    });
	// scroll to
	$(".scroll-to").click(function (){
        	$('html, body').animate({
				scrollTop: $($.attr(this, 'href')).offset().top
            }, 600);
		});
	// reveal scroll
	window.sr = ScrollReveal({duration:1000});
	sr.reveal('.agv-image', {
		delay: 750,
		duration: 1000,
        distance: '70px',
		origin: 'left',
        mobile: false
	}, 50);
    sr.reveal('.img-object', {
        delay: 500,
        duration: 1000,
        distance: '70px',
        origin: 'right',
        mobile: false
    }, 50);
	sr.reveal('.header li', {
		delay: 0,
		interval: 150,
		duration: 1000,
        distance: '5px',
		origin: 'top',
        scale: 1,
        mobile: false
	});
    sr.reveal('h2, .video-holder, .social-distancing h3', {
        interval: 150,
        delay: 0,
        distance: '15px',
        origin: 'bottom',
        duration: 1000
    }, 500);
    sr.reveal('.careers_block h2', {
        delay: 750,
        duration: 1000,
        mobile: false
    }, 50);
    sr.reveal('.fg-item',  {
        interval: 150,
        delay: 0,
        distance: '15px',
        origin: 'bottom',
        duration: 1000
    }, 500);
    sr.reveal('.article-text, #gallery img, .career-holder', {
        interval: 150,
        delay: 500,
        distance: '15px',
        origin: 'bottom',
        duration: 2000
    }, 500);
    sr.reveal('.about-row',  {
        interval: 1000,
        delay: 500,
        distance: '15px',
        origin: 'bottom',
        duration: 2000
    }, 500);
    sr.reveal('.form-holder, .contact_info' ,  {
        interval: 0,
        delay: 500,
        distance: '15px',
        origin: 'bottom',
        duration: 2000
    }, 500);
    sr.reveal('.about_page, .contact_page',  {
        interval: 1000,
        delay: 100,
        duration: 500
    }, 500);
});
