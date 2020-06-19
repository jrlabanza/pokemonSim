if (compare_url == "CREATEOSR") {
    //$(document).on("click", ".form-check-input[name='sched']", function () {
    //    alert($(".form-check-input[name='sched']:checked").val());
    //});
    var dateTime = new Date($.now());
    function convertMS(milliseconds) {
        var day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return {
            day: day,
            hour: hour,
            minute: minute,
            seconds: seconds
        };
    }
   
    $("#m3-number").val("M3" + dateTime.getTime());

    $('.customdate').daterangepicker({
        "singleDatePicker": true,
        "autoApply": true,
        "hour": "06",
        "drops": "up",
        locale: {
            format: "YYYY-MM-DD 06:00:00"
        }

    },
    function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });

    $.post(
        base_url + "Dashboard/get_tester_id",
        function (data)
        {
            var append = "";
            $.each(data, function (i, tester_id) {
                var tstID = tester_id.Tester_ID;
                append += "<option>" + tstID.toUpperCase() + "</option>";
            })
            $("#tester-id-datalist").append(append);
        }
    )
    //HANDLER TST

    $.post(
        base_url + "Dashboard/get_handler_id",
        function (data)
        {
            var append = "";
            $.each(data, function (i, handler_id) {
                var hdID = handler_id.HAND;
              append += "<option>" + hdID.toUpperCase() + "</option>";
            })
            $("#handler-id-datalist").append(append);
			    $.post(
					base_url + "Dashboard/get_handler_id_xfn",
					function (data) {
						var append = "";
						$.each(data, function (i, handler_id) {
							var hdID = handler_id.Equipt_ID;
							append += "<option>" + hdID.toUpperCase() + "</option>";
						})
						$("#handler-id-datalist").append(append);
					}
			)
        }
    )

    $.post(
        base_url + "Dashboard/get_process",
        function (data) {
            var append = "";
            $.each(data, function (i, process_id) {
                append += "<option>" + process_id.process + "</option>";
            })
            $("#process").append(append);
        }
    )

    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        var fileLen = this.files.length
        $(this).siblings(".custom-file-label").addClass("selected").html(fileLen + " FILE/S SELECTED");
    });

    $(document).on("keyup change select", "#tester-id", function () {
        var testerID = $("#tester-id").val();
        $.post(
            base_url + "Dashboard/get_handler_id_from_tester_id",
            {
                "testerID": testerID
            },
            function (data) {
                $("#handler-id").val(data.Handler_ID);
            }
            )
    });

    $(document).on("keyup change select", "#handler-id", function () {
        var handlerID = $("#handler-id").val();
        $.post(
            base_url + "Dashboard/get_tester_id_from_handler_id",
            {
                "handlerID": handlerID
            },
            function (data) {
                $("#tester-id").val(data.TesterID);
            }
            )
    });

    $(document).on("keyup change select", "#family", function () {
        var familyID = $("#family").val();
        $.post(
            base_url + "Form/get_package_from_family",
            {
                "familyID": familyID
            },
            function (data) {
                $("#package").val(data.Pkg_Type);
            }
            )
    });

    if ($(".custom-control-input[name='sched']:checked").val() == "UNPLANNED") {
        $(".reason-for-unplanned-trigger").prop("hidden", false);
    }
    else {
        $(".reason-for-unplanned-trigger").prop("hidden", true);
    }

    $(document).on("click", ".scheduled-row", function () {
        if ($(".custom-control-input[name='sched']:checked").val() == "UNPLANNED") {
            $(".reason-for-unplanned-trigger").prop("hidden", false);
        }
        else {
            $(".reason-for-unplanned-trigger").prop("hidden", true);
        }
    });


    $("#create-form-osr").on('click', function (e) {
        e.preventDefault();

        $.post(
            base_url + "Form/get_existing_m3Number",
            {
                "testerID": $("#tester-id").val(),
                "handlerID": $("#handler-id").val(),
                "package": $("#package").val(),
                "family": $("#family").val()
            },
            function (existing_m3Number) {

                if (existing_m3Number.testerID == null || existing_m3Number.handlerID == null || (existing_m3Number.status == "FORM CANCELLED" || existing_m3Number.status == "RELEASED" || existing_m3Number.status == "RETURNED")) {
                    if ($("#tester-id").val() == "" || $("#handler-id").val() == "" || $("#family").val() == "" || $("#package").val() == "" || $("#process").val() == "") {

                        $.notify({
                            title: '<strong>PLEASE FILL UP ALL INFORMATION!</strong>',
                            message: ""
                        }, {
                            type: 'danger'
                        });
                        setTimeout(function () {
                            $.notifyClose('top-right');
                        }, 1000);

                        if ($("#tester-id").val() == "") {
                            $("#tester-id").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#tester-id").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#handler-id").val() == "") {
                            $("#handler-id").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#handler-id").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#family").val() == "") {
                            $("#family").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#family").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#package").val() == "") {
                            $("#package").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#package").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#process").val() == "") {
                            $("#process").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#process").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($(".custom-control-input[name='sched']:selected").val() == null) {
                            $(".custom-control-input").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $(".custom-control-input").addClass("is-valid").removeClass("is-invalid");
                        }


                    }
                    else {
                        if ($("input#file-upload-osr")[0].files.length == 0) {
                            $.notify({
                                title: '<strong>PLEASE ATTACH A DOCUMENT!</strong>',
                                message: ""
                            }, {
                                type: 'danger'
                            });
                            setTimeout(function () {
                                $.notifyClose('top-right');
                            }, 1000);
                        }
                        else {
                            var testerID = $("#tester-id").val();
                            var handlerID = $("#handler-id").val();
                            var family = $("#family").val();
                            var package = $("#package").val();
                            var process = $("#process").val();
                            var fileLen = $("input#file-upload-osr")[0].files.length;
                            var expectedDateofSetup = $("#expected-date-of-setup").val();
                            var shift = $("#shift").val();
                            var status = $("#status").val();
                            var formData = new FormData();
                            var m3Number = $("#m3-number").val();
                            var schedule = $(".custom-control-input[name='sched']:checked").val();
                            var reasonForUnplannedSetup = $("#reason-for-unplanned").val();
                            OSR_DATA =
                            {
                                "testerID": testerID.toUpperCase(),
                                "handlerID": handlerID.toUpperCase(),
                                "family": family.toUpperCase(),
                                "package": package.toUpperCase(),
                                "process": process.toUpperCase(),
                                "fileLen": fileLen,
                                "expectedDateofSetup": expectedDateofSetup,
                                "shift": shift.toUpperCase(),
                                "status": status,
                                "m3Number": m3Number,
                                "data_check": compare_url,
                                "schedule": schedule,
                                "reasonForUnplannedSetup": reasonForUnplannedSetup
                            }
                       
                            $.post(
                                base_url + "Form/OSRFormSubmit",
                                OSR_DATA,
                                function (data) {
                                    console.log("ok");
                                    var lastId = data.id;
                                    formData.append("data_check", compare_url);
                                    if (fileLen > 0) {
                                        formData.append("fileLen", fileLen);
                                        formData.append("lastId", lastId);
                                        for (var i = 0; i < fileLen; i++) {
                                            nameTmp = "osr_" + i;
                                            formData.append(nameTmp, $("input#file-upload-osr")[0].files[i]);
                                        }

                                        var request = $.ajax({
                                            url: base_url + "Form/UploadDocumentsOSR",
                                            type: "post",
                                            data: formData,
                                            contentType: false,
                                            cache: false,
                                            processData: false
                                        });

                                        request.done(function (uploadImage) {

                                            $.notify({
                                                title: '<strong>Success!</strong>',
                                                message: "Data has been inputted with upload. Returning to Dashboard"
                                            }, {
                                                type: 'success',
                                                z_index: 9999
                                            });
                                            setTimeout(function () {
                                                $.notifyClose('top-right');
                                                window.location.href = base_url + "Dashboard/OSR";
                                            }, 3000);


                                        });
                                    }
                                    else {
                                        $.notify({
                                            title: '<strong>Success!</strong>',
                                            message: "Data has been inputted. Returning to Dashboard"
                                        }, {
                                            type: 'success',
                                            z_index: 9999
                                        });
                                        setTimeout(function () {
                                            $.notifyClose('top-right');
                                            window.location.href = base_url + "Dashboard/OSR";
                                        }, 3000);
                                    }
                                }
                            )
                        }
                    }
                }
                else {
                    $.notify({
                        title: '<strong>M3 Exists with the current information!</strong>',
                        message: ""
                    }, {
                        type: 'danger',
                        z_index: 9999
                    });
                    setTimeout(function () {
                        $.notifyClose('top-right');
                    }, 3000);
                }
            }
        );
    });

}

if (compare_url == "CREATEOSRBURNIN") {

    $.post(
    base_url + "Dashboard/m3_burn_in_number_by_id",
    function (data) {

        var m3gen = parseInt(data.id) + 1;
        var m3num = "";

        if ($.isNumeric(data.id)) {
            if (data.id <= 9) {
                var m3num = "M3000" + m3gen;
            }
            else if (data.id <= 99) {
                var m3num = "M300" + m3gen;
            }
            else if (data.id <= 999) {
                var m3num = "M30" + m3gen;
            }
            else {
                var m3num = "M3" + m3gen;
            }
        }
        else {

            var m3num = "M30001";
        }



        $("#m3-number").val(m3num);
    }
    )

    $('.customdate').daterangepicker({
        "singleDatePicker": true,
        "autoApply": true,
        "hour": "06",
        "drops": "up",
        locale: {
            format: "YYYY-MM-DD 06:00:00"
        }

    },
    function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });

    $.post(
        base_url + "Dashboard/get_tester_id",
        function (data) {
            var append = "";
            $.each(data, function (i, tester_id) {
                var tstID = tester_id.Tester_ID;
                append += "<option>" + tstID.toUpperCase() + "</option>";
            })
            $("#tester-id-datalist").append(append);
        }
    )
    //HANDLER TST

    $.post(
        base_url + "Dashboard/get_handler_id_burnin",
        function (data) {
            var append = "";
            $.each(data, function (i, handler_id) {
                var hdID = handler_id.New_Tester_ID;
                var truehdID = handler_id.Tester_ID;
                append += "<option value='" + truehdID + "'>" + hdID.toUpperCase() + "</option>";
            })
            $("#handler-id-datalist").append(append);
        }
    )



    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        var fileLen = this.files.length
        $(this).siblings(".custom-file-label").addClass("selected").html(fileLen + " FILE/S SELECTED");
    });

    $(document).on("keyup change select", "#tester-id", function () {
 
        var testerID = $("#tester-id").val();
        $.post(
            base_url + "Dashboard/get_handler_id_from_tester_id",
            {
                "testerID": testerID
            },
            function (data) {
                console.log(data);
                $("#handler-id").val(data.Handler_ID);
            }
            )
    });

    $(document).on("keyup change select", "#handler-id", function () {
   
        var handlerID = $("#handler-id").val();
        $.post(
            base_url + "Dashboard/get_tester_id_from_handler_id",
            {
                "handlerID": handlerID
            },
            function (data) {
                $("#tester-id").val(data.TesterID);
            }
            )
    });

    $(document).on("keyup change select", "#family", function () {
        var familyID = $("#family").val();
        $.post(
            base_url + "Form/get_package_from_family",
            {
                "familyID": familyID
            },
            function (data) {
                $("#package").val(data.Pkg_Type);
            }
            )
    });


    $("#create-form-osr").on('click', function (e) {
        e.preventDefault();

        $.post(
            base_url + "Form/get_existing_m3Number_burnin",
            {
                "testerID": $("#tester-id").val(),
                "handlerID": $("#handler-id").val(),
                "package": $("#package").val(),
                "family": $("#family").val()
            },
            function (existing_m3Number) {
                if (existing_m3Number.testerID == null || existing_m3Number.handlerID == null || (existing_m3Number.status == "FORM CANCELLED" || existing_m3Number.status == "RELEASED")) {
                    if ($("#tester-id").val() == "" || $("#handler-id").val() == "" || $("#family").val() == "" || $("#package").val() == "" || $("#process").val() == "") {

                        $.notify({
                            title: '<strong>PLEASE FILL UP ALL INFORMATION!</strong>',
                            message: ""
                        }, {
                            type: 'danger'
                        });
                        setTimeout(function () {
                            $.notifyClose('top-right');
                        }, 1000);

                        if ($("#tester-id").val() == "") {
                            $("#tester-id").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#tester-id").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#handler-id").val() == "") {
                            $("#handler-id").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#handler-id").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#family").val() == "") {
                            $("#family").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#family").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#package").val() == "") {
                            $("#package").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#package").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#process").val() == "") {
                            $("#process").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#process").addClass("is-valid").removeClass("is-invalid");
                        }

                    }
                    else {
                        if ($("input#file-upload-osr")[0].files.length == 0) {
                            $.notify({
                                title: '<strong>PLEASE ATTACH A DOCUMENT!</strong>',
                                message: ""
                            }, {
                                type: 'danger'
                            });
                            setTimeout(function () {
                                $.notifyClose('top-right');
                            }, 1000);
                        }
                        else {

                            var handlerID = $("#handler-id").val();
                            var family = $("#family").val();
                            var package = $("#package").val();
                            var process = $("#process").val();
                            var fileLen = $("input#file-upload-osr")[0].files.length;
                            var expectedDateofSetup = $("#expected-date-of-setup").val();
                            var shift = $("#shift").val();
                            var status = $("#status").val();
                            var formData = new FormData();
                            var m3Number = $("#m3-number").val();
                            OSR_DATA =
                            {
                                "handlerID": handlerID.toUpperCase(),
                                "family": family.toUpperCase(),
                                "package": package.toUpperCase(),
                                "process": process.toUpperCase(),
                                "fileLen": fileLen,
                                "expectedDateofSetup": expectedDateofSetup,
                                "shift": shift.toUpperCase(),
                                "status": status,
                                "m3Number": m3Number,
                                "data_check": compare_url
                            }

                            $.post(
                                base_url + "Form/OSRFormSubmit",
                                OSR_DATA,
                                function (data) {
                                    console.log("ok");
                                    var lastId = data.id;
                                    formData.append("data_check", compare_url);
                                    if (fileLen > 0) {
                                        formData.append("fileLen", fileLen);
                                        formData.append("lastId", lastId);
                                        for (var i = 0; i < fileLen; i++) {
                                            nameTmp = "osr_" + i;
                                            formData.append(nameTmp, $("input#file-upload-osr")[0].files[i]);
                                        }

                                        var request = $.ajax({
                                            url: base_url + "Form/UploadDocumentsOSR",
                                            type: "post",
                                            data: formData,
                                            contentType: false,
                                            cache: false,
                                            processData: false
                                        });

                                        request.done(function (uploadImage) {

                                            $.notify({
                                                title: '<strong>Success!</strong>',
                                                message: "Data has been inputted with upload. Returning to Dashboard"
                                            }, {
                                                type: 'success',
                                                z_index: 9999
                                            });
                                            setTimeout(function () {
                                                $.notifyClose('top-right');
                                                window.location.href = base_url + "Dashboard/OSRBURNIN";
                                            }, 3000);


                                        });
                                    }
                                    else {
                                        $.notify({
                                            title: '<strong>Success!</strong>',
                                            message: "Data has been inputted. Returning to Dashboard"
                                        }, {
                                            type: 'success',
                                            z_index: 9999
                                        });
                                        setTimeout(function () {
                                            $.notifyClose('top-right');
                                            window.location.href = base_url + "Dashboard/OSRBURNIN";
                                        }, 3000);
                                    }
                                }
                            )
                        }
                    }
                }
                
                else {
                    $.notify({
                        title: '<strong>M3 Exists with the current information!</strong>',
                        message: ""
                    }, {
                        type: 'danger',
                        z_index: 9999
                    });
                    setTimeout(function () {
                        $.notifyClose('top-right');
                    }, 3000);
                }
            }
        );
    });
}

if (compare_url == "CREATEOSRQFN") {
    var dateTime = new Date($.now());
    function convertMS(milliseconds) {
        var day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return {
            day: day,
            hour: hour,
            minute: minute,
            seconds: seconds
        };
    }

    $("#m3-number").val("M3" + dateTime.getTime());

    $('.customdate').daterangepicker({
        "singleDatePicker": true,
        "autoApply": true,
        "hour": "06",
        "drops": "up",
        locale: {
            format: "YYYY-MM-DD 06:00:00"
        }

    },
    function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });

    $.post(
        base_url + "Dashboard/get_tester_id",
        function (data) {
            var append = "";
            $.each(data, function (i, tester_id) {
                var tstID = tester_id.Tester_ID;
                append += "<option>" + tstID.toUpperCase() + "</option>";
            })
            $("#tester-id-datalist").append(append);
        }
    )
    //HANDLER TST

    $.post(
        base_url + "Dashboard/get_handler_id",
        function (data) {
            var append = "";
            $.each(data, function (i, handler_id) {
                var hdID = handler_id.HAND;
                append += "<option>" + hdID.toUpperCase() + "</option>";
            })
            $("#handler-id-datalist").append(append);
            $.post(
                base_url + "Dashboard/get_handler_id_xfn",
                function (data) {
                    var append = "";
                    $.each(data, function (i, handler_id) {
                        var hdID = handler_id.Equipt_ID;
                        append += "<option>" + hdID.toUpperCase() + "</option>";
                    })
                    $("#handler-id-datalist").append(append);
                }
        )
        }
    )

    $.post(
        base_url + "Dashboard/get_process",
        function (data) {
            var append = "";
            $.each(data, function (i, process_id) {
                append += "<option>" + process_id.process + "</option>";
            })
            $("#process").append(append);
        }
    )

    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        var fileLen = this.files.length
        $(this).siblings(".custom-file-label").addClass("selected").html(fileLen + " FILE/S SELECTED");
    });

    $(document).on("keyup change select", "#tester-id", function () {
        var testerID = $("#tester-id").val();
        $.post(
            base_url + "Dashboard/get_handler_id_from_tester_id",
            {
                "testerID": testerID
            },
            function (data) {
                $("#handler-id").val(data.Handler_ID);
            }
            )
    });

    $(document).on("keyup change select", "#family", function () {
        var familyID = $("#family").val();
        $.post(
            base_url + "Form/get_package_from_family",
            {
                "familyID": familyID
            },
            function (data) {
                $("#package").val(data.Pkg_Type);
            }
            )
    });


    $("#create-form-osr").on('click', function (e) {
        e.preventDefault();

        $.post(
            base_url + "Form/get_existing_m3Number",
            {
                "testerID": $("#tester-id").val(),
                "handlerID": $("#handler-id").val(),
                "package": $("#package").val(),
                "family": $("#family").val()
            },
            function (existing_m3Number) {

                if (existing_m3Number.testerID == null || existing_m3Number.handlerID == null || (existing_m3Number.status == "FORM CANCELLED" || existing_m3Number.status == "RELEASED")) {
                    if ($("#tester-id").val() == "" || $("#handler-id").val() == "" || $("#family").val() == "" || $("#package").val() == "" || $("#process").val() == "") {

                        $.notify({
                            title: '<strong>PLEASE FILL UP ALL INFORMATION!</strong>',
                            message: ""
                        }, {
                            type: 'danger'
                        });
                        setTimeout(function () {
                            $.notifyClose('top-right');
                        }, 1000);

                        if ($("#tester-id").val() == "") {
                            $("#tester-id").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#tester-id").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#handler-id").val() == "") {
                            $("#handler-id").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#handler-id").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#family").val() == "") {
                            $("#family").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#family").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#package").val() == "") {
                            $("#package").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#package").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#process").val() == "") {
                            $("#process").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#process").addClass("is-valid").removeClass("is-invalid");
                        }

                    }
                    else {
                        //if ($("input#file-upload-osr")[0].files.length == 0) {
                        //    $.notify({
                        //        title: '<strong>PLEASE ATTACH A DOCUMENT!</strong>',
                        //        message: ""
                        //    }, {
                        //        type: 'danger'
                        //    });
                        //    setTimeout(function () {
                        //        $.notifyClose('top-right');
                        //    }, 1000);
                        //}
                        //else {
                            var testerID = $("#tester-id").val();
                            var handlerID = $("#handler-id").val();
                            var family = $("#family").val();
                            var package = $("#package").val();
                            var process = $("#process").val();
                            var fileLen = $("input#file-upload-osr")[0].files.length;
                            var expectedDateofSetup = $("#expected-date-of-setup").val();
                            var shift = $("#shift").val();
                            var status = $("#status").val();
                            var formData = new FormData();
                            var m3Number = $("#m3-number").val();

                            OSR_DATA =
                            {
                                "testerID": testerID.toUpperCase(),
                                "handlerID": handlerID.toUpperCase(),
                                "family": family.toUpperCase(),
                                "package": package.toUpperCase(),
                                "process": process.toUpperCase(),
                                "fileLen": fileLen,
                                "expectedDateofSetup": expectedDateofSetup,
                                "shift": shift.toUpperCase(),
                                "status": status,
                                "m3Number": m3Number,
                                "data_check": compare_url
                            }
                            
                            $.post(
                                base_url + "Form/OSRFormSubmit",
                                OSR_DATA,
                                function (data) {
                                    console.log("ok");
                                    var lastId = data.id;
                                    formData.append("data_check", compare_url);
                                    if (fileLen > 0) {
                                        formData.append("fileLen", fileLen);
                                        formData.append("lastId", lastId);
                                        for (var i = 0; i < fileLen; i++) {
                                            nameTmp = "osr_" + i;
                                            formData.append(nameTmp, $("input#file-upload-osr")[0].files[i]);
                                        }

                                        var request = $.ajax({
                                            url: base_url + "Form/UploadDocumentsOSR",
                                            type: "post",
                                            data: formData,
                                            contentType: false,
                                            cache: false,
                                            processData: false
                                        });

                                        request.done(function (uploadImage) {

                                            $.notify({
                                                title: '<strong>Success!</strong>',
                                                message: "Data has been inputted with upload. Returning to Dashboard"
                                            }, {
                                                type: 'success',
                                                z_index: 9999
                                            });
                                            setTimeout(function () {
                                                $.notifyClose('top-right');
                                                window.location.href = base_url + "Dashboard/OSRQFN";
                                            }, 3000);


                                        });
                                    }
                                    else {
                                        $.notify({
                                            title: '<strong>Success!</strong>',
                                            message: "Data has been inputted. Returning to Dashboard"
                                        }, {
                                            type: 'success',
                                            z_index: 9999
                                        });
                                        setTimeout(function () {
                                            $.notifyClose('top-right');
                                            window.location.href = base_url + "Dashboard/OSRQFN";
                                        }, 3000);
                                    }
                                }
                            )
                        //}
                    }
                }
                else {
                    $.notify({
                        title: '<strong>M3 Exists with the current information!</strong>',
                        message: ""
                    }, {
                        type: 'danger',
                        z_index: 9999
                    });
                    setTimeout(function () {
                        $.notifyClose('top-right');
                    }, 3000);
                }
            }
        );
    });

}
if (compare_url == "CREATEOSRCENTS") {
   
    var dateTime = new Date($.now());
    function convertMS(milliseconds) {
        var day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return {
            day: day,
            hour: hour,
            minute: minute,
            seconds: seconds
        };
    }

    $("#m3-number").val("SOC" + dateTime.getTime());

    $('.customdate').daterangepicker({
        "singleDatePicker": true,
        "autoApply": true,
        "hour": "06",
        "drops": "up",
        locale: {
            format: "YYYY-MM-DD 06:00:00"
        }

    },
    function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });

    $.post(
        base_url + "Dashboard/get_handler_model",
        function (data) {
            var append = "";
            $.each(data, function (i, Equipt_Model) {
                var Equipt_Model = Equipt_Model.Equipt_Model;
                append += "<option>" + Equipt_Model.toUpperCase() + "</option>";
            })
            $("#handler-model-datalist").append(append);
        }
    )
    //HANDLER TST

    $.post(
        base_url + "Dashboard/get_handler_id",
        function (data) {
            var append = "";
            $.each(data, function (i, handler_id) {
                var hdID = handler_id.HAND;
                append += "<option>" + hdID.toUpperCase() + "</option>";
            })
            $("#handler-id-datalist").append(append);
            $.post(
                base_url + "Dashboard/get_handler_id_xfn",
                function (data) {
                    var append = "";
                    $.each(data, function (i, handler_id) {
                        var hdID = handler_id.Equipt_ID;
                        append += "<option>" + hdID.toUpperCase() + "</option>";
                    })
                    $("#handler-id-datalist").append(append);
                }
        )
        }
    )

    //$.post(
    //    base_url + "Dashboard/get_process",
    //    function (data) {
    //        var append = "";
    //        $.each(data, function (i, process_id) {
    //            append += "<option>" + process_id.process + "</option>";
    //        })
    //        $("#process").append(append);
    //    }
    //)

    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        var fileLen = this.files.length
        $(this).siblings(".custom-file-label").addClass("selected").html(fileLen + " FILE/S SELECTED");
    });

    $(document).on("keyup change select", "#handler-id", function () {
        var handlerID = $("#handler-id").val();
        $.post(
            base_url + "Dashboard/get_handler_model_from_id",
            {
                "handlerID": handlerID
            },
            function (data) {
                $("#handler-model").val(data.Equipt_PF);
                $.post(
                   base_url + "Dashboard/get_package_from_id",
                   {
                       "handlerID": handlerID
                   },
                   function (pkg) {
                       console.log(pkg);
                       $("#package").val(pkg.pkg_type);
                   }
                   );
            }
            );
    });

    $.post(
        base_url + "Form/get_user",
        function (usr) {
            var users = '';
            $.each(usr, function (i, username) {
                users += "<option class='user' data-user-id='" + username.id + "' value='" + username.email_address + "'>" + username.email_address + "</option>";
            });

            $("#user").append(users);

        }
    );


    $("#create-form-osr").on('click', function (e) {
        e.preventDefault();
        var handlerID = $("#handler-id").val();
        var package = $("#package").val();
        createOSR();
        //$.post(
        //   base_url + "Dashboard/check_valid_package",
        //   {
        //       "handlerID": handlerID
        //   },
        //   function (pkg) {
        //       console.log(pkg);
        //       alert(pkg.pkg_type);
        //       if (pkg.pkg_type == package) {
        //           createOSR();
        //       }
        //       else {
        //           $.notify({
        //               title: '<strong>Success!</strong>',
        //               message: "PACKAGE DOES NOT EXIST"
        //           }, {
        //               type: 'danger',
        //               z_index: 9999
        //           });
        //           setTimeout(function () {
        //               $.notifyClose('top-right');
        //           }, 3000);
        //       }
        //   }
        //);
        
    });

    function createOSR() {
        $.post(
            base_url + "Form/get_existing_m3Number",
            {
                "testerID": $("#tester-id").val(),
                "handlerID": $("#handler-id").val(),
                "package": $("#package").val(),
                "family": $("#family").val()
            },
            function (existing_m3Number) {

                    if ($("#handler-id").val() == "" || $("#family").val() == "" || $("#package").val() == "" || $("#process").val() == "") {

                        $.notify({
                            title: '<strong>PLEASE FILL UP ALL INFORMATION!</strong>',
                            message: ""
                        }, {
                            type: 'danger'
                        });
                        setTimeout(function () {
                            $.notifyClose('top-right');
                        }, 1000);

                        if ($("#handler-id").val() == "") {
                            $("#handler-id").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#handler-id").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#package").val() == "") {
                            $("#package").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#package").addClass("is-valid").removeClass("is-invalid");
                        }

                        if ($("#process").val() == "") {
                            $("#process").addClass("is-invalid").removeClass("is-valid");
                        }
                        else {
                            $("#process").addClass("is-valid").removeClass("is-invalid");
                        }

                    }
                    else {

                        var handlerID = $("#handler-id").val();
                        var handlerModel = $("#handler-model").val();
                        var package = $("#package").val();
                        var expectedDateofSetup = $("#expected-date-of-setup").val();
                        var shift = $("#shift").val();
                        var status = $("#status").val();
                        var m3Number = $("#m3-number").val();
                        var request_qty = $("#request-qty").val();

                        OSR_DATA =
                        {
                            "handlerID": handlerID.toUpperCase(),
                            "handlerModel": handlerModel.toUpperCase(),
                            "package": package.toUpperCase(),
                            "expectedDateofSetup": expectedDateofSetup,
                            "shift": shift.toUpperCase(),
                            "status": status,
                            "m3Number": m3Number,
                            "data_check": compare_url,
                            "request_qty": request_qty

                        }

                        $.post(
                            base_url + "Form/OSRFormSubmit",
                            OSR_DATA,
                            function (data) {
                                console.log("ok");
                                var lastId = data.id;
                                $.notify({
                                    title: '<strong>Success!</strong>',
                                    message: "Data has been inputted, Returning to Dashboard"
                                }, {
                                    type: 'success',
                                    z_index: 9999
                                });
                                setTimeout(function () {
                                    $.notifyClose('top-right');
                                    window.location.href = base_url + "Dashboard/OSR_CENTS";
                                }, 3000);
                            }
                        )
                    }
            }
        );
    }

}