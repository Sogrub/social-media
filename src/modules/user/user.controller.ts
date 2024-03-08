import { Body, Controller, Delete, Get, Param, Patch, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { IRequestResponse } from 'src/shared/models/general.models';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/user.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@ApiTags('User')
@ApiBearerAuth('defaultBearerAuth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  @ApiResponse({ status: 200, description: 'Usuario encontrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'El parametro "id" es requerido.' })
  @ApiResponse({ status: 401, description: 'El token se encuentra vencido o es invalido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Consultar Usuario' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    if (!id) {
      return res.status(400).send({
        status: 400,
        message: 'El parametro "id" es requerido.'
      } as IRequestResponse)
    }

    const response = await this.userService.findOne(id);
    return res.status(response.status).send(response);
  }

  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'El parametro "id" es requerido.' })
  @ApiResponse({ status: 400, description: 'Los campos solicitados no se encuentran o no son el tipo correcto.' })
  @ApiResponse({ status: 401, description: 'El token se encuentra vencido o es invalido.' })
  @ApiResponse({ status: 403, description: 'No se ha podido actualizar el usuario.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Actualizar Usuario' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() userDto: UpdateUserDto, @Res() res: Response) {
    if (!id) {
      return res.status(400).send({
        status: 400,
        message: 'El parametro "id" es requerido.'
      } as IRequestResponse)
    }

    const errors = await validate(plainToClass(UpdateUserDto, userDto));

    if (errors.length) {
      return res.status(400).send({
        status: 400,
        message: 'Los campos solicitados no se encuentran o no son el tipo correcto.',
        errors: errors
      } as IRequestResponse)
    }

    const response = await this.userService.update(id, userDto)
    return res.status(response.status).send(response);
  }

  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 400, description: 'El parametro "id" es requerido.' })
  @ApiResponse({ status: 401, description: 'El token se encuentra vencido o es invalido.' })
  @ApiResponse({ status: 403, description: 'No se ha podido eliminar al usuario.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Eliminar Usuario' })
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    if (!id) {
      return res.status(400).send({
        status: 400,
        message: 'El parametro "id" es requerido.'
      } as IRequestResponse)
    }

    const response = await this.userService.delete(id)
    return res.status(response.status).send(response);
  }
}
