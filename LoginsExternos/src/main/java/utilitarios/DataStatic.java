/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utilitarios;

/**
 *
 * @author Usuario
 */
public class DataStatic {

    public static String nameApplication = "EaAccess";
    public static String userKey = "appUser";

    public static String dbName = "loginext";
    public static String dbUser = "postgres";
    public static String dbPassword = "anthony23";
    public static String dbPort = "5432";

    public static String dbHost = "localhost";
    
    //datos no operables
    //ruta absoluta del archivo
    private static final String fileLocation = "";
    //area de reemplazo en las rutas
    //caracteres viejos
    private static String StringTarget = "";
    private static String StringReplacement = "";

    public static String getLocation(String context) {
        if (!fileLocation.equals("")) {
            context = fileLocation;
        }
        return context.replace(StringTarget, StringReplacement);
    }
}
