
import { useState } from 'react';

const categorias = {
  entrantes: [
    { nombre: "Ensalada de pasta", precio: "5€" },
    { nombre: "Hummus con crudités", precio: "4€" },
    { nombre: "Tortilla de patatas", precio: "6€" },
  ],
  principales: [
    { nombre: "Pollo con arroz integral", precio: "9€" },
    { nombre: "Tofu salteado con verduras", precio: "8€" },
    { nombre: "Salmón con quinoa", precio: "10€" },
  ],
  postres: [
    { nombre: "Yogur con frutas", precio: "3€" },
    { nombre: "Barrita energética casera", precio: "2€" },
    { nombre: "Macedonia natural", precio: "3€" },
  ],
  bebidas: [
    { nombre: "Agua", precio: "1€" },
    { nombre: "Isotónica natural", precio: "2€" },
    { nombre: "Smoothie postpartido", precio: "3€" },
  ],
};

export default function App() {
  const [paso, setPaso] = useState(1);
  const [formulario, setFormulario] = useState({
    nombre: "",
    equipo: "",
    telefono: "",
    localidad: "",
    hora: "",
  });
  const [seleccion, setSeleccion] = useState({
    entrantes: [],
    principales: [],
    postres: [],
    bebidas: [],
  });
  const [quiereBebidas, setQuiereBebidas] = useState(false);

  const handleFormulario = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const toggleSeleccion = (categoria, nombre) => {
    const yaSeleccionado = seleccion[categoria].includes(nombre);
    let nuevaSeleccion = [...seleccion[categoria]];
    if (yaSeleccionado) {
      nuevaSeleccion = nuevaSeleccion.filter((item) => item !== nombre);
    } else {
      if (nuevaSeleccion.length >= 3) return;
      nuevaSeleccion.push(nombre);
    }
    setSeleccion({ ...seleccion, [categoria]: nuevaSeleccion });
  };

  const handleEnviar = async () => {
    const data = { ...formulario, seleccion };
    console.log("Solicitud enviada:", data);
    alert("Solicitud enviada. En menos de 24 horas nos pondremos en contacto contigo. ¡Gracias!");
  };

  if (paso === 1) {
    return (
      <div style={{ padding: "1rem", maxWidth: "500px", margin: "0 auto" }}>
        <h1>Datos básicos</h1>
        {Object.keys(formulario).map((campo) => (
          <div key={campo} style={{ marginBottom: "1rem" }}>
            <input
              name={campo}
              value={formulario[campo]}
              onChange={handleFormulario}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        ))}
        <button onClick={() => setPaso(2)}>Siguiente</button>
      </div>
    );
  }

  if (paso === 2) {
    return (
      <div style={{ padding: "1rem", maxWidth: "500px", margin: "0 auto" }}>
        <h2>Elige tu menú pos partido</h2>
        {Object.entries(categorias).map(([categoria, platos]) => {
          if (categoria === "bebidas" && !quiereBebidas) return null;
          if (categoria === "bebidas" && !seleccion.bebidas.length && quiereBebidas) return (
            <div key="bebidas">
              <h3>Bebidas</h3>
              {platos.map(({ nombre, precio }) => (
                <label key={nombre} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{nombre} - {precio}</span>
                  <input
                    type="checkbox"
                    checked={seleccion.bebidas.includes(nombre)}
                    onChange={() => toggleSeleccion("bebidas", nombre)}
                  />
                </label>
              ))}
            </div>
          );
          if (categoria !== "bebidas") {
            return (
              <div key={categoria}>
                <h3>{categoria}</h3>
                {platos.map(({ nombre, precio }) => (
                  <label key={nombre} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{nombre} - {precio}</span>
                    <input
                      type="checkbox"
                      checked={seleccion[categoria].includes(nombre)}
                      onChange={() => toggleSeleccion(categoria, nombre)}
                    />
                  </label>
                ))}
              </div>
            );
          }
          return null;
        })}
        {!quiereBebidas ? (
          <button onClick={() => setQuiereBebidas(true)}>¿Quieres bebidas?</button>
        ) : null}
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => setPaso(3)}>He terminado</button>
        </div>
      </div>
    );
  }

  if (paso === 3) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h2>¿Has terminado?</h2>
        <button onClick={handleEnviar}>Sí, enviar solicitud</button>
      </div>
    );
  }
}
