if (compare_url == "OSR") {
    $(document).on("click", "#osr_data td:not(:first-child):not(:last-child)", function () {
        $(".lot-email-approval").hide();
        $("input#file-upload-osr").val("");
        //// FIX CODE TO RESET FILE NUMBERING
        $(".custom-file-label").html("Choose File");
        $(".custom-file-input").on("change", function () {
            var fileName = $(this).val().split("\\").pop();
            var fileLen = this.files.length
            $(this).siblings(".custom-file-label").addClass("selected").html(fileLen + " FILE/S SELECTED");
        });
        $(".update-expected-date-of-setup").hide();

        $("#id-placeholder").val($(this).attr("data-osr-id"));
        var id = $("#id-placeholder").val();
        $("#myModal").modal("show");
        $('#remarks').val('');
        $(".clear").remove();

        $.post(
            base_url + "Form/getOSRData",
            {
                "id": id
            },
            function (data) {
                $.post(
                    base_url + "Users/is_valid",
                    {
                        "FFID": FFID
                    },
                    function (is_valid) {
                       
                        //if (((is_valid.FFID != null) || (data.sub_ffID == FFID && data.status == "FOR PREPARATION")) && (data.status != "RELEASED")) {
                        //    $(".update-checker").show();
                        //    $(".release-checking").hide();
                        //}
                        if (((is_valid.FFID != null) || (data.sub_ffID == FFID && data.status == "FOR PREPARATION")) && (data.status != "RETURNED")) {
                            $(".update-checker").show();
                            $(".release-checking").hide();
                            $(".returned-checking").hide();
                        }
                        else {
                            $(".update-checker").hide();
                            $(".release-checking").hide();
                            $(".returned-checking").hide();
                        }

                        var status_append = "";
                        $(".clear-data").remove();
                        $("#m3-number").val(data.m3Number);
                        $("#tester-id").val(data.testerID);
                        $("#handler-id").val(data.handlerID);
                        $("#family").val(data.family);
                        $("#package").val(data.package);
                        $("#process").val(data.process);
                        $("#requested-by").val(data.requestBy);
                        var formatDate = Date.parse(data.dateRequest);
                        var newDate = formatDate.toString('yyyy-MM-dd HH:mm:ss');
                        $("#date-submitted").val(newDate);
                        var edsDate = Date.parse(data.expectedDateOfSetup);
                        var newEDS = edsDate.toString('yyyy-MM-dd HH:mm:ss');
                        $("#expected-date-of-setup").val(newEDS);
                        $("#recently-updated-by").val(data.updater);
                        $("#shift").val(data.shift);
                        $("#lot_status").val(data.lot_status);
                        $("#lot_status").attr("data-lot-status-check", data.lot_status);
                        $("#status").attr("data-current-status", data.status);

                        switch (data.status) {
                            case "FOR PREPARATION":
                                status_append += "<option class='clear-data' value='" + data.status + "'>" + data.status + "</option>";
                                if ((data.sub_ffID == FFID && is_valid.FFID != null) || (is_valid.FFID != null)) {
                                    status_append += "<option class='clear-data' value='ON GOING PREPARATION'>ON GOING PREPARATION</option>";
                                }
                                status_append += "<option class='clear-data' value='FORM CANCELLED'>FORM CANCELLED</option>";
                                $("#status").append(status_append);
                                break;
                            case "ON GOING PREPARATION":
                                status_append += "<option class='clear-data' value='" + data.status + "'>" + data.status + "</option>";
                                status_append += "<option class='clear-data' value='READY FOR BUY OFF'>READY FOR BUY OFF</option>";
                                status_append += "<option class='clear-data' value='FORM CANCELLED'>FORM CANCELLED</option>";
                                $("#status").append(status_append);
                                break;
                            case "READY FOR BUY OFF":
                                status_append += "<option class='clear-data' value='" + data.status + "'>" + data.status + "</option>";
                                if (data.lot_status == "N/A" || data.lot_status == "") {
                                    status_append += "<option class='clear-data' value='READY FOR BUY OFF'>LOT NOT READY</option>";
                                }
                                else {
                                    status_append += "<option class='clear-data' value='RELEASED'>RELEASED</option>";
                                }
                                //status_append += "<option class='clear-data' value='RELEASED'>RELEASED</option>";
                                status_append += "<option class='clear-data' value='FORM CANCELLED'>FORM CANCELLED</option>";
                                $("#status").append(status_append);
                                break;
                            case "FOR APPROVAL":
                                status_append += "<option class='clear-data' value='" + data.status + "'>" + data.status + "</option>";
                                if (data.unplannedApprover == "N/A") {
                                    status_append += "<option class='clear-data' value='FOR APPROVAL'>SETUP NOT YET APPROVED</option>";
                                }
                                else {
                                    status_append += "<option class='clear-data' value='FOR PREPARATION'>FOR PREPARATION</option>";
                                }
                                status_append += "<option class='clear-data' value='FORM CANCELLED'>FORM CANCELLED</option>";
                                $("#status").append(status_append);
                                break;
                            case "RELEASED":
                                status_append += "<option class='clear-data' value='" + data.status + "'>" + data.status + "</option>";
                                status_append += "<option class='clear-data' value='RETURNED'>RETURNED</option>";
                                $("#status").append(status_append);
                                break;
                            case "RETURNED":
                                break;
                            case "FORM CANCELLED":
                                break;
                        }

                        if (data.lot_status == "APPROVED" || data.lot_status == "DECLINED") {
                            $("#lot_status").prop("disabled", true);
                        }
                        else {
                            $("#lot_status").prop("disabled", false);
                        }

                        if (data.unplannedStatus == "APPROVED" || data.unplannedStatus == "DECLINED") {
                            $("#unscheduled-approval").prop("disabled", true);
                        }
                        else {
                            $("#unscheduled-approval").prop("disabled", false);
                        }
                    }
                )
            }
            );
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

        $("#expected-date-of-setup").on("change", function () {
            $(".update-expected-date-of-setup").show().addClass("update-enabled");
        });



    });

    $(document).on("click", "#update-osr", function () {
        //RELEASED TO DYNAMIC SHOW/HIDE
        
        if ($("#status").val() == "RELEASED" && $("#released-to").val() == "") {
            $("#released-to").addClass("is-invalid").removeClass("is-valid");
        }
        else {
            $("#released-to").addClass("is-valid").removeClass("is-invalid");
        }

        if ($("#status").val() == "RELEASED" && $("#released-to").val() == "") {
            $.notify({
                title: '<strong>PLEASE FILL UP ALL INFORMATION!</strong>',
                message: ""
            }, {
                type: 'danger',
                z_index: 9999
            });
            setTimeout(function () {
                $.notifyClose('top-right');
            }, 1000);

        }
        else {
            if ($("#remarks").val() == "" || $("#remarks").val() == null) {
                $.notify({
                    title: '<strong>Warning!</strong>',
                    message: "Please Input Remarks"
                }, {
                    type: 'danger',
                    z_index: 9999
                });
                setTimeout(function () {
                    $.notifyClose('top-right');

                }, 3000);
            }
            else {

                if (($("#lot_status").attr("data-lot-status-check") == "" || $("#lot_status").attr("data-lot-status-check") == "N/A") && $("#lot_status").val() == "APPROVED") {

                    if ($("input#file-upload-osr")[0].files.length == 0) {

                        $.notify({
                            title: '<strong>PLEASE ATTACH A DOCUMENT!</strong>',
                            message: ""
                        }, {
                            type: 'danger',
                            z_index: 9999999
                        });
                        setTimeout(function () {
                            $.notifyClose('top-right');
                        }, 1500);
                    }
                    else {
                        var formData = new FormData();
                        var fileLen = $("input#file-upload-osr")[0].files.length;
                        var lastId = $("#id-placeholder").val();
                        var get_status = $("#status").val();
                        if ($("#status").val() == "RELEASED") {
                            if ($("#lot_status").val() == "N/A" || $("#lot_status").val() == "") {
                                $.notify({
                                    title: '<strong>LOT NOT YET APPROVED!</strong>',
                                    message: ""
                                }, {
                                    type: 'danger',
                                    z_index: 9999
                                });
                                setTimeout(function () {
                                    $.notifyClose('top-right');
                                }, 1000);
                            }
                            else {
                                formData.append("data_check", compare_url);
                                if (fileLen > 0) {

                                    formData.append("fileLen", fileLen);
                                    formData.append("lastId", lastId);
                                    for (var i = 0; i < fileLen; i++) {
                                        nameTmp = "osr_" + i;
                                        formData.append(nameTmp, $("input#file-upload-osr")[0].files[i]);
                                    }

                                    var request = $.ajax({
                                        url: base_url + "Form/UploadEmailLotVerificationOSR",
                                        type: "post",
                                        data: formData,
                                        contentType: false,
                                        cache: false,
                                        processData: false
                                    });

                                    request.done(function (uploadImage) {
                                        //alert(uploadImage["done"]);
                                        console.log(uploadImage);
                                        if (uploadImage["done"] == "Upload Successful") {
                                            $.notify({
                                                title: '<strong>Success!</strong>',
                                                message: "Mail Verification has been uploaded. Please wait"
                                            }, {
                                                type: 'warning',
                                                z_index: 9999
                                            });
                                            setTimeout(function () {
                                                $.notifyClose('top-right');
                                                update_osr(get_status);
                                            }, 3000);
                                        }
                                        else if (uploadImage["done"] == "Upload Failed") {

                                            $.notify({
                                                title: '<strong>Success!</strong>',
                                                message: "Mail File Invalid"
                                            }, {
                                                type: 'danger',
                                                z_index: 9999
                                            });
                                            setTimeout(function () {
                                                $.notifyClose('top-right');

                                            }, 3000);
                                        }
                                    });
                                }

                            }
                        }
                        else {
                            formData.append("data_check", compare_url);
                            if (fileLen > 0) {
                                formData.append("fileLen", fileLen);
                                formData.append("lastId", lastId);
                                for (var i = 0; i < fileLen; i++) {

                                    nameTmp = "osr_" + i;
                                    formData.append(nameTmp, $("input#file-upload-osr")[0].files[i]);
                                }

                                var request = $.ajax({
                                    url: base_url + "Form/UploadEmailLotVerificationOSR",
                                    type: "post",
                                    data: formData,
                                    contentType: false,
                                    cache: false,
                                    processData: false
                                });

                                request.done(function (uploadImage) {
                                    console.log(uploadImage);
                                    if (uploadImage["done"] == "Upload Successful") {
                                        $.notify({
                                            title: '<strong>Success!</strong>',
                                            message: "Mail Verification has been uploaded. Please wait"
                                        }, {
                                            type: 'warning',
                                            z_index: 9999
                                        });
                                        setTimeout(function () {
                                            $.notifyClose('top-right');
                                            update_osr(get_status);
                                        }, 3000);
                                    }
                                    else if (uploadImage["done"] == "Upload Failed") {

                                        $.notify({
                                            title: '<strong>Error!</strong>',
                                            message: "Mail File Invalid"
                                        }, {
                                            type: 'danger',
                                            z_index: 9999
                                        });
                                        setTimeout(function () {
                                            $.notifyClose('top-right');

                                        }, 3000);
                                    }

                                });
                            }
                        }

                    }
                }
                else {
                    var get_status = $("#status").val();
                    if ($("#status").val() == "RELEASED") {
                        if ($("#lot_status").val() == "N/A" || $("#lot_status").val() == "") {
                            $.notify({
                                title: '<strong>LOT NOT YET APPROVED!</strong>',
                                message: ""
                            }, {
                                type: 'danger',
                                z_index: 9999
                            });
                            setTimeout(function () {
                                $.notifyClose('top-right');
                            }, 1000);
                        }
                        else {
                            update_osr(get_status);
                        }
                    }
                    else {
                        update_osr(get_status);
                    }
                }
            }
        }
    });

    function update_osr(get_status) {

        var id = $("#id-placeholder").val();
        var m3Number = $("#m3-number").val();
        var testerID = $("#tester-id").val();
        var handlerID = $("#handler-id").val();
        var family = $("#family").val();
        var package = $("#package").val();
        var process = $("#process").val();
        var requestedBy = $("#requested-by").val();
        var dateSubmitted = $("#date-submitted").val();
        var expectedDateofSetup = $("#expected-date-of-setup").val();
        var recentlyUpdateBy = $("#recently-updated-by").val();
        var shift = $("#shift").val();
        var status = get_status;
        var remarks = $("#remarks").val();
        var releasedTo = $("#released-to").val();
        var reasonToChangeSetup = $("#reason-to-change-setup").val();
        var lot_status = $("#lot_status").val();
        var lot_approver_validity = $("#lot-validity").val();
        var unscheduled_approval = $("#unscheduled-approval").val();
        var returnedBy = $("#returned-by").val();

        var UPDATE_OSR = {
            "id": id,
            "m3Number": m3Number,
            "testerID": testerID,
            "handlerID": handlerID,
            "family": family,
            "package": package,
            "process": process,
            "requestedBy": requestedBy,
            "dateSubmitted": dateSubmitted,
            "expectedDateofSetup": expectedDateofSetup,
            "recentlyUpdateBy": recentlyUpdateBy,
            "shift": shift,
            "status": status,
            "remarks": remarks,
            "releasedTo": releasedTo,
            "reasonToChangeSetup": reasonToChangeSetup,
            "lot_status": lot_status,
            "lot_approver_validity": lot_approver_validity,
            "unscheduled_approval": unscheduled_approval,
            "returnedBy": returnedBy
        }

        if ($(".update-expected-date-of-setup").hasClass("update-enabled")) { // if user change expected date of setup

            if ($("#reason-to-change-setup").val() == "") {
                $("#reason-to-change-setup").addClass("is-invalid").removeClass("is-valid");
                $.notify({
                    title: '<strong>PLEASE FILL UP ALL INFORMATION!</strong>',
                    message: ""
                }, {
                    type: 'danger',
                    z_index: 9999
                });
                setTimeout(function () {
                    $.notifyClose('top-right');
                }, 1000);
            }
            else {
                $.post(
                    base_url + "Users/is_valid_for_update",
                    {
                        "FFID": FFID,
                    },
                    function (is_valid) {
                        console.log(is_valid);

                        if ((is_valid.FFID != null) || (userDetailsSession == requestedBy)) {

                            if ($("#remarks").val() == "" || $("#remarks").val() == null) {
                                $.notify({
                                    title: '<strong>Warning!</strong>',
                                    message: "Please Input Remarks"
                                }, {
                                    type: 'danger',
                                    z_index: 9999
                                });
                                setTimeout(function () {
                                    $.notifyClose('top-right');

                                }, 3000);
                            }
                            else {
                                $.post(
                                base_url + "Form/OSRFormUpdateWithExpectedUpdate",
                                UPDATE_OSR,
                                function (data) {
                                    $.notify({
                                        title: '<strong>Success!</strong>',
                                        message: "Data has been updated. Returning to Dashboard"
                                    }, {
                                        type: 'success',
                                        z_index: 9999
                                    });
                                    setTimeout(function () {
                                        $.notifyClose('top-right');
                                        window.location.reload();
                                    }, 1000);
                                }
                             );
                            }
                            
                        }
                        else {
                            $.notify({
                                title: '<strong>Warning!</strong>',
                                message: "UNAUTHORIZED ACTION!"
                            }, {
                                type: 'danger',
                                z_index: 9999
                            });
                            setTimeout(function () {
                                $.notifyClose('top-right');
                            }, 1000);
                        }

                    }
                );

            }

        }
        else {
            if ($("#remarks").val() == "" || $("#remarks").val() == null) {
                $.notify({
                    title: '<strong>Warning!</strong>',
                    message: "Please Input Remarks"
                }, {
                    type: 'danger',
                    z_index: 9999
                });
                setTimeout(function () {
                    $.notifyClose('top-right');

                }, 3000);
            }
            else {
                $.post(
                    base_url + "Form/OSRFormUpdate",
                    UPDATE_OSR,
                    function (data) {
                        $.notify({
                            title: '<strong>Success!</strong>',
                            message: "Data has been updated. Returning to Dashboard"
                        }, {
                            type: 'success',
                            z_index: 9999
                        });
                        setTimeout(function () {
                            $.notifyClose('top-right');
                            window.location.reload();
                            //window.close();
                        }, 1000);
                    }
                 );
            }
        }
    }


    $(document).on("change", "#status", function () {
        var status = $("#status").val();
        if (status == "RELEASED" && status != $("#status").attr("data-current-status")) {
            $(".release-checking").show();
            $.post(
            base_url + "Form/get_user_list",
            function (data) {
                var append = "";
                $.each(data, function (i, user) {
                    append += "<option class= clear>" + user.firstName + " " + user.lastName + "</option>"
                });
                $("#released-list").append(append);
            });
        }
        else if (status == "RETURNED") {
            $(".returned-checking").show();
            $.post(
            base_url + "Form/get_user_list",
            function (data) {
                var append = "";
                $.each(data, function (i, user) {
                    append += "<option class= clear>" + user.firstName + " " + user.lastName + "</option>"
                });
                $("#returned-list").append(append);
            });
        }
        else {
            $(".release-checking").hide();
            $(".returned-checking").hide();
            $(".clear").remove();
        }
    });

    $(document).on("change", "#lot_status", function () {
        
        if (($("#lot_status").attr("data-lot-status-check") == "" || $("#lot_status").attr("data-lot-status-check") == "N/A") && $("#lot_status").val() == "APPROVED") {
            $(".lot-email-approval").show();
        }
        else {
            $(".lot-email-approval").hide();
        }
    });

}
