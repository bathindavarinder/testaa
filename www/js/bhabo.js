//var room = {
define(['require', 'GameHub', 'CustomFunctions'],
function (require, signal, custom) {

    // Application Constructor
    var initialize = function () {

        if (custom.CheckConnection()) {

            custom.show('loading', true);

            custom.show('afui', false);

            var width = window.innerWidth;
            var height = window.innerHeight;

            var pixelRatio = window.devicePixelRatio || 1;

            width = window.innerWidth * pixelRatio;
            height = window.innerHeight * pixelRatio;
            
          //  //$('.main-content').css('height', height);
              
           
          //  //$('.content').css('height', 19 * (height / 20));

          $('#outer-dropzone').css('height', 2 * (height / 10));

         ////   $('#outer-dropzone').css('width', width);

         //   //var size = width + "px " + 4 * (height / 10) + "px";
         //   //$('#outer-dropzone').css('background-size', size);


         //   $('#Message').css('height', (height / 5));
           // $('#Message').css('width', width);
            bindEvents();
        } else {
            alert("Please check your network connection !");
            window.location = "index.html";
        }
    };
    var bindEvents = function () {


        if (!window.Cordova) {
            $(document).ready(function () {

                readyFunction();

            });
        }
        document.addEventListener('deviceready', onDeviceReady, false);

        document.addEventListener("backbutton", function () {

            window.location = "index.html";
        }, false);

        document.addEventListener("pause", pauseapp, false);

        document.addEventListener("resume", resumeapp, false);

        menuDiv = document.querySelector("#menu");
             //document.addEventListener("menubutton", doMenu, false);

    };
    var pauseapp = function () {
        window.background = true;
    }
    var resumeapp = function () {
        window.background = false;
    };
    var onDeviceReady = function () {                             // called when Cordova is ready
        if (window.Cordova && navigator.splashscreen) {


            readyFunction();
        }
    };
    var menuOpen = false;
    var menuDiv = "";

  
    var readyFunction = function () {

        $.ui.setSideMenuWidth('210px');
        $.ui.isSideMenuEnabled(false);
        window.Scroller = $(".MainComments").scroller({
            lockBounce: true
        });
        //$("[data-toggle]").click(function () {
        //    var toggle_el = $(this).data("toggle");
        //    $(toggle_el).toggleClass("open-sidebar");
        //    event.stopPropagation();
        //});
        //$('#sidebar').click(function (event) {
        //    event.stopPropagation();
        //});
        //$('.container').click(function (event) {
             
        //    $(".container").removeClass("open-sidebar");
        //    return true;
        //});
         
        //document.addEventListener('touchmove', function (e) {
        //    $(".container").removeClass("open-sidebar");
        //}, false);

        //$(".main-content").swipe({
        //    swipeStatus: function (event, phase, direction, distance, duration, fingers) { 
                   
        //            return true; 
        //    }
        //});

        signal.startConnection();

        $("#Send").on("click", function () {
            signal.SendMessage();
        });

        window.background = false;

        //window.MessageScroller= $("#Message").scroller({
        //    lockBounce: false
        //});



        //$('.ui-loader-default').remove();

        //$('#start').click(function () {
        //    $('#outer-dropzone').addClass("dropzone");

        //});
        //$('#pause').click(function () {
        //    $('#outer-dropzone').removeClass("dropzone");

        //});
    }






    initialize();
});


