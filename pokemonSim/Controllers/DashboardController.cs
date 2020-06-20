using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using pokemonSim.Models;

namespace pokemonSim.Controllers
{
    public class DashboardController : BaseController
    {
        pokemonMod pokemonObject = new pokemonMod();
        //
        // GET: /Dashboard/

        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue
            };
        }

        public ActionResult Pokemon ()
        {
            ViewBag.employeeData = this.Get_user_session_data();
            ViewBag.userFFID = this.Get_user_ffID();
            ViewBag.fullName = this.Get_user_fullname();
            ViewBag.CanUpdate = this.Get_user_valid_update();
            ViewBag.LotIdValid = this.Get_Valid_Lot_User();
            ViewBag.ModalTrigger = "";

            return View();
        }

        public ActionResult Home()
        {
            ViewBag.employeeData = this.Get_user_session_data();
            ViewBag.userFFID = this.Get_user_ffID();
            ViewBag.fullName = this.Get_user_fullname();
            ViewBag.CanUpdate = this.Get_user_valid_update();
            ViewBag.LotIdValid = this.Get_Valid_Lot_User();
            ViewBag.ModalTrigger = "";

            return View();
        }

        public ActionResult Catch()
        {
            ViewBag.employeeData = this.Get_user_session_data();
            ViewBag.userFFID = this.Get_user_ffID();
            ViewBag.fullName = this.Get_user_fullname();
            ViewBag.CanUpdate = this.Get_user_valid_update();
            ViewBag.LotIdValid = this.Get_Valid_Lot_User();
            ViewBag.ModalTrigger = "";

            return View();
        }

        public JsonResult get_trainer_stats(string data_check)
        {
            IDictionary<string, string> results = new Dictionary<string, string>();

            results = pokemonObject.get_trainer_stats();

            return Json(results);
        }

        public JsonResult get_trainer_pokemon(string data_check)
        {
            List<IDictionary<string, string>> results = new List<IDictionary<string, string>>();

            results = pokemonObject.get_trainer_pokemon();

            return Json(results);
        }

        public JsonResult get_trainer_pokemon_by_id(int id)
        {
            IDictionary<string, string> results = new Dictionary<string, string>();

            results = pokemonObject.get_trainer_pokemon_by_id(id);

            return Json(results);
        }

        public JsonResult get_pokemon_masterlist()
        {
            List<IDictionary<string, string>> results = new List<IDictionary<string, string>>();

            results = pokemonObject.get_pokemon_masterlist();

            return Json(results);
        }

        public JsonResult get_pokemon_masterlist_by_name(string pokemon_name)
        {
            IDictionary<string, string> results = new Dictionary<string, string>();

            results = pokemonObject.get_pokemon_masterlist_by_name(pokemon_name);

            return Json(results);
        }


        public JsonResult catch_pokemon(string pokemon_name, int lvl)
        {
            IDictionary<string, string> results = new Dictionary<string, string>();
            IDictionary<string, string> trainer_info = new Dictionary<string, string>();
            IDictionary<string, string> get_game_state = new Dictionary<string, string>();
            IDictionary<string, string> get_pokemon_by_id = new Dictionary<string, string>();

            trainer_info = pokemonObject.get_trainer_stats();
            if (trainer_info["can_catch"] == "1")
            {
                get_game_state = pokemonObject.get_game_state_level(lvl);
                get_pokemon_by_id = pokemonObject.get_pokemon_masterlist_by_name(pokemon_name);
                pokemonObject.catch_pokemon(get_pokemon_by_id["pokemon_id"], get_pokemon_by_id["pokemon_name"], get_pokemon_by_id["lvl_unlock"], get_game_state["exp_cap"]);

                return Json(results);
            }
            else {
                results["done"] = "NOT AUTHORIZED";
                return Json(results);
            }

        }

        public JsonResult level_up_pokemon(int id, int exp) {

            IDictionary<string, string> results = new Dictionary<string, string>();
            IDictionary<string, string> old_res = new Dictionary<string, string>();
            IDictionary<string, string> check_level_con = new Dictionary<string, string>();
            IDictionary<string, string> get_game_state = new Dictionary<string, string>();

            results = pokemonObject.get_trainer_pokemon_by_id(id);

            int current_exp = Int32.Parse(results["current_exp"]) + exp ; // get total exp from current and new
            int current_exp_cap = Int32.Parse(results["exp_cap"]);
            int new_level = Int32.Parse(results["current_lvl"]) + 1;

            check_level_con = pokemonObject.get_pokemon_condition(results["pokemon_id"], new_level);
            get_game_state = pokemonObject.get_game_state_level(new_level);

            if (current_exp >= current_exp_cap )
            {

                //return Json(current_exp); //testing
                if (new_level < 21) //max level cap to 20
                {
                    if (results["pokemon_name"] == check_level_con["pokemon_name"]) // only add level ignore other
                    {
                        get_game_state = pokemonObject.get_game_state_level(new_level);

                        pokemonObject.increase_level_only(get_game_state["exp_cap"], new_level, id);

                        return Json(results);
                    }
                    else
                    { // change pokemon from same pokemon id


                        pokemonObject.evolve_pokemon(check_level_con["pokemon_name"], new_level, get_game_state["exp_cap"], id);

                        return Json(results);
                    }
                }
                else
                {
                    results["done"] = "MAX";
                    return Json(results);
                }
            }
            else{ //only add exp
                //current_exp
                pokemonObject.increase_exp_only(current_exp, id);

                return Json(results);

            }

        
        }

    }
}
