(function(window, undefined) {
  var OPTIONS = {
    DEBUG: true
  },
    contentStructure = [
    {
      type: "title",
      name: "Overview",
      content: [
        "Body Styles",
        "Trim lines",
        "Base MSRP Price Range",
        "Drive wheels",
        "Seating",
        "Engines available",
        "Transmissions available",
        "Owner Satisfaction",
        "Reliability",
        "Owner Costs"]
    },
    {
      type: "title",
      name: "Safety",
      content: [
        "Antilock brakes",
        "Traction control",
        "Stability control",
        "Daytime running lights",
        {
          type: "subtitle",
          name: "Safety belts",
          content: [
            "Pretensioners, front/rear"]
        },
        {
          type: "subtitle",
          name: "Air bags",
          content: [
            "Side bags, front/rear",
            "Head protection"]
        },
        {
          type: "subtitle",
          name: "Crash and rollover tests",
          content: [
            "IIHS front moderate overlap",
            "IIHS front small overlap",
            "IIHS side crash",
            "IIHS rear crash",
            "IIHS roof crush",
            "NHTSA overall crash",
            "NHTSA overall frontal-crash",
            "NHTSA front-crash, driver/front passenger",
            "NHTSA overall side-crash",
            "NHTSA side-crash, driver/rear passenger",
            "NHTSA side pole-crash",
            "NHTSA rollover, 2WD/4WD"]
        },
      ]
    },
    {
      type: "title",
      name: "Performance",
      content: [
        {
          type: "subtitle",
          name: "Acceleration",
          content: [
            "0 to 30 mph, sec.",
            "0 to 60 mph, sec.",
            "45 to 65 mph, sec.",
            "Quarter-mile, sec.",
            "Quarter-mile, mph"]
        },
        {
          type: "subtitle",
          name: "Transmission",
          content: [
            "Routine handling"]
        },
        {
          type: "subtitle",
          name: "Emergency handling",
          content: [
            "Avoidance maneuver, max speed"]
        },
        {
          type: "subtitle",
          name: "Braking",
          content: [
            "Braking from 60 mph dry, ft.",
            "Braking from 60 mph wet, ft."]
        },
        "Headlights"
      ]
    },
    {
      type: "title",
      name: "Comfort/convenience",
      content: [
        "Ride",
        "Noise",
        "Driving position",
        {
          type: "subtitle",
          name: "Front seat comfort",
          content: [
            "Front shoulder room, in.",
            "Front leg room, in.",
            "Front head room, in."]
        },
        {
          type: "subtitle",
          name: "Rear seat comfort",
          content: [
            "Rear shoulder room, in.",
            "Rear fore-aft room, in.",
            "Rear head room, in."]
        },
        {
          type: "subtitle",
          name: "Third seat comfort",
          content: [
            "Third shoulder room, in.",
            "Third fore-aft room, in.",
            "Third head room, in."]
        },
        "Front access",
        "Rear access",
        "Third access",
        "Controls and display",
        "Interior fit and finish",
        {
          type: "subtitle",
          name: "Trunk/Cargo Area",
          content: [
            "Luggage/cargo capacity, cu. ft."]
        },
        "Climate system"
      ]
    },
    {
      type: "title",
      name: "Fuel Economy",
      content: [     
        "CR's overall mileage, mpg",
        "CR's city/highway, mpg",
        "Annual fuel",
        "Cruising range, mi.",
        "Fuel capacity, gal.",
        "Fuel type",
        "EPA city, mpg",
        "EPA highway, mpg"]
    },
    {
      type: "title",
      name: "Specifications",
      content: [
        "Length, in.",
        "Width, in.",
        "Height, in.",
        "Wheelbase, in.",
        "Turning circle, ft.",
        "Curb weight, lb.",
        "Percent weight, front/rear",
        "Max. load, lb.",
        "Towing capacity, lb"]
    },
    {
      type: "title",
      name: "Warranty",
      content: [
        "Basic",
        "Powertrain",
        "Rust through",
        "Roadside aid"]
    }
  ];
  console.log(contentStructure);

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
    (function(){
      var compareHtml = "",
        l = contentStructure.length;

      for (var i = 0; i < l; i += 1) {
        var categoryName = contentStructure[i].name,
          categoryItems = contentStructure[i].content,
          itemLength = categoryItems.length,
          categoryHtml = "";

        for (var n = 0; n < itemLength; n += 1) {
          var item = categoryItems[n];

          if (typeof(item) == "object") {
            var subCategoryName = item.name,
              subCategoryItems = item.content,
              subItemsLength = subCategoryItems.length,
              subCategoryHtml = "";

            for (var j = 0; j < subItemsLength; j += 1) {
              subCategoryHtml += "<div class='category_sub_item'>" + subCategoryItems[j] + "</div>";
            }

            categoryHtml += "<div class='category category_sub'><div class='category_sub_title'>" + subCategoryName + "</div><div class='category_sub_list'>" + subCategoryHtml + "</div></div>";

          } else {
            categoryHtml += "<div class='category_main_item'>" + item + "</div>";
          }
        }
        compareHtml += "<div class='category category_main'><div class='category_main_title'>" + categoryName + "</div><div class='category_main_list'>" + categoryHtml + "</div></div>";
        console.log(compareHtml);
      }

      $('#compare').html("<div>" + compareHtml + "</div>")
    })();
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