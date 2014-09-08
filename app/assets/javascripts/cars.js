(function(window, undefined) {
  var OPTIONS = {
    DEBUG: true
  },
    contentStructure = [
    // {
    //   type: "title",
    //   name: "<button disabled='disabled' class='btn btn-lg btn-danger' id='clear-button'>clear all</button>",
    //   content: [
    //   ]
    // },
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
        ":cars/:cat/:subcat": "mainRoute",
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
      car,
      q,
      page;

    if (obj) {
      query = paramString || "";
      if (obj.action === "add") {
        car = obj.car.replace(/\//g, "&");
        if (query) {
          query += ",";
        }
        query += car;
      } else if (obj.action === "remove") {
        car = "&cars&" + obj.car.replace(/\//g, "&");

        query = query.replace("," + car, "");
        query = query.replace(car + ",", "");
        query = query.replace(car, "");          
      } else if (obj.action === "removeAll") {
        query = "";
      }
      app_router.navigate(query, {
        trigger: true,
        replace: true
      });
    } else {
      app_router.on('route:defaultRoute', function() {
        log('there is no routes for such url string!');
      });

      app_router.on('route:mainRoute', function(cars,cat,subcat) {
        // Note the variable in the route definition being passed in here
        var carsArr = cars.split(","),
          l = carsArr.length,
          i = 0;

        function recursiveLoad(i) {        
          renderCar(carsArr[i].replace(/\&/g, "/"), function() {
            i += 1;
            if (i < l) {
              recursiveLoad(i);
            }
          } );
        };
        recursiveLoad(i);
      });
      // Start Backbone history a necessary step for bookmarkable URL's
      Backbone.history.start();
    }
  }

  function renderCar(url, callback) {
    ajaxRequest = {
      url: url,
      dataType: 'script',// Use default: Intelligent Guess type select, because text/html header is returned for no results;
      type: 'GET'
      //data: 'cat=mobile&q=' + encodeURIComponent(searchInput) + requestParams
    };
    $.ajax(ajaxRequest).done(function(){
      var l = __xxx.length,
        $rows = $('.content-row'),
        content = [],
        html = "";
      // for (var i = 0; i < l; i+=1) {
      //   var text = $(__xxx[i]).text();
      //   if (text && text != " ") {
      //     console.log(text);
      //     content.push(text);
      //   }
      // }
      for (var i = 0; i < l; i+=1) {
        if ($rows[i]) {
          if (i == 0) {
            var $oldHeader = $(__xxx[i]);
            var modelName = $oldHeader.find('.model-name').html();
            var modelIcon = $oldHeader.find('img[alt="suv"]')[0].outerHTML;
            $($rows[i]).append('<th>' + modelIcon + '<p>' + modelName + '</p>' + '</th>');

          } else {
            $($rows[i]).append(__xxx[i]);
            var img = $($rows[i]).find("img"),
              alt;
            //.replace('<img src="/cro/resources/content/images/blobs/blob_3.gif" width="11" height="11" alt="Good">', 'Good');
            img.each(function(){
              alt = $(this).attr('alt');
              $(this)[0].outerHTML = "<span class='quality' data-quality='" + alt + "'>" + alt + "</span>";
            });
          } 
        }       
      }
      $('#clear-button').prop("disabled", false).removeClass("disabled");
      callback(ajaxRequest);
    });
  }

  function loadMakes() {
    var makes,
      state = $('input[name="state"]').val();

    $('#make').html('');
    $('#model').html('');

    if(state === "new") {
      makes = MakeModelComparePulldowns.thePulldownNewData;
    } else {
      makes = MakeModelComparePulldowns.thePulldownUsedData;
    }
    $("#make").html(_.template($('#make-select_template').html(), {makes: makes}));

  }

  $(function() {
    $("#compare").html(_.template($('#content-table_template').html(), {tableRows: contentStructure}));
    $('input[name="state"]').on('change', function(){
      loadMakes();
    });
    $('#make').on('change', function(){
      var state = $('input[name="state"]:checked').val(),
        make = $('#make').val(),
        makes,
        makeContent;
      if(state === "new") {
        makes = MakeModelComparePulldowns.thePulldownNewData;
      } else {
        makes = MakeModelComparePulldowns.thePulldownUsedData;
      }
      makeContent = _.find(makes, function(el){
        return el.makeName == make;
      });
      if (makeContent) {
        $("#model").html(_.template($('#model-select_template').html(), {models: makeContent.models}));
      } else {
        $("#model").html(_.template($('#model-select_template').html(), {models: []}));        
      }
    });
    
    $("#load-cars").on("submit", function(){
      url = "/cars/" + $('#model').val();
      renderCar(url, function(){
        startRouting({
          action: "add",
          car: ajaxRequest.url
        });
      });
      return false;
    });

    $('#compare').on('click', '.model-bar', function(e){
      var $td = $(this).parents('td'),
        car = $td.first().attr('id').slice(0, -2);

      $('[id^="' + car + '"]').remove();

      startRouting({
        action: "remove",
        car: car
      });

    });
    $('#compare').on('click', '.content-title', function(e){
      var cat = $(this).data("cat");
      $(".cat-" + cat).toggleClass("item-hidden");
    });
    $('#compare').on('click', '.content-subtitle', function(e){
      var cat = $(this).data("cat");
      var subcat = $(this).data("subcat");
      $(".subcat-" + cat + "-" + subcat).toggleClass("sub-item-hidden");
    });
    $('#compare').on('click', '#clear-button', function(e){
      $("#compare").html(_.template($('#content-table_template').html(), {tableRows: contentStructure}));
      startRouting({
        action: "removeAll"
      });
    });
    $(window).on('scroll', function(){
      var top = $(".compare-table").first().position().top;
      var scrollTop = $(this).scrollTop();
      if (scrollTop >= top) {
        $(".compare-table").addClass('header-fixed');
      } else {
        $(".compare-table").removeClass('header-fixed');        
      }

    });
    $('.compare-table').dragtable();
    loadMakes();
    startRouting();
  });
})(window);