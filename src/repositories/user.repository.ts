import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MainAppDatasource} from '../datasources';
import {User, UserRelations, Article} from '../models';
import {ArticleRepository} from './article.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly articles: HasManyRepositoryFactory<Article, typeof User.prototype.id>;

  constructor(
    @inject('datasources.MainAppDatasource') dataSource: MainAppDatasource, @repository.getter('ArticleRepository') protected articleRepositoryGetter: Getter<ArticleRepository>,
  ) {
    super(User, dataSource);
    this.articles = this.createHasManyRepositoryFactoryFor('articles', articleRepositoryGetter,);
  }
}
