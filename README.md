# go_password

Generador de contraseñas seguras escrito en Go con interfaz web moderna.

## Descripción

go_password es una aplicación web minimalista para generar contraseñas seguras y aleatorias. Inspirada en el diseño de LastPass, ofrece una interfaz intuitiva con múltiples opciones de personalización para crear contraseñas que se adapten a tus necesidades específicas.

## Características

- 🔐 Generación de contraseñas criptográficamente seguras usando `crypto/rand`
- 🎨 Interfaz web moderna y responsiva
- ⚡ Generación en tiempo real al cambiar configuraciones
- 📋 Función de copiar al portapapeles con un clic
- 🔄 Botón de regeneración instantánea
- 📊 Indicador visual de fuerza de contraseña
- ⚙️ Múltiples opciones de personalización:
  - Longitud ajustable (4-50 caracteres)
  - Mayúsculas y minúsculas
  - Números y símbolos
  - Modo "Fácil de decir" (evita números y símbolos)
  - Modo "Fácil de leer" (evita caracteres ambiguos como l, 1, O, 0)
  - Modo "Todos los caracteres"

## Requisitos

- Go 1.16 o superior

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/GEBNETI/go_password.git
cd go_password
```

2. Ejecuta la aplicación:
```bash
go run main.go
```

3. Abre tu navegador en `http://localhost:8090`

## Configuración

### Puerto personalizado

Puedes configurar el puerto usando la variable de entorno `PORT`:

```bash
PORT=3000 go run main.go
```

O exportando la variable:

```bash
export PORT=3000
go run main.go
```

## Uso

1. **Ajusta la longitud**: Usa el control deslizante o ingresa directamente el número de caracteres deseados
2. **Selecciona el tipo de contraseña**:
   - **Fácil de decir**: Ideal para contraseñas que necesitas comunicar verbalmente
   - **Fácil de leer**: Evita caracteres que pueden confundirse visualmente
   - **Todos los caracteres**: Máxima seguridad con todos los tipos de caracteres
3. **Personaliza los caracteres**: Activa o desactiva mayúsculas, minúsculas, números y símbolos
4. **Copia la contraseña**: Haz clic en el botón de copiar o en "Copiar contraseña"
5. **Genera una nueva**: Usa el botón de regenerar para obtener una nueva contraseña

## Estructura del proyecto

```
go_password/
├── main.go              # Servidor Go y lógica de generación
├── go.mod               # Definición del módulo Go
├── templates/
│   └── index.html       # Plantilla HTML principal
├── static/
│   ├── css/
│   │   └── style.css    # Estilos de la aplicación
│   └── js/
│       └── app.js       # Lógica del cliente JavaScript
├── README.md            # Este archivo
└── LICENSE              # Licencia MIT
```

## API

### POST /generate

Genera una nueva contraseña basada en la configuración proporcionada.

**Request Body:**
```json
{
  "length": 12,
  "useUppercase": true,
  "useLowercase": true,
  "useNumbers": true,
  "useSymbols": true,
  "easyToSay": false,
  "easyToRead": false,
  "allCharacters": true
}
```

**Response:**
```json
{
  "password": "Abc123!@#xyz"
}
```

## Seguridad

- Las contraseñas se generan usando `crypto/rand` de Go para garantizar aleatoriedad criptográficamente segura
- No se almacenan contraseñas en el servidor
- Toda la generación ocurre en memoria
- La aplicación no requiere conexión a internet después de cargar

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Autor

[Efrén Fuentes](https://github.com/efrenfuentes) 

## Agradecimientos

- Diseño inspirado en el generador de contraseñas de LastPass
- Iconos SVG para los botones de copiar y regenerar
