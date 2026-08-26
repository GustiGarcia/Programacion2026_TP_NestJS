# Trabajo Práctico — NestJS + Patrones de Diseño

API REST desarrollada con **NestJS** y **TypeScript** para la gestión de productos, categorías y pedidos, aplicando patrones de diseño creacionales, estructurales y de comportamiento.

**Materia:** Programación 3 — 2026
**Autor:** Gustavo García/ Nahuel Ghilardi
**Repositorio:** https://github.com/GustiGarcia/Programacion2026_TP_NestJS

---

## Objetivo

Desarrollar una API REST que aplique los conceptos fundamentales de NestJS (módulos, controladores, servicios, inyección de dependencias, DTOs y validaciones) e integrar dentro de ella tres patrones de diseño resolviendo problemas concretos de la aplicación, no como ejercicios aislados.

Patrones implementados:

| Categoría | Patrón | Aplicación en el proyecto |
|---|---|---|
| Creacional | **Factory Method** | Creación de distintos tipos de producto (físico, digital, servicio) |
| Estructural | **Adapter** | Integración con un servicio externo de pagos |
| Comportamiento | **Strategy** | Cálculo de descuentos sobre los pedidos |

---

## Requisitos previos

- Node.js 18 o superior
- npm
- NestJS CLI (opcional, para generar código)

```bash
npm i -g @nestjs/cli
```

## Instalación

```bash
git clone https://github.com/GustiGarcia/Programacion2026_TP_NestJS.git
cd Programacion2026_TP_NestJS
npm install
```

## Ejecución

```bash
npm run start:dev     # modo desarrollo con recarga automática
npm run start         # modo normal
npm run build         # compilar a /dist
npm run start:prod    # ejecutar la versión compilada
```

La API queda disponible en `http://localhost:3000`.

## Tests

```bash
npm run test
npm run test:cov
```

---

## Estructura del proyecto

```
src/
├── main.ts                          # Bootstrap + ValidationPipe global
├── app.module.ts                    # Módulo raíz
│
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── factories/                   # ── Patrón Factory Method
│   │   ├── product.factory.ts
│   │   ├── physical-product.ts
│   │   ├── digital-product.ts
│   │   └── service-product.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
│
├── categories/
│   ├── dto/
│   ├── entities/
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
│
└── orders/
    ├── dto/
    ├── entities/
    ├── strategies/                  # ── Patrón Strategy
    │   ├── discount.strategy.ts
    │   ├── no-discount.strategy.ts
    │   ├── student-discount.strategy.ts
    │   └── premium-discount.strategy.ts
    ├── payment/                     # ── Patrón Adapter
    │   ├── payment.service.ts
    │   ├── payment.adapter.ts
    │   └── external-payment.service.ts
    ├── orders.controller.ts
    ├── orders.service.ts
    └── orders.module.ts
```

El almacenamiento es **en memoria** (arrays dentro de cada service). La lógica de negocio reside en los services; los controllers solo reciben la petición, delegan y devuelven la respuesta.

---

## Endpoints disponibles

### Products

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/products` | Lista todos los productos |
| GET | `/products?minPrice=&maxPrice=` | Filtra por rango de precio |
| GET | `/products/search?name=` | Busca por nombre |
| GET | `/products/category/:categoryId` | Filtra por categoría |
| GET | `/products/:id` | Obtiene un producto |
| POST | `/products` | Crea un producto |
| PUT | `/products/:id` | Actualiza un producto |
| DELETE | `/products/:id` | Elimina un producto |

> **Nota sobre el orden de las rutas:** en el controller, `@Get('search')` y `@Get('category/:categoryId')` se declaran **antes** que `@Get(':id')`. NestJS resuelve las rutas en orden de declaración, y `:id` capturaría el literal `search` si estuviera primero.

### Categories

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/categories` | Lista todas las categorías |
| GET | `/categories/:id` | Obtiene una categoría |
| POST | `/categories` | Crea una categoría |
| PUT | `/categories/:id` | Actualiza una categoría |
| DELETE | `/categories/:id` | Elimina una categoría |

### Orders

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/orders` | Lista todos los pedidos |
| GET | `/orders/:id` | Obtiene un pedido |
| POST | `/orders` | Crea y procesa un pedido |
| PUT | `/orders/:id` | Actualiza un pedido |
| DELETE | `/orders/:id` | Elimina un pedido |

---

## Modelo de datos

**Product**

| Campo | Tipo | Validación |
|---|---|---|
| `id` | number | Generado automáticamente |
| `name` | string | Obligatorio, no vacío |
| `description` | string | Opcional |
| `price` | number | Obligatorio, mayor que 0 |
| `stock` | number | Obligatorio, mayor o igual a 0 |
| `categoryId` | number | Obligatorio |
| `type` | string | `physical` \| `digital` \| `service` |

**Category**

| Campo | Tipo | Validación |
|---|---|---|
| `id` | number | Generado automáticamente |
| `name` | string | Obligatorio, no vacío |
| `description` | string | Opcional |

**Order**

| Campo | Tipo | Validación |
|---|---|---|
| `id` | number | Generado automáticamente |
| `items` | OrderItem[] | Obligatorio, al menos un ítem |
| `customerType` | string | Determina la estrategia de descuento |
| `total` | number | Calculado por el servicio |
| `status` | string | `pending` \| `paid` \| `cancelled` |

Las validaciones se aplican mediante DTOs y decoradores de `class-validator`, activados globalmente en `main.ts`:

```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

`whitelist: true` descarta cualquier propiedad que no esté declarada en el DTO, evitando que lleguen campos no previstos al service.

---

## Ejemplos de uso

### Crear una categoría

```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{ "name": "Electrónica", "description": "Dispositivos y accesorios" }'
```

```json
{ "id": 1, "name": "Electrónica", "description": "Dispositivos y accesorios" }
```

### Crear un producto

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Notebook",
        "description": "14 pulgadas, 16GB RAM",
        "price": 850000,
        "stock": 5,
        "categoryId": 1,
        "type": "physical"
      }'
```

### Validación fallida

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{ "name": "", "price": -100, "stock": -1 }'
```

```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "price must be a positive number",
    "stock must not be less than 0",
    "categoryId should not be empty"
  ],
  "error": "Bad Request"
}
```

### Buscar y filtrar

```bash
curl "http://localhost:3000/products/search?name=note"
curl "http://localhost:3000/products?minPrice=100000&maxPrice=900000"
curl "http://localhost:3000/products/category/1"
```

### Crear un pedido

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
        "customerType": "student",
        "items": [{ "productId": 1, "quantity": 2 }]
      }'
```

```json
{
  "id": 1,
  "items": [{ "productId": 1, "quantity": 2, "unitPrice": 850000 }],
  "subtotal": 1700000,
  "discount": 170000,
  "total": 1530000,
  "status": "paid"
}
```

---

## Patrones implementados

### 1. Factory Method (creacional)

**Ubicación:** `src/products/factories/`

```
ProductFactory.create(type, data)
      │
      ├── PhysicalProduct    (requiere peso y dirección de envío)
      ├── DigitalProduct     (requiere URL de descarga, sin stock físico)
      └── ServiceProduct     (requiere duración, sin stock)
```

**¿Qué problema de creación resuelve?**
El catálogo maneja productos que comparten los mismos campos base pero se construyen y comportan de forma distinta: un producto digital no descuenta stock físico, un servicio no tiene envío. Sin el patrón, `ProductsService` tendría que conocer cada clase concreta y decidir con una cadena de `if/else` cuál instanciar, mezclando la lógica de creación con la lógica del catálogo.

**¿Por qué este patrón?**
Factory Method centraliza la decisión de *qué* instanciar en un único punto. El service pide un producto por su tipo y recibe una instancia ya válida, sin importarle la clase concreta detrás.

**Ventajas frente a instanciar directamente:**

- El service depende de la abstracción `Product`, no de las clases concretas (inversión de dependencias).
- Agregar un cuarto tipo de producto significa crear una clase nueva y registrarla en la factory: el service no se toca (principio abierto/cerrado).
- Las reglas de construcción y los valores por defecto de cada tipo quedan en un solo lugar y no se duplican por el código.

**Dónde está implementado:**
`ProductFactory` es un provider inyectado en `ProductsService`. Se invoca en el método `create()` del service, a partir del campo `type` recibido en el DTO.

---

### 2. Adapter (estructural)

**Ubicación:** `src/orders/payment/`

```
OrdersService
      │
      ▼
PaymentService            (interfaz que la aplicación espera)
      │
      ▼
PaymentAdapter            (traduce entre ambos contratos)
      │
      ▼
ExternalPaymentService    (API externa, contrato ajeno)
```

**¿Qué problema estructural resuelve?**
El servicio externo de pagos expone una interfaz que no coincide con la que la aplicación necesita: usa otros nombres de método, espera los montos en centavos y devuelve una respuesta con una forma distinta. Acoplar `OrdersService` directamente a esa API haría que cualquier cambio del proveedor —o un cambio de proveedor— obligue a modificar la lógica de pedidos.

**¿Por qué es necesario un Adapter?**
Porque no se puede (ni conviene) modificar el servicio externo. El Adapter actúa como capa de traducción: implementa la interfaz que la aplicación define y, por dentro, convierte esa llamada al formato que el proveedor entiende.

**Componentes que participan:**

| Componente | Rol |
|---|---|
| `OrdersService` | Cliente — solo conoce la interfaz `PaymentService` |
| `PaymentService` | Target — interfaz que define la aplicación |
| `PaymentAdapter` | Adapter — implementa `PaymentService` y traduce |
| `ExternalPaymentService` | Adaptee — servicio externo con su propio contrato |

**Ventajas:**

- `OrdersService` no conoce al proveedor de pagos: se puede reemplazar cambiando únicamente el adapter.
- Se pueden tener varios adapters (por ejemplo uno de prueba) y elegir cuál inyectar, lo que facilita testear pedidos sin llamar a un servicio real.
- Las conversiones de formato quedan aisladas en un único archivo en lugar de dispersas por la lógica de negocio.

---

### 3. Strategy (comportamiento)

**Ubicación:** `src/orders/strategies/`

```
DiscountStrategy  (interfaz: calculate(order): number)
       │
       ├── NoDiscountStrategy         →  0%
       ├── StudentDiscountStrategy    → 10%
       ├── PremiumDiscountStrategy    → 15%
       └── BlackFridayStrategy        → 25%
```

**¿Qué comportamiento se encapsula?**
El cálculo del descuento aplicable a un pedido. Cada tipo de cliente o campaña usa una fórmula distinta, y esas fórmulas cambian con el tiempo de forma independiente entre sí.

**¿Por qué Strategy?**
Porque hay varios algoritmos intercambiables que resuelven lo mismo y la elección se hace en tiempo de ejecución, según los datos del pedido. Strategy permite que cada algoritmo viva en su propia clase y que el service elija cuál usar sin conocer su implementación:

```ts
const strategy = this.discountResolver.resolve(order.customerType);
const discount = strategy.calculate(order);
```

**Ventajas frente a múltiples `if/else`:**

- Sin Strategy, `OrdersService` acumularía una cadena de condicionales que crece con cada tipo de descuento y mezcla todas las fórmulas en un mismo método.
- Cada estrategia se puede testear de forma aislada.
- Se elimina la duplicación: la lógica común de cálculo del total queda en el service y solo varía el porcentaje aplicado.

**¿Cómo agregar una nueva estrategia sin modificar el código existente?**
Creando una clase que implemente `DiscountStrategy` y registrándola en el módulo. El `OrdersService` no cambia, porque depende de la interfaz y no de las implementaciones concretas — esto es el principio abierto/cerrado aplicado en la práctica.

---

## Integración de los patrones con la API

Los tres patrones no son ejercicios aislados: intervienen dentro del flujo real de una petición HTTP.

```
HTTP Request
     │
     ▼
Controller            (recibe @Param / @Body, valida vía DTO)
     │
     ▼
Service               (lógica de negocio)
     │
     ├─────────────────┬─────────────────┐
     ▼                 ▼                 ▼
 ProductFactory   DiscountStrategy   PaymentAdapter
     │                 │                 │
     ▼                 ▼                 ▼
  Product          Descuento      ExternalPaymentService
```

**Flujo de creación de un producto:**
`POST /products` → `ProductsController` valida el `CreateProductDto` → `ProductsService.create()` → `ProductFactory.create(type, data)` devuelve la instancia concreta → se guarda en el repositorio en memoria.

**Flujo de creación de un pedido:**
`POST /orders` → `OrdersController` valida el `CreateOrderDto` → `OrdersService.create()` calcula el subtotal → resuelve la `DiscountStrategy` según el tipo de cliente y obtiene el descuento → invoca `PaymentService`, implementado por `PaymentAdapter`, que traduce la llamada al proveedor externo → devuelve el pedido con su estado actualizado.

---

## Evidencias de funcionamiento

Las pruebas de los endpoints se documentan en la carpeta `docs/`:

- Colección de Postman/Thunder Client exportada
- Capturas de las peticiones y sus respuestas

Los ejemplos con `cURL` de la sección *Ejemplos de uso* son reproducibles directamente contra la aplicación en ejecución.

---

## Posibles extensiones

- Persistencia real con PostgreSQL o MongoDB mediante TypeORM o Prisma
- Documentación automática con Swagger/OpenAPI
- Chain of Responsibility para encadenar las validaciones de un pedido (stock → precio → usuario → pago)
- Tests unitarios de services, factories y estrategias
- Contenerización con Docker
- Autenticación y autorización con JWT
