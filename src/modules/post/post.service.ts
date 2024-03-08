import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';
import { PostDto } from './dto/post.dto';
import { IRequestResponse } from 'src/shared/models/general.models';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>
  ) {}

  async create(userId: string, post: PostDto): Promise<IRequestResponse> {
    const newPost = {...post, userId}
    
    return this.PostModel.create(newPost).then(async res => {
      return this.UserModel.findByIdAndUpdate(userId, { $push: {posts: res._id} }).then(res => {
        return{
          status: 200,
          message: 'El post ha sido creado exitosamente',
          data: res
        } as IRequestResponse
      }).catch((err) => {
        return{
          status: 403,
          message: 'El post no ha sido creado',
          errors: err
        } as IRequestResponse
      })
    }).catch((err) => {
      return{
        status: 403,
        message: 'El post no ha sido creado',
        errors: err
      } as IRequestResponse
    })
  }

  async update(id: string, userId: string, updatePost: UpdatePostDto): Promise<IRequestResponse> {
    try {
      const newEditPost = { ...updatePost, updatedAt: new Date() }
      const currentPost = await this.PostModel.findById(id);
      
      if (!currentPost) {
        return{
          status: 404,
          message: 'Post no encontrado'
        } as IRequestResponse
      }
      
      if (String(currentPost.userId) !== userId) {
        return{
          status: 401,
          message: 'Este usuario no esta autorizado para editar el post'
        } as IRequestResponse
      }

      return this.PostModel.findByIdAndUpdate(id, newEditPost).then(res => {
        return{
          status: 200,
          message: 'El post ha sido actualizado exitosamente',
          data: res
        } as IRequestResponse
      }).catch((err) => {
        return{
          status: 500,
          message: 'Ha ocurrido un error',
          errors: err
        } as IRequestResponse
      })
    } catch (err) {
      return{
        status: 500,
        message: 'Ha ocurrido un error',
        errors: err
      } as IRequestResponse
    }
    
  }

  async delete(id: string, userId: string): Promise<IRequestResponse> {
    try {
      const currentPost = await this.PostModel.findById(id);
      
      if (!currentPost) {
        return{
          status: 404,
          message: 'Post no encontrado'
        } as IRequestResponse
      }
      
      if (String(currentPost.userId) !== userId) {
        return{
          status: 401,
          message: 'Este usuario no esta autorizado para eliminar el post'
        } as IRequestResponse
      }

      return this.PostModel.findByIdAndUpdate(id, { deletedAt: new Date() }).then(res => {
        return{
          status: 200,
          message: 'El post ha sido eliminado exitosamente',
          data: res
        } as IRequestResponse
      }).catch((err) => {
        return{
          status: 500,
          message: 'Ha ocurrido un error',
          errors: err
        } as IRequestResponse
      })
    } catch (err) {
      return{
        status: 500,
        message: 'Ha ocurrido un error',
        errors: err
      } as IRequestResponse
    }
  }

  async findAll(page: number, limit: number): Promise<IRequestResponse> {
    const skip = (page - 1) * limit;

    const totalCount = await this.PostModel.countDocuments({ deletedAt: { $exists: false } })

    return this.PostModel.find({ deletedAt: { $exists: false } }).skip(skip).limit(limit).then((res) => {
      return {
        status: 200,
        message: 'Post consultados exitosamente',
        data: { 
          posts: res,
          currentPage: page,
          itemsPerPage: limit,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        }
      } as IRequestResponse
    }).catch((err) => {
      return {
        status: 500,
        message: 'Ha ocurrido un error',
        errors: err
      } as IRequestResponse
    })
  }

  async addLikes(id: string): Promise<IRequestResponse> {
    try {
      const post = await this.PostModel.findById(id)

      if (!post) {
        return {
          status: 404,
          message: 'Post no encontrado.'
        }
      }

      const sumLikes = post.likes + 1;

      return this.PostModel.findByIdAndUpdate(id, {likes: sumLikes}).then(res => {
        return {
          status: 200,
          message: 'Se ha sumado el like exitosamente',
          data: res
        } as IRequestResponse
      }).catch((err) => {
        return {
          status: 500,
          message: 'Ha ocurrido un error',
          errors: err
        } as IRequestResponse
      })
    } catch (err) {
      return {
        status: 500,
        message: 'Ha ocurrido un error',
        errors: err
      } as IRequestResponse
    }
  }
}
