package utn.tienda_libros.vista;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utn.tienda_libros.modelo.Libro;
import utn.tienda_libros.servicio.LibroServicio;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

@Component
public class LibroFrom extends JFrame {
    private final LibroServicio libroServicio;
    private JPanel panel;
    private JTable tablaLibros;
    private JTextField libroTexto;
    private JTextField autorTexto;
    private JTextField precioTexto;
    private JTextField existenciasTexto;
    private JButton agregarButton;
    private JButton modificarButton;
    private JButton eliminarButton;
    private JButton salirButton; // 🔹 Nuevo botón Salir
    private DefaultTableModel tablaModeloLibros;

    private Integer idLibroSeleccionado = null;

    @Autowired
    public LibroFrom(LibroServicio libroServicio) {
        this.libroServicio = libroServicio;
        iniciarForma();

        agregarButton.addActionListener(e -> agregarLibro());
        modificarButton.addActionListener(e -> modificarLibro());
        eliminarButton.addActionListener(e -> eliminarLibro());

        // 🔹 Acción del botón Salir
        salirButton.addActionListener(e -> {
            int opcion = JOptionPane.showConfirmDialog(this,
                    "¿Deseas salir de la aplicación?",
                    "Confirmar salida",
                    JOptionPane.YES_NO_OPTION);
            if (opcion == JOptionPane.YES_OPTION) {
                System.exit(0);
            }
        });

        // 🔹 Listener para cargar datos cuando se selecciona una fila
        tablaLibros.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting() && tablaLibros.getSelectedRow() != -1) {
                cargarDatosSeleccionados();
            }
        });

        // 🔹 Doble clic para deseleccionar la fila
        tablaLibros.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2 && tablaLibros.getSelectedRow() != -1) {
                    limpiarFormulario(); // limpia los campos y deselecciona
                }
            }
        });
    }

    private void iniciarForma() {
        setContentPane(panel);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
        setSize(900, 700);

        // Centrar ventana
        Toolkit toolkit = Toolkit.getDefaultToolkit();
        Dimension tamanioPantalla = toolkit.getScreenSize();
        int x = (tamanioPantalla.width - getWidth()) / 2;
        int y = (tamanioPantalla.height - getHeight()) / 2;
        setLocation(x, y);
    }

    private void agregarLibro() {
        String nombreLibro = libroTexto.getText().trim();
        String autor = autorTexto.getText().trim();
        String precioStr = precioTexto.getText().trim();
        String existenciasStr = existenciasTexto.getText().trim();

        if (nombreLibro.isEmpty() || autor.isEmpty() || precioStr.isEmpty() || existenciasStr.isEmpty()) {
            mostrarMensaje("Por favor, completa todos los campos antes de agregar un libro.");
            return;
        }

        try {
            double precio = Double.parseDouble(precioStr);
            int existencias = Integer.parseInt(existenciasStr);

            if (precio <= 0 || existencias <= 0) {
                mostrarMensaje("El precio y las existencias deben ser mayores que cero.");
                return;
            }

            Libro libro = new Libro(null, nombreLibro, autor, precio, existencias);
            libroServicio.guardarLibro(libro);
            mostrarMensaje("Libro agregado correctamente.");
            limpiarFormulario();
            listarLibros();
        } catch (NumberFormatException e) {
            mostrarMensaje("Por favor, ingresa valores numéricos válidos en los campos Precio y Existencias.");
        } catch (Exception e) {
            mostrarMensaje("Ocurrió un error al agregar el libro: " + e.getMessage());
        }
    }

    private void modificarLibro() {
        if (idLibroSeleccionado == null) {
            mostrarMensaje("Selecciona un libro para modificar.");
            return;
        }

        String nombreLibro = libroTexto.getText().trim();
        String autor = autorTexto.getText().trim();
        String precioStr = precioTexto.getText().trim();
        String existenciasStr = existenciasTexto.getText().trim();

        if (nombreLibro.isEmpty() || autor.isEmpty() || precioStr.isEmpty() || existenciasStr.isEmpty()) {
            mostrarMensaje("Por favor, completa todos los campos antes de modificar el libro.");
            return;
        }

        try {
            double precio = Double.parseDouble(precioStr);
            int existencias = Integer.parseInt(existenciasStr);

            if (precio <= 0 || existencias <= 0) {
                mostrarMensaje("El precio y las existencias deben ser mayores que cero.");
                return;
            }

            Libro libro = new Libro(idLibroSeleccionado, nombreLibro, autor, precio, existencias);
            libroServicio.guardarLibro(libro);

            mostrarMensaje("Libro modificado correctamente.");
            limpiarFormulario();
            listarLibros();
        } catch (NumberFormatException e) {
            mostrarMensaje("Por favor, ingresa valores numéricos válidos en los campos Precio y Existencias.");
        } catch (Exception e) {
            mostrarMensaje("Error al modificar el libro: " + e.getMessage());
        }
    }

    private void eliminarLibro() {
        if (idLibroSeleccionado == null) {
            mostrarMensaje("Selecciona un libro para eliminar.");
            return;
        }

        int opcion = JOptionPane.showConfirmDialog(this,
                "¿Seguro que deseas eliminar este libro?",
                "Confirmar eliminación",
                JOptionPane.YES_NO_OPTION);

        if (opcion == JOptionPane.YES_OPTION) {
            Libro libro = new Libro();
            libro.setIdLibro(idLibroSeleccionado);
            libroServicio.eliminarLibro(libro);
            mostrarMensaje("Libro eliminado correctamente.");
            limpiarFormulario();
            listarLibros();
        }
    }

    private void cargarDatosSeleccionados() {
        int fila = tablaLibros.getSelectedRow();
        if (fila != -1) {
            idLibroSeleccionado = Integer.parseInt(tablaModeloLibros.getValueAt(fila, 0).toString());
            libroTexto.setText(tablaModeloLibros.getValueAt(fila, 1).toString());
            autorTexto.setText(tablaModeloLibros.getValueAt(fila, 2).toString());
            precioTexto.setText(tablaModeloLibros.getValueAt(fila, 3).toString());
            existenciasTexto.setText(tablaModeloLibros.getValueAt(fila, 4).toString());
        }
    }

    private void limpiarFormulario() {
        libroTexto.setText("");
        autorTexto.setText("");
        precioTexto.setText("");
        existenciasTexto.setText("");
        idLibroSeleccionado = null;
        tablaLibros.clearSelection();
    }

    private void mostrarMensaje(String mensaje) {
        JOptionPane.showMessageDialog(this, mensaje);
    }

    private void createUIComponents() {
        this.tablaModeloLibros = new DefaultTableModel(0, 5){
            @Override
            public boolean isCellEditable(int row, int column){
                return false;
            }
        };
        String[] cabecera = {"Id", "Libro", "Autor", "Precio", "Existencias"};
        this.tablaModeloLibros.setColumnIdentifiers(cabecera);
        this.tablaLibros = new JTable(tablaModeloLibros);
        tablaLibros.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        listarLibros();
    }

    private void listarLibros() {
        tablaModeloLibros.setRowCount(0);
        var libros = libroServicio.listarLibros();
        libros.forEach(libro -> {
            Object[] renglonLibro = {
                    libro.getIdLibro(),
                    libro.getNombreLibro(),
                    libro.getAutor(),
                    libro.getPrecio(),
                    libro.getExistencias()
            };
            this.tablaModeloLibros.addRow(renglonLibro);
        });
    }
}



