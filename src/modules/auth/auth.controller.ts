import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
import { IRequestResponse } from 'src/shared/models/general.models';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 200, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Los campos solicitados no se encuentran o no son el tipo correcto.' })
  @ApiResponse({ status: 404, description: 'El email ya se encuentra registrado' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Registrar Usuario' })
  @Post('user-register')
  async userRegister(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const errors = await validate(plainToClass(RegisterDto, registerDto));

    if (errors.length) {
      return res.status(400).send({
        status: 400,
        message: "Los campos solicitados no se encuentran o no son el tipo correcto.",
        errors
      } as IRequestResponse); 
    }

    const response = await this.authService.register(registerDto);
    return res.status(response.status).send(response);
  } 

  @ApiResponse({ status: 200, description: 'Usuario autenticado con exito' })
  @ApiResponse({ status: 200, description: 'El usuario ha sido reactivado' })
  @ApiResponse({ status: 400, description: 'Los campos solicitados no se encuentran o no son el tipo correcto.' })
  @ApiResponse({ status: 403, description: 'La contraseña no coincide con la registrada en el sistema' })
  @ApiResponse({ status: 404, description: 'El usuario no se encuentra registrado o ha sido eliminado' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Login y Obtener Token' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const errors = await validate(plainToClass(LoginDto, loginDto));

    if (errors.length) {
      return res.status(400).send({
        status: 400,
        message: 'Los campos solicitados no se encuentran o no son el tipo correcto.',
        errors
      } as IRequestResponse);
    }

    const response = await this.authService.login(loginDto);
    return res.status(response.status).send(response);
  }
}
