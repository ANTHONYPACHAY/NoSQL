/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import MODELS.Publications;
import utilitarios.Methods;
import utilitarios.Neo4jConection;

/**
 *
 * @author tonyp
 */
public class PublicationsDAO {

    public String[] newPublication(Publications publ, String person_id) {
        String query = String.format("MATCH (from:person) WHERE id(from)=%s\n"
                + "CREATE(n:publication{url_image:'%s', description:'%s', date:'%s'}) \n"//person_id:%s, 
                + "CREATE (from)-[rel:post]->(n)\n"
                + "RETURN COUNT(n)",
                person_id, publ.getUrl_image(), publ.getDescription(), publ.getDate());
        Neo4jConection conex = new Neo4jConection();
        String status = conex.fillString(query);
        if (status.equals("1")) {
            return new String[]{"2", "Friend removed successfully.", "[]"};
        } else {
            return new String[]{"4", "The information could not be saved.", "[]"};
        }
    }

    public String[] listPublicationsFrom(String person_id) {
        String query = String.format("MATCH (from:person) WHERE id(from)=%s\n"
                + "MATCH (to:person)\n"
                + "MATCH (from)-[rel:friends]-(to)-[post]->(p:publication)\n"
                + "RETURN distinct id(p) as post_id, p.date as date, p.description as description, "
                + "p.url_image as url_image, id(to) as identifier, to.img_p as img, to.name_p as name, "
                + "to.lastname_p as lastname",
                person_id);
        Neo4jConection conex = new Neo4jConection();
        String status = conex.getRecordsInJson(query);
        if (!status.equals("")) {
            return new String[]{"2", "Posts uploaded successfully.", status};
        } else {
            return new String[]{"3", "No records found.", "[]"};
        }
    }

    public String[] listPublicationsTo(String person_id) {
        String query = String.format("MATCH (to:person) WHERE id(to)=%s\n"
                + "MATCH (to)-[post]->(p:publication)\n"
                + "RETURN distinct id(p) as post_id, p.date as date, p.description as description, "
                + "p.url_image as url_image, id(to) as identifier, to.img_p as img, to.name_p as name, "
                + "to.lastname_p as lastname",
                person_id);
        Neo4jConection conex = new Neo4jConection();
        String status = conex.getRecordsInJson(query);
        if (!status.equals("")) {
            return new String[]{"2", "Posts uploaded successfully.", status};
        } else {
            return new String[]{"3", "No records found.", "[]"};
        }
    }
}
