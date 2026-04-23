Usuario → CloudFront → S3 (Frontend)
↓
API Gateway
↓
Lambda (List/Create/Get/Update/Delete/Register/Notification)
↓
DynamoDB

Cognito → Autenticación
EventBridge → Eventos
SNS → Notificaciones

text

## Decisiones técnicas

### ¿Por qué serverless?
- Escalabilidad automática sin administrar servidores
- Pago por uso (solo se cobra por ejecución)
- Menor costo operativo

### ¿Por qué DynamoDB single table?
- Permite consultas flexibles con GSIs
- Baja latencia para cargas impredecibles
- Escalado automático on-demand

### ¿Por qué CDK TypeScript?
- Infraestructura como código real
- Reutilización de lógica y tipos
- Mejor integración con el ecosistema AWS

## Seguridad implementada

- Cognito JWT Authorizer en API Gateway (rutas admin)
- IAM con privilegios mínimos para cada Lambda
- CORS configurado para el dominio de CloudFront
- Bucket S3 privado + Origin Access Control (OAC)
- WAF definido en código (rate limiting + SQLi/XSS)
- X-Ray activado para trazabilidad