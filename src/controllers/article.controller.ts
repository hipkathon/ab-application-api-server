import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  Request,
  requestBody, Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {Article, ArticleRequest} from '../models';
import {ArticleRepository} from '../repositories';
import {inject} from '@loopback/core';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {FileUploadHandler} from '../types';
import {FileUploadController} from './file-upload.controller';

export class ArticleController {
  constructor(
    @repository(ArticleRepository)
    public articleRepository : ArticleRepository,
    @inject(FILE_UPLOAD_SERVICE)
    private uploadHandler: FileUploadHandler
  ) {}

  @post('/articles')
  @response(200, {
    description: 'Article model instance',
    content: {'application/json': {schema: getModelSchemaRef(Article)}},
  })
  async create(
    @requestBody.file({
      description: JSON.stringify(ArticleRequest.prototype.toJSON()),
      required: true
    })
    request: Request,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.uploadHandler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          const { files, fields } = FileUploadController.getFilesAndFields(request) as {
            files: globalThis.Express.Multer.File[],
            fields: { userId: string, title: string }
          };
          const { userId, title } = fields

          resolve(
            this.articleRepository.create({
              userId,
              title,
              resA: files[0].originalname,
              resB: files[1].originalname
            })
          )
        }
      })
    })
  }

  @get('/articles/count')
  @response(200, {
    description: 'Article model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Article) where?: Where<Article>,
  ): Promise<Count> {
    return this.articleRepository.count(where);
  }

  @get('/articles')
  @response(200, {
    description: 'Array of Article model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Article, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Article) filter?: Filter<Article>,
  ): Promise<Article[]> {
    return this.articleRepository.find(filter);
  }

  @patch('/articles')
  @response(200, {
    description: 'Article PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Article, {partial: true}),
        },
      },
    })
    article: Article,
    @param.where(Article) where?: Where<Article>,
  ): Promise<Count> {
    return this.articleRepository.updateAll(article, where);
  }

  @get('/articles/{id}')
  @response(200, {
    description: 'Article model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Article, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Article, {exclude: 'where'}) filter?: FilterExcludingWhere<Article>
  ): Promise<Article> {
    return this.articleRepository.findById(id, filter);
  }

  @patch('/articles/{id}')
  @response(204, {
    description: 'Article PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Article, {partial: true}),
        },
      },
    })
    article: Article,
  ): Promise<void> {
    await this.articleRepository.updateById(id, article);
  }

  @put('/articles/{id}')
  @response(204, {
    description: 'Article PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() article: Article,
  ): Promise<void> {
    await this.articleRepository.replaceById(id, article);
  }

  @del('/articles/{id}')
  @response(204, {
    description: 'Article DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.articleRepository.deleteById(id);
  }
}
