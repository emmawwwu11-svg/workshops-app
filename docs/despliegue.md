# Guía de Despliegue

## Requisitos previos

- Node.js 20+
- AWS CLI configurado
- CDK instalado (`npm install -g aws-cdk`)
- Cuenta AWS con permisos de administrador

## Clonar el repositorio

```bash
git clone https://github.com/emmawwwu11-svg/workshops-app.git
cd workshops-app
npm install

Desplegar entorno de desarrollo
cdk bootstrap
cdk deploy WorkshopsAppStack-Dev

Desplegar entorno de producción
cdk deploy WorkshopsAppStack-Prod
Desplegar frontend manualmente
El frontend se despliega automáticamente con CDK. Para actualizarlo manualmente:

bash
cd frontend
aws s3 sync . s3://workshops-frontend-311752057955 --exclude "node_modules/*"
aws cloudfront create-invalidation --distribution-id ECR42HY76E18W --paths "/*"
Configurar usuario administrador
bash
# Crear usuario
aws cognito-idp sign-up --client-id <CLIENT_ID> --username admin@ejemplo.com --password Admin123! --user-attributes Name=email,Value=admin@ejemplo.com

# Confirmar usuario
aws cognito-idp admin-confirm-sign-up --user-pool-id <USER_POOL_ID> --username admin@ejemplo.com

# Agregar al grupo admin
aws cognito-idp admin-add-user-to-group --user-pool-id <USER_POOL_ID> --username admin@ejemplo.com --group-name admin
Pipeline CI/CD
El repositorio incluye un workflow de GitHub Actions en .github/workflows/deploy.yml que:

Ejecuta pruebas al hacer push a dev

Despliega automáticamente en desarrollo

Requiere aprobación manual para producción (mediante tags)

Secrets necesarios en GitHub
Secret	Valor
AWS_ACCESS_KEY_ID	Access Key de AWS
AWS_SECRET_ACCESS_KEY	Secret Key de AWS
Comandos útiles
Comando	Descripción
cdk list	Lista los stacks disponibles
cdk diff	Muestra las diferencias antes de desplegar
cdk destroy	Elimina el stack y todos sus recursos
cdk synth	Genera la plantilla de CloudFormation