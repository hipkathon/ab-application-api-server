import {Entity, model, property, hasMany} from '@loopback/repository';
import {Article} from './article.model';

@model({settings: {strict: true}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  birthday: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {
      columnName: 'is_man'
    }
  })
  isMan: boolean;

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
    type: 'boolean',
    postgresql: {
      columnName: 'is_enabled'
    }
  })
  isEnabled?: boolean;

  @hasMany(() => Article)
  articles: Article[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
