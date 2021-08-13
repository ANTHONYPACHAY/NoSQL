/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utilitarios;

import com.google.gson.Gson;
import java.util.List;
import javax.swing.table.DefaultTableModel;
import org.json.JSONArray;
import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.neo4j.driver.Record;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import static org.neo4j.driver.Values.parameters;

/**
 *
 * @author tonyp
 */
public class Neo4jConection {

    private Driver globalDriver = null;
    private Session globalSession = null;

    public Neo4jConection() {
    }

    public boolean openConecction() {
        try {
            globalDriver = GraphDatabase.driver("bolt://localhost:7687", AuthTokens.basic("neo4j", "1234"));
            globalSession = globalDriver.session();
            return globalSession.isOpen();
        } catch (Exception exc) {
            System.out.println("No NeoConnection: " + exc.getMessage());
            if (globalDriver != null) {
                globalDriver.close();
            }
            return false;
        }
    }

    public boolean closeConnection() {
        try {
            if (globalSession != null) {
                globalSession.close();
            }
            if (globalDriver != null) {
                globalDriver.close();
            }
        } catch (Exception exc) {
            System.out.println("Error close connection:" + exc.getMessage());
            return false;
        }
        return true;
    }

    public boolean testConection() {
        boolean test = openConecction();
        if (test) {
            closeConnection();
        }
        System.out.println("test:" + test);
        return test;
    }

    public boolean modifyBD(String sentency) {
        boolean status = false;
        if (openConecction()) {
            try {
                Result result = globalSession.run(sentency);
                status = true;
            } catch (Exception e) {
                System.out.println("NeoException: " + e.getMessage());
            }
            closeConnection();
        }
        return status;
    }

    public DefaultTableModel returnRecord(String sentecy) {
        DefaultTableModel dataModel = new DefaultTableModel();
        if (openConecction()) {
            try {
//                Result result = globalSession.run("MATCH (a:Person) WHERE a.name = {name} "
//                + "RETURN a.name AS name, a.title AS title",
//                parameters("name", "Arthur"));
                Result result = globalSession.run(sentecy);
                List<String> headers = result.keys();
                int columnCount = headers.size();
                for (int i = 0; i < columnCount; i++) {
                    dataModel.addColumn(headers.get(i));
                }
                String[] row = new String[columnCount];
                while (result.hasNext()) {
                    Record rec = result.next();
                    for (int i = 0; i < columnCount; i++) {
                        String cell = rec.get(headers.get(i)).toString();
                        row[i] = cell == null ? "" : cell;
                    }
                    dataModel.addRow(row);
                }
            } catch (Exception exc) {
                System.out.println("Error return Record:" + exc.getMessage());
                dataModel = new DefaultTableModel();
            }
            closeConnection();
        }
        return dataModel;
    }

    public String returnJson(String sentecy) {
        sentecy = String.format("CALL apoc.export.json.query(\"%s\", null, {stream: true}) YIELD data RETURN data",
                sentecy);
        System.out.println(sentecy);
        return callApocReturnJson(sentecy);
    }

    public String callApocReturnJson(String sentecy) {
        String stringResponse = "";
        if (openConecction()) {
            try {
                Result result = globalSession.run(sentecy);
//                System.out.println("-----------------------------");
                while (result.hasNext()) {
                    Record rec = result.next();
                    List<String> headers = result.keys();
                    stringResponse = rec.get(headers.get(0)).asString();
                }
            } catch (Exception exc) {
                System.out.println("Error fill string:" + exc.getMessage());
                return "";
            }
            closeConnection();
        }
        return stringResponse == null ? "" : stringResponse;
    }
    
    public String fillString(String sentecy) {
        String stringResponse = "";
        if (openConecction()) {
            try {
                Result result = globalSession.run(sentecy);
//                System.out.println("-----------------------------");
                while (result.hasNext()) {
                    Record rec = result.next();
                    List<String> headers = result.keys();
                    stringResponse = rec.get(headers.get(0)).toString();
//                    System.out.println(stringResponse);
                }
            } catch (Exception exc) {
                System.out.println("Error fill string:" + exc.getMessage());
                return "";
            }
            closeConnection();
        }
        return stringResponse == null ? "" : stringResponse;
    }

    public String getRecordsInJson(String sentency) {
        String resul = "[";
        DefaultTableModel table = returnRecord(sentency);
        if (table != null) {
            int columCount = table.getColumnCount();
            for (int row = 0; row < table.getRowCount(); row++) {
                String line = "";
                for (int colum = 0; colum < columCount; colum++) {
                    line += "\"" + table.getColumnName(colum) + "\":" + table.getValueAt(row, colum).toString() + "";
                    if (colum < columCount - 1) {
                        line += ",";
                    }
                }
                if (line.length() > 0) {
                    resul += "{" + line + "}";
                    if (row < table.getRowCount() - 1) {
                        resul += ",";
                    }
                }
            }
            resul += "]";
        } else {
            resul = "[]";
        }
        return resul;
    }
}
