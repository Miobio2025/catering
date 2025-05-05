// App principal con todas las pantallas y lógica integrada
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

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
  const [seleccion, setSeleccion] = useState({ entrantes: [], principales: [], postres: [], bebidas: [] });
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
    const data = {
      ...formulario,
      seleccion,
    };
    try {
      await fetch("https://tu-backend-render.com/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast("Solicitud enviada. En menos de 24h nos pondremos en contacto contigo. ¡Gracias!");
    } catch (e) {
      toast("Error al enviar. Inténtalo más tarde.");
    }
  };

  if (paso === 1) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Datos básicos</h1>
        {Object.keys(formulario).map((campo) => (
          <Input
            key={campo}
            name={campo}
            value={formulario[campo]}
            onChange={handleFormulario}
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            className="mb-2"
          />
        ))}
        <Button onClick={() => setPaso(2)}>Siguiente</Button>
      </div>
    );
  }

  if (paso === 2) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-2">Elige tu menú pos partido</h2>
        {Object.entries(categorias).map(([categoria, platos]) => {
          if (categoria === "bebidas" && !quiereBebidas) return null;
          if (categoria === "bebidas") return null;
          return (
            <Card className="mb-4" key={categoria}>
              <CardContent>
                <h3 className="font-bold capitalize">{categoria}</h3>
                {platos.map(({ nombre, precio }) => (
                  <div key={nombre} className="flex items-center justify-between">
                    <label>{nombre} - {precio}</label>
                    <Checkbox
                      checked={seleccion[categoria].includes(nombre)}
                      onCheckedChange={() => toggleSeleccion(categoria, nombre)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
        {!quiereBebidas ? (
          <Button onClick={() => setQuiereBebidas(true)} className="mb-4">¿Quieres bebidas?</Button>
        ) : (
          <Card className="mb-4">
            <CardContent>
              <h3 className="font-bold">Bebidas</h3>
              {categorias.bebidas.map(({ nombre, precio }) => (
                <div key={nombre} className="flex items-center justify-between">
                  <label>{nombre} - {precio}</label>
                  <Checkbox
                    checked={seleccion.bebidas.includes(nombre)}
                    onCheckedChange={() => toggleSeleccion("bebidas", nombre)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        <Button onClick={() => setPaso(3)}>He terminado</Button>
      </div>
    );
  }

  if (paso === 3) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <h2 className="text-lg mb-4">¿Has terminado?</h2>
        <Button onClick={handleEnviar}>Sí, enviar solicitud</Button>
      </div>
    );
  }
}
