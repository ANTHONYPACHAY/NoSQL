/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package apis;

import DAO.PublicationsDAO;
import MODELS.Person;
import MODELS.Publications;
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
@Path("publications")
public class PublicationsApi {

    @Context
    private UriInfo context;

    PublicationsDAO publ = null;

    /**
     * Creates a new instance of PublicationsApi
     */
    public PublicationsApi() {
        publ = new PublicationsDAO();
    }

    @POST
    @Path("/newPublication")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response newPublication(String data) {
        String message = Methods.getJsonMessage("4", "Parameters are missing..", "{}");
        System.out.println("newPublication...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String description = Methods.JsonToString(jso, "description", "").replace("\"", "'");
            String url_image = Methods.JsonToString(jso, "url_image", "");
            String date = Methods.JsonToString(jso, "date", "");
            String person_id = Methods.JsonToString(jso, "person_id", "");
//            String user_token = Methods.JsonToString(jso, "user_token", "");
//            String[] clains = Methods.getDataToJwt(user_token);
//            String[] resp = Methods.validatePermit(clains[0], clains[1], 1);
//            if (resp[0].equals("2")) {
            Publications publi = new Publications();
            publi.setDescription(description);
            publi.setUrl_image(url_image);
            publi.setDate(date);

            String[] res = publ.newPublication(publi, person_id);
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/listPublications")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response listPublications(String data) {
        String message = Methods.getJsonMessage("4", "Parameters are missing..", "{}");
        System.out.println("listPublications...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String person_id = Methods.JsonToString(jso, "person_id", "");
            String option = Methods.JsonToString(jso, "option", "");
            if (option.equals("from")) {
                String[] res = publ.listPublicationsFrom(person_id);
//                System.out.println(res[2]);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            } else if (option.equals("to")) {
                String[] res = publ.listPublicationsTo(person_id);
//                System.out.println(res[2]);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            }
            
        }
        System.out.println("<------------------------------------>");
        System.out.println(message);
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }
}
