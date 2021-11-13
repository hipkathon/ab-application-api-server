import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MainAppDatasource} from '../datasources';
import {Article, ArticleRelations} from '../models';

export class ArticleRepository extends DefaultCrudRepository<
  Article,
  typeof Article.prototype.id,
  ArticleRelations
> {
  constructor(
    @inject('datasources.MainAppDatasource') dataSource: MainAppDatasource,
  ) {
    super(Article, dataSource);
  }
}
