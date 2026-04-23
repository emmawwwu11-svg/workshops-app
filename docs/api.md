# API Documentation

## Base URL
**Desarrollo:** `https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev/`

## Endpoints

### GET /workshops (Público)
Lista todos los talleres.

### POST /workshops (Admin)
Crea un nuevo taller. Requiere token Cognito.

### GET /workshops/{id} (Público)
Obtiene un taller por ID.

### PUT /workshops/{id} (Admin)
Actualiza un taller.

### DELETE /workshops/{id} (Admin)
Elimina un taller.

### POST /workshops/{id}/register (Usuario autenticado)
Registra un estudiante a un taller.

## Códigos de error
| Código | Significado |
|--------|-------------|
| 401 | No autenticado |
| 403 | No autorizado |
| 404 | No encontrado |