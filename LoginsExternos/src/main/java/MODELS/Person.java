/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MODELS;

import org.json.JSONObject;
import org.json.XML;

/**
 *
 * @author tonyp
 */
public class Person {
    
    private String id_p = "";
    private String name_p = "";
    private String lastname_p = "";
    private String email_p = "";
    private String password_p = "";
    private String provider_p = "";
    private String img_p = "";
    private String isnew_user = "";

    public String getId_p() {
        return id_p;
    }

    public void setId_p(String id_p) {
        this.id_p = id_p;
    }

    public String getName_p() {
        return name_p;
    }

    public void setName_p(String name_p) {
        this.name_p = name_p;
    }

    public String getLastname_p() {
        return lastname_p;
    }

    public void setLastname_p(String lastname_p) {
        this.lastname_p = lastname_p;
    }

    public String getEmail_p() {
        return email_p;
    }

    public void setEmail_p(String email_p) {
        this.email_p = email_p;
    }

    public String getPassword_p() {
        return password_p;
    }

    public void setPassword_p(String password_p) {
        this.password_p = password_p;
    }

    public String getProvider_p() {
        return provider_p;
    }

    public void setProvider_p(String provider_p) {
        this.provider_p = provider_p;
    }

    public String getImg_p() {
        return img_p;
    }

    public void setImg_p(String img_p) {
        this.img_p = img_p;
    }

    public String getIsnew_user() {
        return isnew_user;
    }

    public void setIsnew_user(String isnew_user) {
        this.isnew_user = isnew_user;
    }

    @Override
    public String toString() {
        JSONObject jsonU = new JSONObject(this);
        return "<person>" + XML.toString(jsonU) + "</person>";
    }
}
