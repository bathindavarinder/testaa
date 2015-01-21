﻿
define(['require', 'CustomFunctions'],
    function (require, custom) {
        //    return signalr;

        $("#Message").slideUp(1);

        if (window.Cordova) {
            $.connection.hub.url = "http://bathindavarinder-001-site1.smarterasp.net/signalr";
        }
        $.connection.hub.url = "http://bathindavarinder-001-site1.smarterasp.net/signalr";

        window.timeout = false;

        window.reconnecting = false;

        window.game = $.connection.gameHub;

        window.Userturn = "";

        var tryingToReconnect = false;

        var UserName = localStorage.getItem("Name");
        var Group = localStorage.getItem("Group");


        SendMessage = function () {
            var Message = $("#HomeMessage").val();

            if (Message == "") {
                return;
            } 
            window.game.server.sendMessage(Group, UserName, Message);

            $("#HomeMessage").val("");
        }
        window.game.client.GameClosed = function () {
            localStorage.setItem("cardType", "");
            resettimer();
            $('.card').remove();
            showNotification("Game Closed as all left.");
        };

        window.game.client.TimedOut = function () {

            resettimer();

            $('.card').remove();
            showNotification("You are removed from this game.");
        };

        function resettimer() {
            document.getElementById("timer").innerHTML = "";
            window.timein = 50;
            window.timeout = false;
            clearInterval(window.myVar);
        }

        function myStopFunction() {
            clearInterval(window.myVar);
            window.myVar = undefined;
        }

        function myTimer() {
            //if (window.timeIn == 0) {
            //    if (window.Userturn == localStorage.getItem("Name")) {
            //        window.game.server.asktimeOut(window.Userturn, window.gameJoin, window.cardJoin);
            //    }
            //    resettimer();
            //}
            //window.timeIn = parseFloat(window.timeIn) - parseFloat(1);
            //document.getElementById("timer").innerHTML = window.Userturn + "'s turn : " + window.timeIn + " seconds left."; 
        }



        window.game.client.StartTimer = function (user, game, card) {

            window.timeIn = 50;

            window.timeout = true;
            window.Userturn = user;
            window.gameJoin = game;

            if (card == "disc") {
                card = localStorage.getItem("cardType");
            }

            window.cardJoin = card;
            window.myVar = setInterval(function () { myTimer() }, 2000);
        };

        window.game.client.updateUserStatus = function (user, status) {
            $('#' + user).text(user + "(" + status + ")");
            $('#' + user).addClass("FinishedUser");
        }
        window.game.client.updateUserTurn = function (user) {
            $('.turn').removeClass('turn');
            $('#' + user).addClass("turn");
        }


        window.game.client.updateUserList = function (userlist) {
            $('#users').empty();
            var users = userlist.split('$');
            $.each(users, function (index, name) {
                if (name != "") {
                    var user = "<li id='" + name + "'><a href='#' class='icon user'>" + name + "</a></li>";
                    $('#users').append(user);
                }
            });
        }


        window.game.client.registered = function (name) {
            //  alert("you are registered");
        };
        window.game.client.sendConfirm = function (msg) {
            //  alert(msg);
        };

        window.game.client.informGroupName = function (name) {
            localStorage.setItem("Group", name);
        };

        window.game.client.FirstTurn = function (message) {
            showNotification(message);
        };

        window.game.client.groupMessage = function (message) {
            showNotification(message);
        };



        window.game.client.thokaGiven = function (cs) {

            $('.card:not(.active)').removeClass("animatedCard");
            $('.card:not(.active)').addClass("animatedOutCard");
            setTimeout(function () {
                showNotification("Thoka given to you.");
                $('.card:not(.active)').remove();
                localStorage.setItem("cardType", "");
            }, 1000);


            resettimer();
            //showNotification("Thoka given to " + cs);
            var Cards = cs.split(';');

            var x = 0;
            var y = 0;
            $.each(Cards, function (index, name) {
                if (name != "") {
                    var idandcard = name.split('?');

                    var cardtype = idandcard[1].split('-')[1];
                    //var card = '<div data-x="' + x + '" data-y="' + y + '" id="' + idandcard[0] + '" class="card mine ' + idandcard[1] + ' ' + cardtype + ' active" data-card="' + cardtype + '" ></div>';
                    var card = '<div id="' + idandcard[0] + '" class="animatedCard card mine thrownCard ' + idandcard[1] + ' ' + cardtype + ' active" data-card="' + cardtype + '" ></div>';
                    $('.content').append(card);
                }
            });
        };

        window.game.client.thrownCard = function (user, card) {

            resettimer();

            var idandcard = card.split('?');

            if ($('#' + idandcard[0]).length) {
                $('#' + idandcard[0]).remove();
            }

            var cardtype = idandcard[1].split('-')[1];

            var card = '<div  id="' + idandcard[0] + '" class="card ' + idandcard[1] + ' ' + cardtype + ' thrownCard animatedCard" ></div>';
            $('#outer-dropzone').append(card);

            showNotification(user + " has thrown '" + idandcard[1].split('-')[2] + "' of " + cardtype);
        };




        window.game.client.turnComplete = function (user) {

            $('.card:not(.active)').removeClass("animatedCard");
            $('.card:not(.active)').addClass("animatedOutCard");

            setTimeout(function () {
                showNotification("Turn Completed");
                $('.card:not(.active)').remove();//.css("visibility", "hidden");
                showNotification(user + " will start.");
                localStorage.setItem("cardType", "");
            }, 2000);


        };

        window.game.client.startTurn = function () {
            localStorage.setItem("cardType", "");

            $('.mine').addClass("dropcan");
        };



        window.game.client.yourTurn = function (card) {
            if (card == "disc") {
                card = localStorage.getItem("cardType");
            }
            localStorage.setItem("cardType", card);

            if (!$('.' + card + '.active').length) {
                $('.mine').addClass('dropcan');
                return;
            }

            showNotification("Your Turn.");
            if (card == "hukam") {
                ActivateHukam("");
            } else
                if (card == "chidi") {
                    ActivateChiddi();
                } else
                    if (card == "itt") {
                        Activateitt();
                    } else
                        if (card == "heart") {
                            ActivateHeart();
                        }

        };

        var messageCount = 0;

        function showNotification(Message) {

            if (messageCount < 6) {
                messageCount = messageCount + 1;
            } else {
                $('#Message').empty();
                messageCount = 0;
            }

            $("#Message").slideDown(1000);
            $('#Message').append("<div>" + Message + "</div>");


            setTimeout(function () {
                $("#Message").slideUp(1000);
            }, 5000);
        }


     
        var havHukamA = false;

        window.game.client.sendCards = function (cards) {

            custom.show('loading', false);

            custom.show('afui', true);

            $(".container").fadeIn(400);


            $('.card').remove();
            var Cards = cards.split(";");
            var x = 0;
            var y = 0;
            $.each(Cards, function (index, name) {
                var idandcard = name.split('?');

                var cardtype = idandcard[1].split('-')[1];

                if (idandcard[1] == "card-hukam-a") {
                    havHukamA = true;
                }

                //var card = '<div data-x="' + x + '" data-y="' + y + '" id="' + idandcard[0] + '" class="card mine ' + idandcard[1] + ' ' + cardtype + ' active" data-card="' + cardtype + '" ></div>';
                var card = '<div id="' + idandcard[0] + '" class="card thrownCard mine ' + idandcard[1] + ' ' + cardtype + ' active" data-card="' + cardtype + '" ></div>';
                $('#Cards').append(card);



                //});
                x = x + 30;
                y = y - 79;

            });

            //var xz = 0;
            //var yz = 0;
            //$.each($('.heart'), function (index, name) {

            //    var datay = $(name).attr('data-y');
            //    datay = parseFloat(datay) + parseFloat(100);
            //    var datax = $(name).attr('data-x');
            //    $(name).css({
            //        'transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-webkit-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-moz-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-ms-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-o-transform': 'translate(' + xz + 'px,' + datay + 'px)'
            //    });
            //    $(name).attr('data-y', datay);
            //    $(name).attr('data-x', xz);
            //    xz = xz + 30;

            //});

            //xz = xz + 100;
            //yz = 0;
            //$.each($('.chidi'), function (index, name) {

            //    var datay = $(name).attr('data-y');
            //    datay = parseFloat(datay) + parseFloat(100);
            //    var datax = $(name).attr('data-x');
            //    //    xz =   parseFloat(datax) + parseFloat(30);

            //    $(name).css({
            //        'transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-webkit-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-moz-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-ms-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-o-transform': 'translate(' + xz + 'px,' + datay + 'px)'
            //    });
            //    $(name).attr('data-y', datay);
            //    $(name).attr('data-x', xz);
            //    xz = xz + parseFloat(30);
            //});

            //xz = 0;
            //yz = 0;
            //$.each($('.hukam'), function (index, name) {

            //    var datay = $(name).attr('data-y');
            //    // datay = parseFloat(datay) + parseFloat(100);
            //    var datax = $(name).attr('data-x');


            //    $(name).css({
            //        'transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-webkit-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-moz-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-ms-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-o-transform': 'translate(' + xz + 'px,' + datay + 'px)'
            //    });

            //    $(name).attr('data-y', datay);
            //    $(name).attr('data-x', xz);

            //    xz = xz + parseFloat(30);
            //});

            //xz = xz + 100;
            //yz = 0;
            //$.each($('.itt'), function (index, name) {

            //    var datay = $(name).attr('data-y');
            //    // datay = parseFloat(datay) + parseFloat(100);
            //    var datax = $(name).attr('data-x');

            //    if (xz == 0) {
            //        xz = parseFloat(datax);
            //    }
            //    $(name).css({
            //        'transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-webkit-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-moz-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-ms-transform': 'translate(' + xz + 'px,' + datay + 'px)',
            //        '-o-transform': 'translate(' + xz + 'px,' + datay + 'px)'
            //    });
            //    $(name).attr('data-y', datay);
            //    $(name).attr('data-x', xz);
            //    xz = xz + parseFloat(30);
            //});

            if (havHukamA) {
                window.game.server.firstTurnMessage(Group, UserName);
                ActivateHukam("a");
                showNotification("Your Turn! please throw hukam 'A'");
            }
            localStorage.setItem("cardType", "hukam");

        };

        function ActivateHukam(specific) {
            if (specific == "") {
                $('.hukam').addClass("dropcan");
            } else {
                $('.card-hukam-a').addClass("dropcan");
            }
        }

        function ActivateHeart() {
            $('.heart').addClass("dropcan");
        }

        function ActivateChiddi() {
            $('.chidi').addClass("dropcan");
        }

        function Activateitt() {

            $('.itt').addClass("dropcan");

        }





        $.connection.hub.reconnecting(function () {
            window.reconnecting = true;

        });

        $.connection.hub.connectionSlow(function () {


        });

        $.connection.hub.reconnected(function () {

            var myClientId = $.connection.hub.id;

            if (myClientId != localStorage.getItem("ConnId")) {

                var yourname = localStorage.getItem("Name");

                window.chat.server.updateConnId(localStorage.getItem("ConnId"), myClientId, yourname);

                localStorage.setItem("ConnId", myClientId);
            }

            if (localStorage.getItem("SendCard") && localStorage.getItem("SendCard") != "") {

                var card = localStorage.getItem("SendCard");

                var details = card.split('$');

                window.game.server.throwCard(details[0], details[1], details[2], details[3], details[4]);

                localStorage.setItem("SendCard", "");
            }
            window.reconnecting = false;

        });

        $.connection.hub.disconnected(function () {

            window.reconnecting = true;

            $.connection.hub.start().done(function () {

                var myClientId = $.connection.hub.id;

                window.game = $.connection.gameHub;

                var yourname = localStorage.getItem("Name");

                window.game.server.Register(yourname);

                if (localStorage.getItem("SendCard") && localStorage.getItem("SendCard") != "") {

                    var card = localStorage.getItem("SendCard");

                    var details = card.split('$');

                    window.game.server.throwCard(details[0], details[1], details[2], details[3], details[4]);

                    localStorage.setItem("SendCard", "")
                }
                window.reconnecting = false;
            });
        });



        var JoinRoom = function (groupname, name) {
            // window.chat.server.joinRoom(groupname, name);
        };

        function successHandler(result) {

        }
        function errorHandler(error) {
            //alert('error = ' + error);
        }

        window.onNotificationGCM = function (e) {
            //$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

            console.log("event fired : " + e.event);
            switch (e.event) {
                case 'registered':
                    if (e.regid.length > 0) {

                        console.log("regID = " + e.regid);

                        localStorage.setItem("FirstTime", "false");
                        var name = localStorage.getItem("Name");
                        SendGCMID(name, e.regid);
                    }
                    break;

                case 'message':
                    if (e.foreground) {
                        var message = e.payload.message;

                        var n = message.indexOf(":");

                        var name = message.substring(0, n);
                        console.log("got name : " + name);
                        custom.showNotification(name, e.payload.message);

                    }
                    else {
                        var message = e.payload.message;

                        var n = message.indexOf(":");

                        var name = message.substring(0, n);
                        console.log("got name : " + name);
                        custom.showNotification(name, e.payload.message);
                    }
                    break;

                case 'error':
                    //$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                    break;

                default:
                    //$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                    break;
            }
        };




        var SendGCMID = function (name, GCMId) {

        };

        //var signalr = {
        return {
            // Application Constructor

            SendGCMID: SendGCMID,
            initialize: function () {

                document.addEventListener("offline", this.onOffline, false);

            }, JoinRoom: JoinRoom,
            initiateConnection: function () {


                if (custom.CheckConnection()) {



                    $.connection.hub.start().done(function () {
                        var myClientId = $.connection.hub.id;
                        localStorage.setItem("ConnId", myClientId);
                        //chat.server.updateName(myClientId, $('#displayname').val());
                        var name = localStorage.getItem("Name");
                        var room = localStorage.getItem("room");


                        if (!localStorage.getItem("FirstTime")) {
                            if (window.Cordova) {

                                pushNotification = window.plugins.pushNotification;
                                pushNotification.register(
                                        successHandler,
                                        errorHandler,
                                        {
                                            "senderID": "899559090645",
                                            "ecb": "onNotificationGCM"
                                        });
                            }
                        }


                        // JoinRoom(room, name);

                    });

                }
            },
            startConnection: function () {

                if (custom.CheckConnection()) {

                    $.connection.hub.start().done(function () {
                        var myClientId = $.connection.hub.id;
                        var name = localStorage.getItem("Name");
                        localStorage.setItem("ConnId", myClientId);
                        //var uniqueId = localStorage.getItem("uniqueId");
                        window.game.server.register(name);
                        //     window.chat.server.registerUser(uniqueId, name);

                    });

                } else {
                    alert("please check your network.");
                }
            }
        };
    });

