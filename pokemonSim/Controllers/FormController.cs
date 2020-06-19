using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using pokemonSim.Models;

namespace pokemonSim.Controllers
{
    public class FormController : BaseController
    {
        public class OSR
        {
            public int id { get; set; }
            public string m3Number { get; set; }
            public string socketID { get; set; }
            public string testerID { get; set; }
            public string handlerID { get; set; }
            public string handlerModel { get; set; }
            public string family { get; set; }
            public string package { get; set; }
            public string process { get; set; }
            public string requestedBy { get; set; }
            public string dateSubmitted { get; set; }
            public string expectedDateofSetup { get; set; }
            public string recentlyUpdateBy { get; set; }
            public string shift { get; set; }
            public string status { get; set; }
            public string remarks { get; set; }
            public string releasedTo { get; set; }
            public string reasonToChangeSetup { get; set; }
            public string data_check { get; set; }
            public string request_qty { get; set; }
            public string lot_status { get; set; }
            public string schedule { get; set; }
            public string lot_approver_validity { get; set; }
            public string unscheduled_approval { get; set; }
            public string reasonForUnplannedSetup { get; set; }
            public string returnedBy { get; set; }
        }
        //
        // GET: /Form/
        pokemonMod pokemonObject = new pokemonMod();

        public ActionResult CreateOSR()
        {
            ViewBag.employeeData = this.Get_user_session_data();
            ViewBag.fullName = this.Get_user_fullname();
            var employeeData = this.Get_user_session_data();

            if (employeeData == null)
            {
                return RedirectToAction("OSR", "Dashboard");
            }
            else
            {
                return View();
            }
        }

        public ActionResult CreateOSRBurnIn()
        {
            ViewBag.employeeData = this.Get_user_session_data();
            ViewBag.fullName = this.Get_user_fullname();
            var employeeData = this.Get_user_session_data();

            if (employeeData == null)
            {
                return RedirectToAction("OSRBURNIN", "Dashboard");
            }
            else
            {
                return View();
            }
        }

        public ActionResult CreateOSRQFN()
        {
            ViewBag.employeeData = this.Get_user_session_data();
            ViewBag.fullName = this.Get_user_fullname();
            var employeeData = this.Get_user_session_data();

            if (employeeData == null)
            {
                return RedirectToAction("OSR", "Dashboard");
            }
            else
            {
                return View();
            }
        }

        public ActionResult CreateOSRCents()
        {
            ViewBag.employeeData = this.Get_user_session_data();
            ViewBag.fullName = this.Get_user_fullname();
            var employeeData = this.Get_user_session_data();

            if (employeeData == null)
            {
                return RedirectToAction("OSR_CENTS", "Dashboard");
            }
            else
            {
                return View();
            }

        }
    }
}
