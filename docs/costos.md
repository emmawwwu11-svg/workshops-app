# Estimación de Costos Mensuales

## Servicios utilizados y costos estimados

| Servicio | Uso estimado | Costo mensual | Notas |
|----------|--------------|---------------|-------|
| **AWS Lambda** (7 funciones) | 1,000,000 solicitudes | $0.20 | 1M solicitudes/mes en us-east-1 |
| **API Gateway** | 1,000,000 llamadas | $3.50 | REST API, primer millón incluido parcialmente |
| **DynamoDB** | 25 GB almacenamiento | $0.00 | Free Tier: 25 GB |
| **S3 (frontend)** | 5 GB almacenamiento | $0.00 | Free Tier: 5 GB |
| **CloudFront** | 50 GB transferencia | $0.00 | Free Tier: 50 GB/mes |
| **Cognito** | 50 MAU | $0.00 | Free Tier: 50,000 MAU |
| **EventBridge** | 1,000,000 eventos | $1.00 | $1.00 por millón de eventos |
| **SNS** | 1,000 notificaciones | $0.50 | $0.50 por millón de notificaciones |
| **CloudWatch Logs** | 5 GB ingesta | $0.50 | $0.10 por GB |
| **X-Ray** | 100,000 trazas | $0.00 | Free Tier: 100,000 trazas/mes |
| **WAF** | No desplegado | $0.00 | Se evitó por costo ($5-10/mes) |

## Total estimado: ~$5.20 USD/mes

> **Nota:** Los costos pueden variar según la región y el uso real. Este cálculo asume us-east-1 y Free Tier aplicable.

---

## Cómo reducir costos aún más

| Estrategia | Ahorro estimado | Implementación |
|------------|----------------|----------------|
| **DynamoDB on-demand** | Hasta 50% | Ya está configurado (solo pagas por uso real) |
| **API Gateway throttling** | Evita picos | Configurar límite de 1000 req/seg |
| **Lambda memory tuning** | 20-30% | Reducir memoria a 128MB para funciones simples |
| **CloudFront Price Class** | 30-40% | Usar Price Class 100 (solo Norteamérica y Europa) |
| **Logs retention** | 10-20% | Configurar retención de logs a 30 días |
| **Compress responses** | 15-25% | Habilitar compresión en API Gateway y CloudFront |

### Comandos para optimizar costos

**Reducir memoria de Lambda (en CDK):**
```typescript
memorySize: 128  // En lugar de 256

Configurar retención de logs:

typescript
logRetention: logs.RetentionDays.ONE_MONTH
Configurar Price Class en CloudFront:

typescript
priceClass: cloudfront.PriceClass.PRICE_CLASS_100
Budget Alert (recomendado)
Se recomienda crear un budget alert en AWS Budgets que notifique por email cuando los costos superen los $10 USD al mes.

Crear desde CLI:

bash
aws budgets create-budget --account-id 311752057955 --budget file://budget.json --notifications-with-subscribers file://subscribers.json
O desde consola:

AWS Console → Budgets → Create budget

Tipo: Cost budget

Monto: $10 USD

Alertas: Email a tu correo

Free Tier resumen
Servicio	Free Tier límite
Lambda	1M solicitudes/mes
API Gateway	1M llamadas/mes
DynamoDB	25 GB almacenamiento
S3	5 GB almacenamiento
CloudFront	50 GB transferencia
Cognito	50,000 MAU
CloudWatch Logs	5 GB ingesta
X-Ray	100,000 trazas/mes
Este proyecto se mantiene dentro del Free Tier de AWS si el uso es moderado.








