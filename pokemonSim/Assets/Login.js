var loginfunc = function (login_type)
{
    if ($("#myModal").hasClass("show")) {

        var username = $(".modal-login #username").val();
        var password = $(".modal-login #password").val();
    }
    else {

        var username = $(".popover #username").val();
        var password = $(".popover #password").val();
    }   
    
   
    var USER_LOGIN = {
        "ffID": username,
        "password": password
    }
    if (login_type == "UNCHECKED") {

        $.post(
            base_url + "Users/is_valid",
            {
                "FFID": username
            },
            function (is_valid) {
                console.log(is_valid);
                if (is_valid == "YES") {
                    alert("YES");
                }
                if (is_valid == "NO") {
                    alert("NO");
                }
            }
        )

        $.post(
            base_url + "Users/Login_employee",
                USER_LOGIN,
                function (data) {
                    console.log(data);

                    if (data.done == "TRUE") {

                        $.notify({
                            title: '<strong>LOGGING IN!</strong>',
                            message: "Please wait"
                        }, {
                            type: 'success',
                            z_index: 9999
                        });
                        setTimeout(function () {
                            $.notifyClose('top-right');
                            window.location.reload();
                        }, 2000);
                    }
                    else if (data.done == "FALSE") {
                        $.notify({
                            title: '<strong>PASSWORD INCORRECT!</strong>',
                            message: "Please try again"
                        }, {
                            type: 'warning',
                            z_index: 9999
                        });
                        setTimeout(function () {
                            $.notifyClose('top-right');
                        }, 2000);

                    }
                }
        );
    }
    else if (login_type == "CHECKED") {
        //alert(username);
        $.post(
            base_url + "Users/Login_employee_noad",
            {
                "username": username,
                "password": password
            },
            function (data) {
                console.log(data);
                if (data.done == "TRUE") {

                    $.notify({
                        title: '<strong>LOGGING IN!</strong>',
                        message: "Please wait"
                    }, {
                        type: 'success',
                        z_index: 9999
                    });
                    setTimeout(function () {
                        $.notifyClose('top-right');
                        window.location.reload();
                    }, 2000);
                }
                else if (data.done == "FALSE") {
                    $.notify({
                        title: '<strong>PASSWORD INCORRECT!</strong>',
                        message: "Please try again"
                    }, {
                        type: 'warning',
                        z_index: 9999
                    });
                    setTimeout(function () {
                        $.notifyClose('top-right');
                    }, 2000);

                }
            }
        );
    }
    

}
$(document).on("click", "#log-in", function () {
    //alert($('#no-ad-login').val());
    var login_type = $('#no-ad-login').val();
    loginfunc(login_type);
});

$(document).keypress(function (e) {
    if ((e.keycode == 13 || e.which == 13) && $("#log-in").hasClass("btn-success")) {
        var login_type = $('#no-ad-login').val();
        loginfunc(login_type);
    }
});

$("#logout_user").on("click", function () {
    $.post(
        base_url + "Users/Logout",
            function (data) {
                $.notify({
                    title: '<strong>LOGGING OFF!</strong>',
                    message: "Please wait"
                }, {
                    type: 'secondary'
                });
                setTimeout(function () {
                    $.notifyClose('top-right');
                    //window.location.href = base_url + "FLA/Index";
                    window.location.reload();
                }, 2000);
            }
    );
});
