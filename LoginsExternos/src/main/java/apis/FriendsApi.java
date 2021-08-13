/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package apis;

import DAO.FriendsDAO;
import com.google.gson.JsonObject;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import utilitarios.Methods;

/**
 * REST Web Service
 *
 * @author tonyp
 */
@Path("friends")
public class FriendsApi {

    @Context
    private UriInfo context;

    FriendsDAO frdsDao = null;

    /**
     * Creates a new instance of Friends
     */
    public FriendsApi() {
        frdsDao = new FriendsDAO();
    }

    @POST
    @Path("/listFriends")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response listUsers(String data) {
        String message;
        System.out.println("listFriends...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String person_id = Methods.JsonToString(jso, "person_id", "");

            String[] res = frdsDao.listFiends(person_id);
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
        } else {
            message = Methods.getJsonMessage("4", "Parameters are missing.", "[]");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/mkrmFriend")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response mkrmFriend(String data) {
        String message = Methods.getJsonMessage("4", "Parameters are missing.", "[]");
        System.out.println("mkrmFriend...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String person_id = Methods.JsonToString(jso, "person_id", "");
            String friend_id = Methods.JsonToString(jso, "friend_id", "");
            String option = Methods.JsonToString(jso, "option", "");
            if (option.equals("mk")) {
                String[] res = frdsDao.addFriend(person_id, friend_id);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            } else if (option.equals("rm")) {
                String[] res = frdsDao.deleteFriend(person_id, friend_id);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            }
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/gethomeLoad")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response gethomeLoad(String data) {
        String message = Methods.getJsonMessage("4", "Parameters are missing.", "[]");
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() == 0) {
            String[] res = frdsDao.gethomeLoad();
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }
}
