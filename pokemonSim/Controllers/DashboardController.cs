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

    }
}
