# API Documentation

## Base URL
**Desarrollo:** `https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev/`

---

## Endpoints

### 1. GET /workshops (Público)
Lista todos los talleres disponibles.

**Ejemplo de petición:**
```bash
curl -X GET https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev/workshops/

Respuesta exitosa (200):

{
  "workshops": [
    {
      "PK": "WORKSHOP#1776821938132",
      "name": "Taller de AWS",
      "description": "Aprende AWS desde cero",
      "category": "Cloud",
      "location": "Online",
      "startAt": "2026-06-01T10:00:00Z",
      "endAt": "2026-06-01T18:00:00Z",
      "capacity": 50,
      "status": "scheduled"
    }
  ],
  "count": 1
}

2. POST /workshops (Admin)
Crea un nuevo taller. Requiere token Cognito con grupo 'admin'.

Headers:

Authorization: Bearer <token>

Content-Type: application/json

Ejemplo de petición:
curl -X POST https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev/workshops/ \
  -H "Authorization: Bearer eyJraWQiOi..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Taller de AWS",
    "description": "Aprende AWS desde cero",
    "category": "Cloud",
    "location": "Online",
    "startAt": "2026-06-01T10:00:00Z",
    "endAt": "2026-06-01T18:00:00Z",
    "capacity": 50
  }'
  Respuesta exitosa (201):

json
{
  "message": "Taller creado exitosamente",
  "workshopId": "WORKSHOP#1776821938132"
}
3. GET /workshops/{id} (Público)
Obtiene los detalles de un taller específico.

Ejemplo de petición:

bash
curl -X GET https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev/workshops/1776821938132
Respuesta exitosa (200):

json
{
  "PK": "WORKSHOP#1776821938132",
  "name": "Taller de AWS",
  "description": "Aprende AWS desde cero",
  "category": "Cloud",
  "location": "Online",
  "startAt": "2026-06-01T10:00:00Z",
  "endAt": "2026-06-01T18:00:00Z",
  "capacity": 50,
  "status": "scheduled"
}
4. PUT /workshops/{id} (Admin)
Actualiza un taller existente. Requiere token Cognito con grupo 'admin'.

Ejemplo de petición:

bash
curl -X PUT https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev/workshops/1776821938132 \
  -H "Authorization: Bearer eyJraWQiOi..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Taller de AWS Actualizado",
    "capacity": 60
  }'
Respuesta exitosa (200):

json
{
  "message": "Taller actualizado",
  "workshop": {
    "name": "Taller de AWS Actualizado",
    "capacity": 60
  }
}
5. DELETE /workshops/{id} (Admin)
Elimina un taller. Requiere token Cognito con grupo 'admin'.

Ejemplo de petición:

bash
curl -X DELETE https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev/workshops/1776821938132 \
  -H "Authorization: Bearer eyJraWQiOi..."
Respuesta exitosa (200):

json
{
  "message": "Taller eliminado exitosamente",
  "workshopId": "1776821938132"
}
6. POST /workshops/{id}/register (Usuario autenticado)
Registra un estudiante a un taller. Es idempotente (no permite duplicados).

Ejemplo de petición:

bash
curl -X POST https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev/workshops/1776821938132/register \
  -H "Authorization: Bearer eyJraWQiOi..."
Respuesta exitosa (201):

json
{
  "message": "Registro exitoso",
  "workshopId": "1776821938132",
  "workshopName": "Taller de AWS"
}
Códigos de error
Código	Significado
400	Solicitud incorrecta (ej: taller completo o ya registrado)
401	No autenticado (token inválido o expirado)
403	No autorizado (no tienes permisos de admin)
404	Recurso no encontrado (taller no existe)
500	Error interno del servidor




