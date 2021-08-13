/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package neo;

import utilitarios.Neo4jConection;

/**
 *
 * @author tonyp
 */
public class init {
    public static void main(String[] args) {
        Neo4jConection conex = new Neo4jConection();
        conex.testConection();
        
        String json = conex.returnJson("MATCH (a)-[r:test]->(b) RETURN a,b,r");
        System.out.println(json);
    }
}
