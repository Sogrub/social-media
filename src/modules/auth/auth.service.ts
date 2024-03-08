import { Injectable } from '@nestjs/common';
import { IRequestResponse } from 'src/shared/models/general.models';
import { RegisterDto } from './dto/register.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BycriptService } from '../../shared/services/bycript/bycript.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import { MailsenderService } from 'src/shared/services/mailsender/mailsender.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private bycriptService: BycriptService,
    private jwtService: JwtService,
    private mailsenderService: MailsenderService
  ) {}

  async register(register: RegisterDto): Promise<IRequestResponse> {
    const newRegister = {...register};
    const userExist = await this.UserModel.findOne({ email: newRegister.email })

    if (userExist) {
      if (userExist.deletedAt) {
        return this.UserModel.findByIdAndUpdate(userExist._id, { $unset: { deletedAt: '' } }).then(res => {
          return {
            status: 200,
            message: 'El usuario ha sido reactivado',
            data: res
          } as IRequestResponse
        }).catch((err) => {
          return {
            status: 500,
            message: 'ha ocurrido un error',
            errors: err
          } as IRequestResponse
        })
      }
      return {
        status: 404,
        message: 'El email ya se encuentra registrado'
      }
    }

    newRegister.password = await this.bycriptService.encryptPassword(newRegister.password)

    return this.UserModel.create(newRegister).then(res => {
      this.sendWelcomeEmail(newRegister.email)
      return {
        status: 200,
        message: 'Usuario registrado exitosamente'
      } as IRequestResponse
    }).catch((err) => {
      return {
        status: 500,
        message: 'Ha ocurrido un error',
        errors: err
      }
    })
  }

  async login(login: LoginDto): Promise<IRequestResponse> {
    const newLogin = {...login}
    try {
      const userExist = await this.UserModel.findOne({ email: newLogin.email, deletedAt: { $exists: false } })
      if (!userExist) {
        return {
          status: 404,
          message: 'El usuario no se encuentra registrado o ha sido eliminado',
        }
      } 
      
      const passwordValidate = await this.bycriptService.comparePassword(newLogin.password, userExist.password);

      if (!passwordValidate) {
        return {
          status: 403,
          message: 'La contraseña no coincide con la registrada en el sistema',
        }
      }

      const token = this.jwtService.singin({ sub: String(userExist._id), expirateNumber: 2, expirateTime: 'hours' })

      return {
        status: 200,
        message: 'Usuario autenticado con exito',
        data: token
      }
      
    } catch (err) {
      return {
          status: 500,
          message: 'Ha ocurrido un error',
          errors: err
        }
    }
  }

  async sendWelcomeEmail(to: string) {
    const config = {
      from: 'Social Media<info@astraly.com.co>',
      to,
      subject: 'Bienvenido a Social Media'
    }
    await this.mailsenderService.sendMail(config)
  }
}