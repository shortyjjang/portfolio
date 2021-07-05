$(function(){

	// set a flag to check if the stream is restored
	var $stream = $('#content .stream').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
	$last = $stream.find('>li:last-child');
	$.infiniteshow({itemSelector:'#content .stream > li'});
	$("#content").removeClass("loading");
	
	$stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
	if(!$stream.find('> li').length) $('div.empty-result').show();
				
	$('#sidebar .categories, .refine_menu .categories').delegate('ul a.title','click',function(event){
		event.preventDefault();
		var url = $(this).attr('href'), args = $.extend({}, location.args), query;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$('.product > .filter, .category-menu').delegate('ul.menu a','click',function(event){
		event.preventDefault();

    	if( $(this).attr('require_login') ){
    		require_login();
    		return;
    	}
		if ($(this).hasClass('refine')) return;

		var type = $(this).data('type'), url = location.pathname, args = $.extend({}, location.args), query;

		if(args.fancyd) delete args.fancyd;
		if(args.wanted) delete args.wanted;

		if(type=='fancyd'){
			args.fancyd = 'true';
		}else if(type=='wanted'){
			args.wanted = 'true';
		}

		$(this).closest("ul").find('li a.current').removeClass("current").end().end().addClass('current');

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	// keyword search
	$('.refine_menu .keyword input[type=text]')
		.hotkey('ENTER', function(event){
			var q = $.trim(this.value), url = location.pathname, args = $.extend({}, location.args), query;

			event.preventDefault();

			if(q) {
				args.q = q;
			} else {
				delete args.q;
			}

			if(query = $.param(args)) url += '?'+query;

			loadPage(url);
		})
		.keyup(function(){
			var hasVal = !!$(this).val().replace("Filter by keyword","");
			$(this).parent().find('.remove').css({opacity:hasVal?1:0}).end()
		})
		.keyup();

	// remove keyword
	$('.refine_menu .keyword .remove').click(function(event){
	    event.preventDefault();
	    $(this).parent().find('input[type=text]').val('').keyup();	    

	    var url = location.pathname, args = $.extend({}, location.args), query;

		event.preventDefault();
		delete args.q;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	})

    $(".color li").on("click", function(event) {
        event.preventDefault();
        $(this).closest(".color").find("li").removeClass('checked');
        var color = $(this).find("input").val(),
            url = location.pathname,
            args = $.extend({}, location.args),
            query;

        if (color) {
            args.color = color;
        } else {
            delete args.color;
        }

        if ((query = $.param(args))) url += "?" + query;
        setOptions(args);

        loadPage(url);
        if (color) {
            $(this).addClass('checked')
            .closest(".color")
            .find("dt a")
            .text(
                $(this).find("label").text()
            );
        } else {
            $(this)
            .closest(".color")
            .find("dt a")
            .text('Color');
        }
        $(this).closest('dl').toggleClass('show');
    });

    // new sort option (v4)
    $(".sort li a").on("click", function(event) {
        event.preventDefault();
        $(this).closest(".sort").find('a').removeClass('selected');
        var sort_by_price = $(this).data('sortby'),
            url = location.pathname,
            args = $.extend({}, location.args),
            query;

        if (sort_by_price) {
            args.sort_by_price = sort_by_price;
        } else {
            delete args.sort_by_price;
        }

        if ((query = $.param(args))) url += "?" + query;
        setOptions(args);

        loadPage(url);
        $(this).addClass('selected')
            .closest(".sort")
            .find("dt a")
            .text(
                $(this).text()
            );
        $(this).closest('dl').toggleClass('show');
		return false;
    });

	$( "#slider-range" ).slider({
		range: true,
		min: 0,
		max: 1000,
		step: 10,
		values: [ parseInt($( ".price .amount .min" ).text()), parseInt($( ".price .amount .max" ).text()) ],
		slide: function( event, ui ) {
			if(ui.values[1]-ui.values[0] < 10) return false;;
			$( ".price .amount .min" ).text( ui.values[ 0 ] || 1);
			$( ".price .amount .max" ).text( ui.values[ 1 ] + (ui.values[1]==1000?"+":""));			
		},
		change: function( event, ui ) {
			var min_price = ui.values[ 0 ], max_price = ui.values[ 1 ], url = location.pathname, args = $.extend({}, location.args), query;

			if(max_price==1000) max_price="";
			if(max_price && !min_price) min_price = "1"

			if(min_price || max_price){				
				var price = min_price+"-"+max_price;
				args.p = price;
			}else{
				delete args.p;
			}

			if(query = $.param(args)) url += '?'+query;

			loadPage(url);
		}
	});

	var ajax = null;
	function loadPage(url, skipSaveHistory){
		var $win = $(window), $stream  = $('#content ol.stream');

		if (!$stream.length) return;

		var $lis     = $stream.find('>li'),
			scTop    = $win.scrollTop(),
			stTop    = $stream.offset().top,
			winH     = $win.innerHeight(),
			headerH  = $('#header-new').height(),
			useCSS3  = false,//Modernizr.csstransitions,
			firstTop = -1,
			maxDelay = 0,
			begin    = Date.now();


		try{ if(ajax) ajax.abort() }catch(e){};
		try{ $.infiniteshow.abort() }catch(e){};

		$('#content').addClass('loading');
		$stream.css('height','');
		$('div.empty-result').hide();
		if(useCSS3){
			$stream.addClass('use-css3').removeClass('fadein').parents('#content').addClass('loading');

			$lis.each(function(i,v){
				if(!inViewport(v)) return;
				if(firstTop < 0) firstTop = v.offsetTop;

				var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));

				v.className += ' anim';
				setTimeout(function(){ v.className += ' fadeout'; }, delay+10);

				if(delay > maxDelay) maxDelay = delay;
			});
		}

		if(!skipSaveHistory && window.history && history.pushState){
			history.pushState({url:url}, document.title, url);
		}
		location.args = $.parseString(location.search.substr(1));


		ajax = $.ajax({
			type : 'GET',
			url  : url,
			dataType : 'html',
			success  : function(html){
				
				$stream.attr('loc', location.pathname.replace(/\//g, '-').substr(1));

				var $html = $($.trim(html)),
				    $more = $('.pagination > a'),
				    $new_more = $html.find('.pagination > a');
					
				
				$stream.html( $html.find('#content ol.stream').html() );

				$('#content').removeClass('loading');
				if(!$stream.find('> li').length) $('div.empty-result').show();
				else $('div.empty-result').hide();

				if($new_more.length) $('.pagination').append($new_more);
				$more.remove();

                var $mixpanel = $html.filter('script#mixpanel_script');
                if ($mixpanel) $.globalEval($mixpanel.html()); 


				(function(){
					if(useCSS3 && (Date.now() - begin < maxDelay+300)){
						return setTimeout(arguments.callee, 50);
					}

					$stream.addClass('fadein').html( $html.find('#content ol.stream').html() );
					
					if(useCSS3){
						$win.scrollTop(scTop);
						scTop = $win.scrollTop();
						stTop = $stream.offset().top;
						
						firstTop = -1;
						$stream.find('>li').each(function(i,v){
							if(!inViewport(v)) return;
							if(firstTop < 0) firstTop = v.offsetTop;
							
							var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));
							
							v.className += ' anim';
							setTimeout(function(){ v.className += ' fadein'; }, delay+10);
							
							if(delay > maxDelay) maxDelay = delay;
						});

						setTimeout(function(){ $stream.removeClass('use-css3 fadein').find('li.anim').removeClass('anim fadein').parents('#content').removeClass('loading'); }, maxDelay+300);
					}

					// reset infiniteshow
					$.infiniteshow({itemSelector:'#content .stream > li'});
					$win.scrollTop(0).trigger('scroll');
				})();
			}
		});

		function inViewport(el){
			return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
		};
	};

	$(window).on('popstate', function(event){
		var e = event.originalEvent, $stream;
		if(!e || !e.state) return;

		$stream = $('#content .stream');
		if ($stream.data('restored')) {
			$stream.data('restored', false);
		} else {
			loadPage(event.originalEvent.state.url, true);
		}
	});

});
