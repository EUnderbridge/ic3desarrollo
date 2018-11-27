$(window).on('load', function(){

	// Remove preloader when window is loaded
	const preloader = document.getElementById("preloader-container");
  preloader.style.opacity = 0;
  setTimeout(function() { preloader.remove() }, 250);

	// efecto de inicio
		$('h1').animate({
			'letter-spacing': '20px'
		}, 1000);
	});


let scroll, profundidad;

$(window).on('scroll', function(){

	scroll = $(window).scrollTop();

	$('.reveal').each(function(){

		profundidad = $(this).offset().top - $(window).innerHeight() * .85;
		if (scroll > profundidad) {

			$(this).addClass('visible');
		}

	});

});



$(document).ready(function(){

	// aplicación de retardos
	$('.delayed').each(function(){

		let retardo = $(this).data('retardo');
		$(this).css('transition-delay', retardo);

	});


	// sistema de desplazamiento
	$('.desplazar').on('click', function(){

		let id = $(this).attr('href');
		let profundidad = $(id).offset().top - $('.menu').innerHeight();

		$('html, body').animate({
			scrollTop: profundidad
		}, 1000);
	});

});
