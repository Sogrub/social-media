# stage 1: build nestjs

FROM node:21.7.0-bullseye-slim As build

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# stage 2: server

FROM node:21.7.0-bullseye-slim As server

# Configuración de la base de datos
ENV PORT=80
ENV HOST=*
ENV DATABASE_URL=mongodb+srv://social-media.idatdcu.mongodb.net/
ENV DATABASE_USER=administrator
ENV DATABASE_PASS=9hqKduyCoWPP3H4Z
ENV DATABASE_NAME=SocialMedia

# Llave Json Web token
ENV JWT_SECRET=THISFANTASTICPASSWORD

# Configuracion nodemailer 	
ENV MAIL_HOST='smtp.titan.email'
ENV MAIL_PORT=465
ENV MAIL_USERNAME='info@astraly.com.co'
ENV MAIL_PASSWORD='astra.ly@123'

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app ./usr/src

CMD [ "node", "usr/src/dist/main.js" ]
