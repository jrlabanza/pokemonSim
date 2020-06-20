using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace pokemonSim.Models
{
    public class pokemonMod
    {
        public Boolean OSRFormSubmit(string testerID, string handlerID, string family, string package, string process, string expectedDateofSetup, string shift, string status, string userFullName, string m3Number, string userFFID, string schedule, string reasonForUnplannedSetup)
        {
            if (schedule == "PLANNED") 
            { 
                string query = "INSERT INTO osr(testerID,handlerID,package,family,process,expectedDateOfSetup,shift,requestBy,status,m3Number, sub_ffID, isPlanned)"+
                "VALUES ('" + testerID + "', '" + handlerID + "', '" + package + "', '" + family + "', '" + process + "','" + expectedDateofSetup + "', '" + shift + "', '" + userFullName + "', 'FOR PREPARATION', '"+ m3Number +"', '"+ userFFID +"', 1)";

                string query2 = "INSERT INTO osr_history(testerID,handlerID,package,family,process,expectedDateOfSetup,shift,requestBy,status,m3Number)" +
                "VALUES ('" + testerID + "', '" + handlerID + "', '" + package + "', '" + family + "', '" + process + "','" + expectedDateofSetup + "', '" + shift + "', '" + userFullName + "', 'FOR PREPARATION', '" + m3Number + "')";

                Boolean results = Connection.ExecuteThisQuery(query, "Insert Form Success", Connection.pokemon_connstring);
                Connection.ExecuteThisQuery(query2, "Insert History", Connection.pokemon_connstring);

                return results;
            }
            else if (schedule == "UNPLANNED")
            {
                string query = "INSERT INTO osr(testerID,handlerID,package,family,process,expectedDateOfSetup,shift,requestBy,status,m3Number, sub_ffID, isPlanned)"+
                "VALUES ('" + testerID + "', '" + handlerID + "', '" + package + "', '" + family + "', '" + process + "','" + expectedDateofSetup + "', '" + shift + "', '" + userFullName + "', 'FOR APPROVAL', '"+ m3Number +"', '"+ userFFID +"', 0)";

                string query2 = "INSERT INTO osr_history(testerID,handlerID,package,family,process,expectedDateOfSetup,shift,requestBy,status,m3Number,reasonForUnplannedSetup)" +
                "VALUES ('" + testerID + "', '" + handlerID + "', '" + package + "', '" + family + "', '" + process + "','" + expectedDateofSetup + "', '" + shift + "', '" + userFullName + "', 'FOR APPROVAL', '" + m3Number + "', '" + reasonForUnplannedSetup + "')";

                Boolean results = Connection.ExecuteThisQuery(query, "Insert Form Success", Connection.pokemon_connstring);
                Connection.ExecuteThisQuery(query2, "Insert History", Connection.pokemon_connstring);

                return results;
            }
            else
            {
                Boolean results = false;

                return results;
            }

        }

        public Boolean OSRBurnInM3Number(string m3gen, int id)
        {
            string query = "UPDATE osr_burnin SET m3Number = '" + m3gen + "' WHERE id =" + id;
            string query2 = "UPDATE osr_history_burnin SET m3Number = '" + m3gen + "' ORDER BY id DESC LIMIT 1";

            Boolean results = Connection.ExecuteThisQuery(query, "Insert FLA Form", Connection.pokemon_connstring);
            Connection.ExecuteThisQuery(query2, "Insert FLA Form", Connection.pokemon_connstring);

            return results;
        }

        public IDictionary<string, string> get_trainer_stats()
        {

            IDictionary<string, string> results = new Dictionary<string, string>();

            string query = "SELECT * FROM trainer WHERE isDeleted = 0 AND trainer_id = 99470721";

            results = Connection.GetDataArray(query, "GET TRAINER DATA", Connection.pokemon_connstring);

            return results;
        }

        public List<IDictionary<string, string>> get_trainer_pokemon()
        {

            List<IDictionary<string, string>> results = new List<IDictionary<string, string>>();

            string query = @"SELECT trainer_pokedex.id, trainer_pokedex.pokemon_id, trainer_pokedex.pokemon_name, trainer_pokedex.trainer_id, current_lvl,
                             trainer_pokedex.current_exp, trainer_pokedex.exp_cap, master_pokedex.is_fire, master_pokedex.is_water, 
                             master_pokedex.is_grass, master_pokedex.is_electric, master_pokedex.is_flying, master_pokedex.lvl_unlock,
                             master_pokedex.lvl_unlock, master_pokedex.lvl_cap, master_pokedex.can_evolve,img FROM trainer_pokedex
                            LEFT JOIN master_pokedex
                            ON trainer_pokedex.pokemon_name = master_pokedex.pokemon_name;";

            results = Connection.GetDataAssociateArray(query, "GET OSR DATA", Connection.pokemon_connstring);

            return results;
        }

        public IDictionary<string, string> get_trainer_pokemon_by_id(int id)
        {

            IDictionary<string, string> results = new Dictionary<string, string>();

            string query = @"SELECT trainer_pokedex.id, trainer_pokedex.pokemon_id, trainer_pokedex.pokemon_name, trainer_pokedex.trainer_id, trainer_pokedex.current_lvl,
                             trainer_pokedex.current_exp, trainer_pokedex.exp_cap, master_pokedex.is_fire, master_pokedex.is_water, 
                             master_pokedex.is_grass, master_pokedex.is_electric, master_pokedex.is_flying, master_pokedex.lvl_unlock,
                             master_pokedex.lvl_unlock, master_pokedex.lvl_cap, master_pokedex.can_evolve, master_pokedex.img FROM trainer_pokedex
                            LEFT JOIN master_pokedex
                            ON trainer_pokedex.pokemon_name = master_pokedex.pokemon_name WHERE trainer_pokedex.id ="+ id;

            results = Connection.GetDataArray(query, "GET OSR DATA", Connection.pokemon_connstring);

            return results;
        }

        public IDictionary<string, string> get_pokemon_condition(string id, int lvl)
        {

            IDictionary<string, string> results = new Dictionary<string, string>();

            string query = @"SELECT master_pokedex.pokemon_id, master_pokedex.pokemon_name, master_pokedex.is_fire,
            master_pokedex.is_water, master_pokedex.is_grass, master_pokedex.is_electric, master_pokedex.is_flying,
            master_pokedex.lvl_unlock,master_pokedex.lvl_cap,master_pokedex.can_evolve FROM master_pokedex WHERE
            (" + lvl + " BETWEEN lvl_unlock AND lvl_cap) AND master_pokedex.pokemon_id = " + id + ";";

            results = Connection.GetDataArray(query, "GET OSR DATA", Connection.pokemon_connstring);

            return results;
        }

        public Boolean increase_level_only(string exp_cap, int new_level)
        {
            string query = "UPDATE trainer_pokedex SET current_lvl = " + new_level + ", exp_cap = " + exp_cap + ", current_exp = 0";

            Boolean results = Connection.ExecuteThisQuery(query, "GET OSR DATA", Connection.pokemon_connstring);

            return results;
        }

        public Boolean increase_exp_only(int current_exp)
        {
            string query = "UPDATE trainer_pokedex SET current_exp = "+ current_exp +";";

            Boolean results = Connection.ExecuteThisQuery(query, "GET OSR DATA", Connection.pokemon_connstring);

            return results;
        }

        public Boolean evolve_pokemon(string pokemon_name, int new_level, string exp_cap)
        {
            string query = "UPDATE trainer_pokedex SET current_exp = 0, pokemon_name = '"+ pokemon_name +"', current_lvl = "+ new_level +", exp_cap = "+ exp_cap +";";

            Boolean results = Connection.ExecuteThisQuery(query, "GET OSR DATA", Connection.pokemon_connstring);

            return results;
        }

         public IDictionary<string, string> get_game_state_level(int lvl)
        {

            IDictionary<string, string> results = new Dictionary<string, string>();

            string query = "SELECT * FROM game_state WHERE lvl = " + lvl;

            results = Connection.GetDataArray(query, "GET LEVEL GAME STATE", Connection.pokemon_connstring);

            return results;
        }

     }
}
