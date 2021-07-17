package apis;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import com.google.gson.JsonObject;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import person.Person;
import person.PersonDAO;
import utilitarios.Methods;

/**
 * REST Web Service
 *
 * @author tonyp
 */
@Path("person")
public class PersonApi {

    @Context
    private UriInfo context;
    PersonDAO pdao;

    /**
     * Creates a new instance of PersonaApi
     */
    public PersonApi() {
        pdao = new PersonDAO();
    }

    @POST
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(String data) {
        String message;
        System.out.println("login...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String username = Methods.JsonToString(jso, "username", "");
            String userlastname = Methods.JsonToString(jso, "userlastname", "");
            String useremail = Methods.JsonToString(jso, "useremail", "");
            String userid = Methods.JsonToString(jso, "userid", "");
            String provider = Methods.JsonToString(jso, "provider", "");
            String isNewUser = Methods.JsonToString(jso, "isNewUser", "");

            Person p = new Person();
            p.setName_p(username);
            p.setLastname_p(userlastname);
            p.setEmail_p(useremail);
            p.setPassword_p(userid);
            p.setProvider_p(provider);
            p.setIsnew_user(isNewUser.equals("true") ? "si" : "no");

            String[] res = pdao.logIn(p);
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
        } else {
            message = Methods.getJsonMessage("4", "Faltan Datos.", "{}");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

}
