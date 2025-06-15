# Crypt GXJ

Proyecto desarrollado para la materia **Administración de Riesgos Informáticos** – Ciclo 01/2025  
Facultad de Ingeniería y Arquitectura, Departamento de Electrónica e Informática

---

## Descripción

Crypt GXJ es una aplicación web construida con Next.js que permite gestionar de forma segura la conversión de archivos de datos mediante servicios API, aplicando protocolos estándar y técnicas de cifrado y descifrado. Su propósito es simular escenarios de gestión de riesgos informáticos en el intercambio de información sensible.

Parte I – Funcionalidades principales:
- Generar y guardar un documento **XML** a partir de un archivo de texto delimitado.
- Generar y guardar un objeto **JSON** a partir del mismo archivo de texto.
- Generar y guardar un documento **XML** a partir de un objeto **JSON** o viceversa.
- Generar y guardar un archivo de texto delimitado a partir de un **XML** o **JSON**.
- Cifrar el dato de número de tarjeta de crédito al generar XML/JSON, y descifrarlo al volver a texto, solicitando una clave al usuario.

Para cada conversión:
- Selección de ruta de origen y destino mediante FileChooser.
- Especificación del delimitador de texto.
- Ingreso de la clave de cifrado/descifrado.
- Visualización del contenido origen y resultado en áreas de texto.
- Botones de acción claros para cada paso.

---

## Tecnologías

- **Framework:** Next.js  
- **Lenguaje:** TypeScript
- **Gestor de paquetes:** Yarn  
- **GeoJSON:** Manejo de entidades geográficas (puntos)

---

## Instalación y ejecución

1. Clonar el repositorio  
   ```bash
   git clone https://github.com/FrankoATR/CryptGXJ.git
   cd CryptGXJ
   ```

2. Instalar dependencias
    ```bash
    yarn install
    ```

3. Modo desarrollo
    ```bash
    yarn dev
    ```

4. Modo producción
    ```bash
    yarn build
    yarn start
    ```

5. Navegar a http://localhost:3000 para utilizar la aplicación.

6. Utilizar la siguiente información de ejemplo como datos de entrada para encriptar:
   ```txt
    03456567-7;Jaime Roberto;Climaco Navarrete;2346570012456;GOLD;22779898;POLYGON ((-90.76 17.81, -90.74 17.81, -90.76 17.81))
    23445672-7;FRANCISCO ALONSO;TORRES ROSA;9809876234566;PLATINUM;99856432;POLYGON ((-90.76 17.81, -90.74 17.81, -90.76 17.81))
    76535212-7;RODRIGO ANDRES;MENA CABALLERO;8763212323599;BRONZE;12311256;POLYGON ((-90.76 17.81, -90.74 17.81, -90.76 17.81))
   ```


## Capturas de pantalla
1. Home – Vista principal con las 3 opciones
![Home – Vista principal con las 3 opciones](/img/view-1.png)


2. Encriptar – Convertir un .txt a JSON o XML
![Encriptar `.txt` a JSON o XML](/img/view-2.png)


3. Switch – Conversión entre JSON y XML
![Conversión entre JSON y XML](/img/view-3.png)


4. Desencriptar – Recuperar .txt desde JSON o XML
![Desencriptar JSON/XML a `.txt`](/img/view-4.png)
