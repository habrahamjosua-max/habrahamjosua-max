   Rifas Toluca - Proyecto completo (local)

   Estructura:

   - server/: backend Node/Express
   - public/: frontend estático

   Pasos para ejecutar localmente:

   1. En la carpeta server/ ejecutar:
      npm install
   2. Crear archivo server/.env copiando .env.example y completando las variables.
   3. Levantar servidor:
      npm run dev
   4. Servir public/ en http://localhost:3000 (por ejemplo usando 'npx serve public' o configurar nginx)

   Notas:
- Debes configurar Stripe, MongoDB Atlas y Twilio (WhatsApp sandbox) para que todo funcione.
- Para webhooks de Stripe usa 'stripe listen --forward-to localhost:4242/webhook'
