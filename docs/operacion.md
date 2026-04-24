# Operación y Monitoreo

## CloudWatch Logs

Los logs de cada Lambda están disponibles en CloudWatch. Los grupos de logs más importantes son:

- `/aws/lambda/WorkshopsAppStack-Dev-ListWorkshopsFn`
- `/aws/lambda/WorkshopsAppStack-Dev-CreateWorkshopFn`
- `/aws/lambda/WorkshopsAppStack-Dev-GetWorkshopFn`
- `/aws/lambda/WorkshopsAppStack-Dev-UpdateWorkshopFn`
- `/aws/lambda/WorkshopsAppStack-Dev-DeleteWorkshopFn`
- `/aws/lambda/WorkshopsAppStack-Dev-RegisterStudentFn`
- `/aws/lambda/WorkshopsAppStack-Dev-NotificationFn`

**Para ver los logs desde CLI:**

```bash
aws logs tail /aws/lambda/WorkshopsAppStack-Dev-RegisterStudentFn --since 1h

Alarmas recomendadas (CloudWatch Alarms)
Alarma	Condición	Acción
API 5XX errors	>5 errores en 5 minutos	Notificar al equipo por SNS
Lambda duration	>5 segundos	Revisar código y optimizar
Lambda errors	>10 errores en 5 minutos	Revisar logs y corregir
DynamoDB throttles	>10 throttles	Aumentar capacidad o revisar consultas
Crear alarma desde CLI (ejemplo):

bash
aws cloudwatch put-metric-alarm --alarm-name api-5xx-errors \
  --alarm-description "Alarma cuando hay más de 5 errores 5XX" \
  --metric-name 5XXError --namespace AWS/ApiGateway \
  --statistic Sum --period 300 --evaluation-periods 2 \
  --threshold 5 --comparison-operator GreaterThanThreshold
Backup y Restore de DynamoDB
Backup manual
bash
aws dynamodb create-backup --table-name workshops-dev --backup-name workshops-backup-$(date +%Y%m%d)
Listar backups
bash
aws dynamodb list-backups --table-name workshops-dev
Restaurar backup
bash
aws dynamodb restore-table-from-backup --target-table-name workshops-dev-restored --backup-arn <ARN_DEL_BACKUP>
Point-in-Time Recovery (PITR)
La tabla workshops-dev tiene PITR activado, permitiendo restaurar a cualquier punto en los últimos 35 días.

bash
aws dynamodb restore-table-to-point-in-time \
  --source-table-name workshops-dev \
  --target-table-name workshops-dev-pitr-restore \
  --use-latest-restorable-time
Runbook para incidentes comunes
1. Error 500 en API Gateway
Verificar logs de Lambda en CloudWatch

bash
aws logs tail /aws/lambda/WorkshopsAppStack-Dev-CreateWorkshopFn --since 30m
Revisar si hay errores de DynamoDB (capacidad insuficiente)

Verificar X-Ray para identificar cuello de botella

Si el error persiste, revisar las políticas IAM de la Lambda

2. Usuarios no pueden autenticarse
Verificar que el usuario esté confirmado en Cognito

bash
aws cognito-idp admin-get-user --user-pool-id <USER_POOL_ID> --username usuario@ejemplo.com
Verificar que pertenezca al grupo 'admin' si necesita permisos

Revisar que el Client ID sea correcto

Verificar que el token no haya expirado

3. Frontend no carga talleres
Verificar que la API está respondiendo

bash
curl -X GET https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev/workshops/
Verificar CloudFront invalidation

Revisar que el bucket S3 tiene los archivos correctos

Verificar la política CORS en API Gateway

4. Notificaciones no llegan por email
Verificar que la suscripción SNS está confirmada

Revisar logs de la Lambda NotificationFn

Verificar que el tópico SNS tiene permisos correctos

Enlaces útiles
CloudWatch Console

X-Ray Traces

DynamoDB Backups

AWS Health Dashboard