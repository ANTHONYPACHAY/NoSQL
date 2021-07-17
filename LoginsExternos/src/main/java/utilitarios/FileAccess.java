/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utilitarios;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import javax.imageio.ImageIO;
import org.apache.commons.codec.binary.Base64;

/**
 *
 * @author USUARIO
 */
public class FileAccess {

    public FileAccess() {
    }

    public String readFileText(String location, String flagformat) {
        File archivo = null;
        FileReader fr = null;
        BufferedReader br = null;
        String result = "";
        try {
            archivo = new File(location);
            if (archivo.exists()) {
                fr = new FileReader(archivo);
                br = new BufferedReader(fr);
                String linea;
                while ((linea = br.readLine()) != null) {
                    result += linea + (flagformat.equals("t")?"\\n":"");
                }
            } else {
                result = "{}";
                System.out.println("Archivo no existe");
            }
        } catch (Exception e) {
            result = "{}";
            System.out.println("Error in read File project");
        } finally {
            try {
                if (null != fr) {
                    fr.close();
                }
                if (null != br) {
                    br.close();
                }
            } catch (Exception e2) {
                System.out.println("Error in ModelProjectController.readFileText.fr.close()");
            }
        }
        return result;
    }

    public boolean writeFileText(String location, String structure) {
        FileWriter fichero = null;
        PrintWriter pw = null;
        try {
            fichero = new FileWriter(location);
            pw = new PrintWriter(fichero);
            pw.println(structure);
        } catch (Exception e) {
            System.out.println("Error in save File project");
        } finally {
            try {
                if (null != fichero) {
                    fichero.close();
                }
                if (null != pw) {
                    pw.close();
                }
            } catch (Exception e2) {
                System.out.println("Error in ModelProjectController.writeFileText.fichero.close()");
            }
        }
        return true;
    }

    public boolean SaveImg(String base64, String rutaImagen) {
        File file = new File(rutaImagen);
        return writeOutputStream(base64, file);
    }

    private boolean writeOutputStream(String value, File outputStream) {
        String[] partes = value.split(",");
        try {
            byte[] imgBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(partes[1]);
            BufferedImage bufImg = ImageIO.read(new ByteArrayInputStream(imgBytes));
            ImageIO.write(bufImg, "png", outputStream);
            return true;
        } catch (Exception e) {
            System.out.println("Error creating image: " + e.getMessage());
            return false;
        }
    }

    public boolean saveFile(String base64, String fileurl) {
        String[] parts = base64.split(",");
        try {
            byte[] dataBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(parts[1]);
            FileOutputStream out = new FileOutputStream(fileurl);
            out.write(dataBytes);
            out.close();
            return true;
        } catch (Exception e) {
            System.out.println("Error creating image: " + e.getMessage());
            return false;
        }
    }

    public String getFileNames(String ruta, String folder, String root) {
        String files = "[";
        try {
            File carpeta = new File(ruta);
//            System.out.println("r:"+ruta+"\n"+carpeta.listFiles().length);
            for (File archivo : carpeta.listFiles()) {
                String extension = archivo.getName().substring(archivo.getName().lastIndexOf(".") + 1, archivo.getName().length());
                files += String.format("{\"name\":\"%s\",\"extension\":\"%s\",\"path\":\"%s\"},",
                        archivo.getName(), extension,
                        root + folder + archivo.getName());//folderDataCenter
            }
            if (!files.equals("[")) {
                files = files.substring(0, files.length() - 1) + "]";
            } else {
                files += "]";
            }
//            System.out.println(files);
            return files;
        } catch (Exception e) {
            return "[]";
        }
    }

    public String getFileInfo(String ruta) {
        String files = "[";
        try {
            File carpeta = new File(ruta);
//            System.out.println("r:"+ruta+"\n"+carpeta.listFiles().length);
            for (File archivo : carpeta.listFiles()) {
                String extension = archivo.getName().substring(archivo.getName().lastIndexOf(".") + 1, archivo.getName().length());
                String documento = readFileText(ruta + "/" + archivo.getName(), "t");
                byte[] bytesEncoded = Base64.encodeBase64(documento.getBytes());
                documento = new String(bytesEncoded);
                files += String.format("{\"name\":\"%s\",\"extension\":\"%s\",\"data\":\"%s\"},",
                        archivo.getName(), extension, documento);
            }
            if (!files.equals("[")) {
                files = files.substring(0, files.length() - 1) + "]";
            } else {
                files += "]";
            }
//            System.out.println(files);
            return files;
        } catch (Exception e) {
            return "[]";
        }
    }

    public boolean deleteFile(String fileurl) {
        boolean resp = false;
        try {
            File carpeta = new File(fileurl);
            if (carpeta.exists()) {
                resp = carpeta.delete();
            }
        } catch (Exception e) {
            System.out.println("deleteFile:" + e.getMessage());
        }
        return resp;
    }

    public String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1, filename.length());
    }

    public String cleanFileName(String fileName) {
        return fileName.toLowerCase().replaceAll("[^a-zA-ZñÑ0-9\\s]+", "");
    }
}
