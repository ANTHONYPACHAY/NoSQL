/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import javax.swing.table.DefaultTableModel;
import org.json.JSONObject;
import MODELS.Person;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import utilitarios.Conection;
import utilitarios.DataStatic;
import utilitarios.Methods;
import utilitarios.Neo4jConection;

/**
 *
 * @author tonyp
 */
public class PersonDAO {

    public PersonDAO() {
        //name_p, lastname_p ,email_p ,password_p ,provider_p , img_p
    }

    public String[] logIn(Person per) {
//        Conection conex = new Conection();
//        String sentecy = String.format("select * from usuarioinsertar('%s')", per.toString());
        String[] response = new String[]{"4", "Your order could not be processed.", "{}"};
        String[] resp = searchUserEmail(per);
        if (resp[0].equals("2")) {
            JsonArray jarr = Methods.stringToJsonArray(resp[2]);
//            System.out.println("--------------------------------------");
            for (int ind = 0; ind < jarr.size(); ind++) {
                JsonObject jso = Methods.JsonElementToJSO(jarr.get(ind));
                if (jso.size() > 0) {
//                    System.out.println(jso);
                    String email = Methods.JsonToString(jso, "n.email_p", "");
                    String password = Methods.JsonToString(jso, "n.password_p", "");
                    String provider_p = Methods.JsonToString(jso, "n.provider_p", "");
                    if (per.getEmail_p().equals(email)) {
                        if (!per.getPassword_p().equals(password)) {
                            response[0] = "3";
                            response[1] = "There is a problem with the identifier of the registered account.";
                        } else if (!per.getProvider_p().equals(provider_p)) {
                            response[0] = "3";
                            response[1] = "Your account is registered with " + provider_p;
                        } else {
                            response[0] = "2";
                            response[1] = "Successful login.";
                            response[2] = jso.toString();
                        }
                    }
                }
            }
        }
        // 4 significa que el usuario no fue encontrado
        if (response[0].equals("4")) {
            response = register(per);
        }
        String jwt = "";
        JsonObject jso = Methods.stringToJSON(response[2]);
        if (jso.size() > 0) {
            String id = Methods.JsonToSub(jso, "", "");
            if (!id.equals("")) {
                long tiempo = System.currentTimeMillis();
                jwt = Jwts.builder()
                        .signWith(SignatureAlgorithm.HS256, DataStatic.userKey)
                        .setSubject("-1")
                        .claim("user", id)
                        .claim("permit", "U")
                        .setIssuedAt(new Date(tiempo))
                        .setExpiration(new Date(tiempo + 2400000))
                        .compact();
            }
        }
        jso.addProperty("user_token", jwt);
        response[2] = jso.toString();
        return response;
    }

    public String[] register(Person per) {
        String query = String.format("CREATE(n:person{name_p:'%s',lastname_p:'%s',"
                + "email_p:'%s' ,password_p:'%s',provider_p:'%s', img_p:'%s'})"
                + "CREATE (n)-[rel:friends]->(n)"
                + " RETURN id(n) as identifier, n.name_p, n.lastname_p, n.email_p, "
                + "n.password_p, n.provider_p, n.img_p",
                per.getName_p(), per.getLastname_p(), per.getEmail_p(), per.getPassword_p(),
                per.getProvider_p(), per.getImg_p());
        Neo4jConection conex = new Neo4jConection();
        String status = conex.getRecordsInJson(query);
        System.out.println(query);
        if (!status.equals("{}")) {
            per.setId_p(status);
            return new String[]{"2", "Registered user successfully.", status.replace("[", "").replace("]", "")};
        } else {
            return new String[]{"4", "The user could not be registered.", "{}"};
        }
    }

    public String[] searchUserEmail(Person per) {
        String query = String.format("Match(n:person) WHERE n.email_p='%s' RETURN "
                + "id(n) as identifier, n.name_p, n.lastname_p, n.email_p, "
                + "n.password_p, n.provider_p, n.img_p", per.getEmail_p());
        Neo4jConection conex = new Neo4jConection();

//        System.out.println(query);
        String response = conex.getRecordsInJson(query);
        if (!response.equals("[]")) {
            return new String[]{"2", "Records uploaded successfully.", response};
        } else {
            return new String[]{"4", "No records found.", "[]"};
        }
    }

    public String[] searchUser(String userId, String key, String value) {
        String query = String.format("Match(n:person) WHERE n.%s STARTS WITH('%s') "
                + "RETURN id(n) as identifier, n.name_p, n.lastname_p ,n.email_p, n.img_p", key, value);
        Neo4jConection conex = new Neo4jConection();
        String response = conex.getRecordsInJson(query);
        FriendsDAO fdao = new FriendsDAO();
        String rel = fdao.getFriendsId(userId);
        String resp = String.format("{\"people\":%s, \"rels\":%s}", response, rel);

        if (!response.equals("[]")) {
            return new String[]{"2", "Records uploaded successfully.", resp};
        } else {
            return new String[]{"4", "No records found.", "[]"};
        }
    }

    public String[] deleteAccount(Person per) {
        String query = String.format("MATCH (n:person) WHERE id(n)=%s DETACH DELETE n",
                per.getId_p());
        Neo4jConection conex = new Neo4jConection();
        boolean status = conex.modifyBD(query);
        if (status) {
            return new String[]{"2", "Account deleted successfully.", "[]"};
        } else {
            return new String[]{"4", "No records found.", "[]"};
        }
    }

}
