switch (compare_url) {
    case "HOME":
        $.post(
        base_url + "Dashboard/get_trainer_stats",
        //{
        //    "data_check": compare_url
        //},
        function (data) {
            console.log(data);

            $("#trainer_id").html(data.trainer_id);
            $("#trainer_name").html(data.trainer_name);
            $("#gender").html(data.gender);
            $("#trainer_lvl").html(data.trainer_lvl);
            $("#current_badge_count").html(data.current_badge_count);
            $("#current_season").html(data.current_season);
            $("#can_catch").html(data.can_catch);
            $("img#trainer-pic").attr("src", "/Assets/img/" + data.img);
            $(".loader").hide();
        });
    break;
    case "POKEMON":
        $.post(
            base_url + "Dashboard/get_trainer_pokemon",
            //{
            //    "data_check": compare_url
            //},
            function (data) {
                var append = "";
                console.log(data.length);
                var data_length = data.length;
                for (var i = 0; i < data_length; i++) {
                    append += "<tr class='h-100 justify-content-center align-items-center for-remove'>";
                    append += "<td class='text-center'> <img id='img_" + data[i]["id"] + "' src='../Assets/img/" + data[i]["img"] + "'  alt='Cinque Terre' style='height:90px;'></td>";
                    append += "<td id='name_" + data[i]["id"] + "' class=''>" + data[i]["pokemon_name"] + "</td>";
                    append += "<td id='current_lvl_" + data[i]["id"] + "'>" + data[i]["current_lvl"] + "</td>";
                    append += "<td id='current_exp_" + data[i]["id"] + "'>" + data[i]["current_exp"] + "</td>";
                    append += "<td id='type_" + data[i]["id"] + "'>";
                    data[i]["is_fire"] == 1 ? append += "FIRE<br>" : "";
                    data[i]["is_water"] == 1 ? append += "WATER<br>" : "";
                    data[i]["is_grass"] == 1 ? append += "GRASS<br>" : "";
                    data[i]["is_electric"] == 1 ? append += "ELECTRIC<br>" : "";
                    data[i]["is_flying"] == 1 ? append += "FLYING<br>" : "";
                    append += "</td>";
                    append += "<td><button class='btn btn-lg btn-primary' id='level-up' data-pokemon-id='" + data[i]["id"] + "'>ADD EXP!</button></td>"
                    append += "</tr>";
                }

                $("#append-pokemon").append(append);
                
                //$.each(data, function (i, pokemon_data) {
                //    append += 
                //});

                $(".loader").hide();
        });
    break;
    default:
        $.post(
            base_url + "Dashboard/get_trainer_stats",
            //{
            //    "data_check": compare_url
            //},
            function (data) {
                console.log(data);

                $("#trainer_id").html(data.trainer_id);
                $("#trainer_name").html(data.trainer_name);
                $("#gender").html(data.gender);
                $("#trainer_lvl").html(data.trainer_lvl);
                $("#current_badge_count").html(data.current_badge_count);
                $("#current_season").html(data.current_season);
                $("#can_catch").html(data.can_catch);
                $("img#trainer-pic").attr("src", "/Assets/img/" + data.img);

                $(".loader").hide();
        });
    break;
}

$(document).on("click", "#redirect-dashboard", function (e) {
    e.preventDefault();
    window.location.href = base_url + "Dashboard/OSR";
});


$(document).on("click", "#level-up", function () {
    var addXP = 100;
    $.post(
        base_url + "Dashboard/level_up_pokemon",
        {
            "id": $(this).data("pokemon-id"),
            "exp": addXP
        },
        function (data) {
            console.log(data);
            if (data.done == "MAX") {
                alert("POKEMON MAX");
            }
            $.post(
                base_url + "Dashboard/get_trainer_pokemon_by_id",
                {
                    "id": data.id
                },
                function (refresh) {
                    console.log(refresh);
                    //../Assets/img/
                    var append = "";
                    $("#img_" + refresh.id).attr("src", "/Assets/img/" + refresh.img);
                    $("#name_" + refresh.id).html(refresh.pokemon_name);
                    $("#current_lvl_" + refresh.id).html(refresh.current_lvl);
                    $("#current_exp_" + refresh.id).html(refresh.current_exp);
                    refresh.is_fire == 1 ? append += "FIRE<br>" : "";
                    refresh.is_water == 1 ? append += "WATER<br>" : "";
                    refresh.is_grass == 1 ? append += "GRASS<br>" : "";
                    refresh.is_electric == 1 ? append += "ELECTRIC<br>" : "";
                    refresh.is_flying == 1 ? append += "FLYING<br>" : "";
                    $("#type_" + refresh.id).html(append);
                })


        }

        )
});