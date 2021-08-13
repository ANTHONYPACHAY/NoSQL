/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import MODELS.Person;
import utilitarios.Methods;
import utilitarios.Neo4jConection;

/**
 *
 * @author tonyp
 */
public class FriendsDAO {

    public String getFriendsId(String from) {
        String query = String.format(
                "MATCH(from:person) WHERE id(from)=%s "
                + "MATCH(from)-[f:friends]-(to:person)"
                + "RETURN distinct id(to) as identifier", from
        );
        Neo4jConection conex = new Neo4jConection();
        String response = conex.getRecordsInJson(query);
        return response;
    }

    public String[] listFiends(String from) {
        String query = String.format("MATCH (from:person) WHERE id(from)=%s\n"
                + "MATCH (from)-[:friends]-(to:person) \n"
                + "RETURN id(to) as identifier, to.name_p, to.lastname_p, to.email_p, "
                + "to.provider_p, to.img_p", from);
        Neo4jConection conex = new Neo4jConection();
        String response = conex.getRecordsInJson(query);
        if (!response.equals("[]")) {
            return new String[]{"2", "Records uploaded successfully.", response};
        } else {
            return new String[]{"4", "No records found.", "[]"};
        }
    }

    public String[] addFriend(String from, String to) {
        String query = String.format("MATCH (from:person) WHERE id(from)=%s \n"
                + "MATCH (to:person) WHERE id(to)=%s\n"
                + "CREATE (from)-[rel:friends]->(to)\n"
                + "RETURN COUNT(rel)", from, to);
        Neo4jConection conex = new Neo4jConection();
        String status = conex.fillString(query);
        if (status.equals("1")) {
            return new String[]{"2", "Friend added successfully.", "[]"};
        } else {
            return new String[]{"4", "No records found.", "[]"};
        }
    }

    public String[] deleteFriend(String from, String to) {
        String query = String.format("MATCH (from:person) WHERE id(from)=%s \n"
                + "MATCH (to:person) WHERE id(to)=%s\n"
                + "MATCH (from)-[rel:friends]-(to)\n"
                + "DELETE rel RETURN COUNT(rel)", from, to);
        Neo4jConection conex = new Neo4jConection();
        String status = conex.fillString(query);
        if (!status.equals("")) {
            return new String[]{"2", "Friend removed successfully.", "[]"};
        } else {
            return new String[]{"4", "No records found.", "[]"};
        }
    }

    public String[] gethomeLoad() {
        String query = String.format("MATCH (u:person)\n"
                + "RETURN COUNT(u) as counter\n"
                + "UNION ALL\n"
                + "MATCH f=(:person)-[:friends]->(:person)\n"
                + "RETURN COUNT(f) as counter\n"
                + "UNION ALL\n"
                + "MATCH p=(:person)-[:post]->(:publication)\n"
                + "RETURN COUNT(p) as counter");
        Neo4jConection conex = new Neo4jConection();
        String status = Methods.tableToJson(conex.returnRecord(query));
        if (!status.equals("{}")) {
            return new String[]{"2", "Friend removed successfully.", status};
        } else {
            return new String[]{"4", "No records found.", "[]"};
        }
    }
}
