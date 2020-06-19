using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.DirectoryServices;
using pokemonSim.Models;

namespace pokemonSim.Controllers
{
    public class UsersController : BaseController
    {
        pokemonMod pokemonObject = new pokemonMod();

        //[HttpGet, OutputCache(NoStore = true, Duration = 1)]

        //public ActionResult Login()
        //{
        //    if (this.IsUserLoggedIn() == true)
        //    {
        //        return RedirectToAction("Index", "Home");
        //    }
        //    else
        //    {
        //        ViewBag.page_id = "login_page";
        //        return View();
        //    }
        //}

        //[HttpGet, OutputCache(NoStore = true, Duration = 1)]

        public ActionResult Logout()
        {
            Session[this.GV_sessionName_employee_data] = null;

            return null;
        }

        [HttpPost]
        [ValidateInput(true)]
        public JsonResult Login_employee(string ffID, string password)
        {
            IDictionary<string, string> results = new Dictionary<string, string>();
            IDictionary<string, string> employee_data = new Dictionary<string, string>();
            IDictionary<string, string> isValid = new Dictionary<string, string>();
            IDictionary<string, string> lotValid = new Dictionary<string, string>();
            IDictionary<string, string> schedApprover = new Dictionary<string, string>();

            results["done"] = "FALSE";
            results["msg"] = "<strong class='error'>Can't connect to Active Directory server (LDAP)</strong>";
            try 
            { 
                string ldapAddress = "LDAP://ad.onsemi.com";
                DirectoryEntry directoryEntry = new DirectoryEntry(ldapAddress, ffID, password);

                DirectorySearcher ds = new DirectorySearcher(directoryEntry);

                ds.Filter = "(sAMAccountName=" + ffID + ")";
                ds.SearchScope = SearchScope.Subtree;
                SearchResult rs = ds.FindOne();

                
                
                if (rs.GetDirectoryEntry().Properties.Values.Count > 0)
                {
                    //isValid = pokemonObject.is_valid(ffID);

                    //if (lotValid.Values.Count > 0)
                    //{
                    //    lotValid = pokemonObject.lot_id_validation(ffID);
                    //    employee_data.Add(this.GV_lot_user_validation, lotValid["FFID"]);
                    //}
                    //else { 
                    
                    //}

                    lotValid = pokemonObject.lot_id_validation(ffID);
                    employee_data.Add("getLotValidation", lotValid["FFID"]);
                    employee_data.Add("validUser", lotValid["validUser"]);

                    schedApprover = pokemonObject.sched_validation(ffID);
                    employee_data.Add("schedValidation", schedApprover["validUser"]);

                    if (pokemonObject.is_valid(ffID).Count > 0)
                    {
                        
                        isValid["done"] = "TRUE";

                        employee_data.Add(this.GV_is_valid_ffid, isValid["done"]);

                        string ff_id = rs.GetDirectoryEntry().Properties["sAMAccountName"].Value.ToString();
                        string first_name = rs.GetDirectoryEntry().Properties["givenName"].Value.ToString();
                        string last_name = rs.GetDirectoryEntry().Properties["sn"].Value.ToString();
                        string email = rs.GetDirectoryEntry().Properties["mail"].Value.ToString();

                        IDictionary<string, string> validUser = new Dictionary<string, string>();

                        employee_data.Add(this.GV_session_ff_id, ff_id);
                        employee_data.Add(this.GV_session_first_name, first_name);
                        employee_data.Add(this.GV_session_last_name, last_name);
                        employee_data.Add(this.GV_session_email, email);
                       
                        Session[this.GV_sessionName_employee_data] = employee_data;

                        results["done"] = "TRUE";
                        results["msg"] = "<strong class='error'>Connected to Active Directory server Successfully (LDAP)</strong>";
                    }

                    else {
                        isValid["done"] = "FALSE";

                        employee_data.Add(this.GV_is_valid_ffid, isValid["done"]);
                        string ff_id = rs.GetDirectoryEntry().Properties["sAMAccountName"].Value.ToString();
                        string first_name = rs.GetDirectoryEntry().Properties["givenName"].Value.ToString();
                        string last_name = rs.GetDirectoryEntry().Properties["sn"].Value.ToString();
                        string email = rs.GetDirectoryEntry().Properties["mail"].Value.ToString();

                        IDictionary<string, string> validUser = new Dictionary<string, string>();

                        employee_data.Add(this.GV_session_ff_id, ff_id);
                        employee_data.Add(this.GV_session_first_name, first_name);
                        employee_data.Add(this.GV_session_last_name, last_name);
                        employee_data.Add(this.GV_session_email, email);
                        
                        Session[this.GV_sessionName_employee_data] = employee_data;

                        results["done"] = "TRUE";
                        results["msg"] = "<strong class='error'>Connected to Active Directory server Successfully (LDAP)</strong>";
                    }
                }
            }
            catch (Exception ex)
			{
				results["done"] = "FALSE";
				results["msg"] = "<strong class='error'>" + ex.Message + "</strong>";
			}

                return Json(results);  
        }
        [HttpPost]
        [ValidateInput(true)]
        public JsonResult Login_employee_noad(string username, string password)
        {
            IDictionary<string, string> results = new Dictionary<string, string>();
            IDictionary<string, string> employee_data = new Dictionary<string, string>();
            IDictionary<string, string> isValid = new Dictionary<string, string>();
            var hashpass = this.GetHashMD5(password);
            results = pokemonObject.check_user_promis(username, hashpass);
            if (results.Values.Count > 0)
            {
                employee_data.Add(this.GV_session_ff_id, results["Email_Address"]);
                employee_data.Add(this.GV_session_first_name, results["First_Name"]);
                employee_data.Add(this.GV_session_last_name, results["Last_Name"]);
                employee_data.Add(this.GV_session_email, results["Email_Address"]);
                Session[this.GV_sessionName_employee_data] = employee_data;
                results["done"] = "TRUE";

                return Json(results);
            }
            else {
                results["done"] = "FALSE";

                return Json(results);
            }

        }

        
    }
}