let { Model, snakeCaseMappers } = require('objection');

class Categories extends Model {
  static get tableName() {
    return 'category';
  }

  static get relationMappings() {
    let User = require('./User');
    let Challenge = require('./Challenge')
  }
}
