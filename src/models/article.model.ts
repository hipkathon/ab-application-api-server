import {Entity, model, property} from '@loopback/repository';

@model()
export class Article extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'resource_a'
    }
  })
  resA?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'resource_b'
    }
  })
  resB?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'created_at'
    }
  })
  createdAt?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'updated_at'
    }
  })
  updatedAt?: string;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'like_a'
    }
  })
  likeA?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'like_b'
    }
  })
  likeB?: number;

  @property({
    type: 'boolean',
    postgresql: {
      columnName: 'is_enabled'
    }
  })
  isEnabled?: boolean;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'user_id'
    }
  })
  userId?: string;

  constructor(data?: Partial<Article>) {
    super(data);
  }
}

export interface ArticleRelations {
  // describe navigational properties here
}

export type ArticleWithRelations = Article & ArticleRelations;
