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
                    append += "<tr class='h-100 justify-content-center align-items-center'>"
                    append += "<td class='text-center'> <img src='../Assets/img/" + data[i]["img"] + "'  alt='Cinque Terre' style='height:90px;'></td>";
                    append += "<td  class=''>" + data[i]["pokemon_name"] + "</td>";
                    append += "<td>" + data[i]["current_lvl"] + "</td>";
                    append += "<td>" + data[i]["current_exp"] + "</td>";
                    append += "<td>";
                    data[i]["is_fire"] == 1 ? append += "FIRE<br>" : "";
                    data[i]["is_water"] == 1 ? append += "WATER<br>" : "";
                    data[i]["is_grass"] == 1 ? append += "GRASS<br>" : "";
                    data[i]["is_electric"] == 1 ? append += "ELECTRIC<br>" : "";
                    data[i]["is_flying"] == 1 ? append += "FLYING<br>" : "";
                    append += "</td>";
                    append += "<td><button class='btn btn-lg btn-primary' id='level-up' data-pokemin-id='" + data[i]["id"] + "'>ADD EXP!</button></td>"
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
            "id": $("#level_up").attr("data-pokemin-id");
        }
        )
    alert("test");
});