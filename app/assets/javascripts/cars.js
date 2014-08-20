(function(window, undefined) {
  var OPTIONS = {
    DEBUG: true
  };

  function log() {
    if (OPTIONS.DEBUG) {
      if (arguments[0] === 'error') {
        console.error(arguments);
      } else {
        console.log(arguments);
      }
    }
  }


  function startRouting(obj) { //has keys: 
    //q - for the query string, 
    //active - for the active image number, 
    //if no object - initiates router
    var AppRouter = Backbone.Router.extend({
      routes: {
        ":cat/:q/:page": "mainRoute",
        ":cat": "catRoute",
        "*actions": "defaultRoute" // Backbone will try match the route above first
      }
    }),
      app_router = new AppRouter(),
      url = $(location).attr('href'),
      paramString = url.split('#')[1],
      paramArray,
      key,
      params = {},
      query,
      cat,
      q,
      page;

    if (obj) {
      cat = obj.cat;
      q = obj.q || '';
      page = obj.page;
      if (!obj.q) {
        query = cat;
      } else {
        query = cat + '/' + q + '/' + page;
      }
      app_router.navigate(query, {
        trigger: true,
        replace: true
      });
    } else {
      app_router.on('route:defaultRoute', function() {
        log('there is no routes for such url string!');
      });

      app_router.on('route:catRoute', function(cat) {
        // Note the variable in the route definition being passed in here
        $('.tabs_switch').removeClass('active');
        $('.tabs_switch[href=' + cat + ']').addClass('active');
        if (cat === "images") {
          $('body').append('<script id="imagesearch_js" src="js/imagesearch.js"></script>');
        }
      });
      app_router.on('route:mainRoute', function(cat, q, page) {
        // Note the variable in the route definition being passed in here
        $('.tabs_switch').removeClass('active');
        $('.tabs_switch[href=' + cat + ']').addClass('active');
        if (cat === "images") {
          if (!$('#imagesearch_js').length) {
            $('body').append('<script id="imagesearch_js" src="js/imagesearch.js" data-q="' + q + '" data-active="' + page + '"></script>');            
          } else {
            imagesearch.search(q, page);
          }
        } else {
          $('#q').val(q);
          if (page == 1) {
            $('#search_form').submit();
          } else {
            if (cat === 'xfinitytv') {
              params = '&start=' + page;
              getData(renderResults, params);
            } else if (cat === 'web' || cat === 'support') {
              offset = (parseInt(page) - 1) * 10;
              params = '&offset=' + offset;
              getData(renderResults, params);        
            }
          }
        }
      });
      // Start Backbone history a necessary step for bookmarkable URL's
      Backbone.history.start();
    }
  }

  function renderResults(data) {
  }

  function getData(callback, requestParams) {
    ajaxRequest = {
      url: '/proxy_support/',
      //dataType: 'json',// Use default: Intelligent Guess type select, because text/html header is returned for no results;
      type: 'GET',
      data: 'cat=mobile&q=' + encodeURIComponent(searchInput) + requestParams
    };
    $.ajax(ajaxRequest).done(callback);
  }

  $(function() {
    $("#load-cars").on("submit", function(){
      ajaxRequest = {
        url: '/cars/new/porsche/cayenne',
        dataType: 'script',// Use default: Intelligent Guess type select, because text/html header is returned for no results;
        type: 'GET'
        //data: 'cat=mobile&q=' + encodeURIComponent(searchInput) + requestParams
      };
      $.ajax(ajaxRequest).done(function(){
        var l = __xxx.length,
          html = "";
        for (var i = 0; i < l; i+=1) {
          html += __xxx[i];
        }
        $('body').append('<table><tr>' + html + '</tr></table>');
      });
      return false;
    });
    startRouting();
  });
})(window);