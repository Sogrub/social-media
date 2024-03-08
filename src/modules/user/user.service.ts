import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IRequestResponse } from 'src/shared/models/general.models';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>
  ){}

  async findOne(id: string): Promise<IRequestResponse>{
    return this.UserModel.findById(id).then((res) => {
      if (!res) {
        return {
          status: 404,
          message: 'Usuario no encontrado'
        } as IRequestResponse
      }

      return {
        status: 200,
        message: 'Usuario encontrado exitosamente',
        data: res
      } as IRequestResponse
    }).catch((err) => {
      return {
        status: 500,
        message: "Ha ocurrido un error",
        errors: err,
      } as IRequestResponse;
    })
  }

  async update(id: string, user: UpdateUserDto): Promise<IRequestResponse>{
    const newEditUser = {...user, updatedAt: new Date()}
    try {
      const editUser = await this.UserModel.findById(id)
      if (!editUser) {
        return {
          status: 404,
          message: 'Usuario no encontrado'
        } as IRequestResponse
      }
      
      return this.UserModel.findByIdAndUpdate(id, newEditUser).then(res => {
        return {
          status: 200,
          message: 'Usuario actualizado exitosamente',
          data: res
        } as IRequestResponse
      }).catch((err) => {
        return {
          status: 403,
          message: 'No se ha podido actualizar el usuario',
          errors: err
        } as IRequestResponse
      })
      
    } catch (err) {
      return {
        status: 500,
        message: "Ha ocurrido un error",
        errors: err
      } as IRequestResponse
    }
  }

  async delete(id: string): Promise<IRequestResponse> {
    try {
      const deleteUser = await this.UserModel.findById(id)
      if (!deleteUser) {
        return {
          status: 404,
          message: 'Usuario no encontrado'
        } as IRequestResponse
      }

      return this.UserModel.findByIdAndUpdate(id, { deletedAt: new Date() }).then(res => {
        return {
          status: 200,
          message: 'Usuario eliminado exitosamente',
          data: res
        } as IRequestResponse
      }).catch((err) => {
        return {
          status: 403,
          message: 'No se ha podido eliminar al usuario',
          errors: err
        } as IRequestResponse
      })
      
    } catch (err) {
      return {
        status: 500,
        message: "Ha ocurrido un error",
        errors: err
      } as IRequestResponse
    }
  }
}