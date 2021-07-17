/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package person;

import javax.swing.table.DefaultTableModel;
import utilitarios.Conection;

/**
 *
 * @author tonyp
 */
public class PersonDAO {
    
    public String[] logIn(Person per){
        Conection conex = new Conection();
        String sentecy = String.format("select * from usuarioinsertar('%s')", per.toString());
        System.out.println(sentecy);
        DefaultTableModel dat = conex.returnRecord(sentecy);
        if(dat.getRowCount() > 0 && dat.getColumnCount()>= 3){
            System.out.println("111");
            return new String[]{
                dat.getValueAt(0, 0).toString(),
                dat.getValueAt(0, 1).toString(),
                dat.getValueAt(0, 2).toString()
            };
        }else{
            System.out.println("222");
            return new String[]{"4","Operación no completada", "[]"};
        }
    }
    
}
