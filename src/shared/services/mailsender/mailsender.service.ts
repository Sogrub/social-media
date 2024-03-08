import { Injectable } from '@nestjs/common';
import { IConfigurationEmail, IRequestResponse } from 'src/shared/models/general.models';
import * as nodeMailer from 'nodemailer';

const WELCOME_TEMPLATE = `<body style="background-color: #efefef; margin: 0; padding: 0">
<table
  style="
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    border-spacing: 0;
  "
>
  <tbody>
    <tr style="background-color: #555659; height: 1rem">
      <td></td>
    </tr>
    <tr>
      <td align="left" style="padding: 0.5rem 2rem">
        <img
          src="https://tlr.stripocdn.email/content/guids/CABINET_e68c7d7750e454d4c8741683ab86e3ad/images/59971502362007821.png"
          alt="Welcome!"
          title="Welcome!"
          width="200"
        />
      </td>
    </tr>
    <tr style="background-color: #555659; height: 1rem">
      <td></td>
    </tr>
    <tr>
      <td style="padding: 0.5rem 2rem">
        <h2 style="margin: 0; padding: 0; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
            Estamos muy agradecidos de que te hayas unido a nosotros.
        </h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 0.5rem 2rem">
        <p style="margin: 0; padding: 0; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
          ¡Bienvenido a nuestra comunidad! Conéctate, comparte y descubre
          con amigos en nuestra red social. Explora nuevas conexiones,
          comparte momentos especiales y haz que cada día sea memorable.
          ¡Empecemos juntos esta emocionante travesía social! 🌟 #Bienvenido
          #Conéctate #Comparte
        </p>
      </td>
    </tr>
    <tr style="background-color: #555659; height: 1rem">
        <td></td>
      </tr>
  </tbody>
</table>
</body>`

@Injectable()
export class MailsenderService {
  constructor() {}

  async sendMail(configurationEmail: IConfigurationEmail) {
    const newConfiguration = {...configurationEmail}
    newConfiguration.html = WELCOME_TEMPLATE

    const transporter = nodeMailer.createTransport({ 
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      },
      secure: true,
    });

    return await transporter.sendMail(newConfiguration)
      .then(() => {
        return { 
          status: 200,
          message: 'Correo Enviado',
          data: null
        } as IRequestResponse
      })
      .catch((error) => {
        console.log('Email Error', error)
        return { 
          status: 500,
          message: 'A ocurrido un error al enviar el correo',
          error: error
        } as IRequestResponse
      });
  }
}
