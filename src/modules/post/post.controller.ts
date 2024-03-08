import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PostDto } from './dto/post.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { IRequestResponse } from 'src/shared/models/general.models';
import { UpdatePostDto } from './dto/updatePost.dto';

@ApiTags('Post')
@ApiBearerAuth('defaultBearerAuth')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiResponse({ status: 200, description: 'Post consultados exitosamente.' })
  @ApiResponse({ status: 401, description: 'El token se encuentra vencido o es invalido.' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Buscar Posts' })
  @ApiQuery({ required: false, name: 'page' })
  @ApiQuery({ required: false, name: 'limit' })
  @ApiQuery({ required: false, name: 'filter' })
  @Get()
  async findAll(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Res() res: Response,
    @Query('filter') filter?: string
    ) {
    const response = await this.postService.findAll(page, limit, filter);
    return res.status(response.status).send(response);
  }

  @ApiResponse({ status: 200, description: 'El post ha sido creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Los campos solicitados no se encuentran o no son el tipo correcto.' })
  @ApiResponse({ status: 401, description: 'El token se encuentra vencido o es invalido.' })
  @ApiResponse({ status: 403, description: 'El post no ha sido creado.' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Crear Posts' })
  @Post()
  async create(@Body() postDto: PostDto, @Req() req: Request, @Res() res: Response) {
    const errors = await validate(plainToClass(PostDto, postDto));

    if (errors.length) {
      return res.status(400).send({
        status: 400,
        message: 'Los campos solicitados no se encuentran o no son el tipo correcto.',
        errors: errors
      } as IRequestResponse)
    }

    const userId = req['payload'].sub

    const response = await this.postService.create(userId, postDto)
    return res.status(response.status).send(response);
  }

  @ApiResponse({ status: 200, description: 'El post ha sido actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Los campos solicitados no se encuentran o no son el tipo correcto.' })
  @ApiResponse({ status: 400, description: 'El parametro "id" es requerido.' })
  @ApiResponse({ status: 401, description: 'Este usuario no esta autorizado para editar el post.' })
  @ApiResponse({ status: 401, description: 'El token se encuentra vencido o es invalido.' })
  @ApiResponse({ status: 404, description: 'Post no encontrado.' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Actualizar Posts' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request, @Res() res: Response) {
    const errors = await validate(plainToClass(UpdatePostDto, updatePostDto));

    if (!id) {
      return res.status(400).send({
        status: 400,
        message: 'El parametro "id" es requerido.'
      } as IRequestResponse)
    }

    if (errors.length) {
      return res.status(400).send({
        status: 400,
        message: 'Los campos solicitados no se encuentran o no son el tipo correcto.',
        errors: errors
      } as IRequestResponse)
    }

    const userId = req['payload'].sub

    const response = await this.postService.update(id, userId, updatePostDto)
    return res.status(response.status).send(response);
  }

  @ApiResponse({ status: 200, description: 'El post ha sido eliminado exitosamente.' })
  @ApiResponse({ status: 400, description: 'El parametro "id" es requerido.' })
  @ApiResponse({ status: 401, description: 'Este usuario no esta autorizado para editar el post.' })
  @ApiResponse({ status: 401, description: 'El token se encuentra vencido o es invalido.' })
  @ApiResponse({ status: 404, description: 'Post no encontrado.' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Borrar Posts' })
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    if (!id) {
      return res.status(400).send({
        status: 400,
        message: 'El parametro "id" es requerido.'
      } as IRequestResponse)
    }

    const userId = req['payload'].sub

    const response = await this.postService.delete(id, userId)
    return res.status(response.status).send(response);
  }

  @ApiResponse({ status: 200, description: 'Se ha sumado el like exitosamente.' })
  @ApiResponse({ status: 400, description: 'El parametro "id" es requerido.' })
  @ApiResponse({ status: 401, description: 'El token se encuentra vencido o es invalido.' })
  @ApiResponse({ status: 404, description: 'Post no encontrado.' })
  @ApiResponse({ status: 500, description: 'Ha ocurrido un error' })
  @ApiOperation({summary: 'Añadir Likes' })
  @Put(':id')
  async addLikes(@Param('id') id: string, @Res() res: Response) {
    if (!id) {
      return res.status(400).send({
        status: 400,
        message: 'El parametro "id" es requerido.'
      } as IRequestResponse)
    }

    const response = await this.postService.addLikes(id)
    return res.status(response.status).send(response);
  }
}
