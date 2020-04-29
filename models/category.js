let { Model, snakeCaseMappers } = require('objection');

class Category extends Model {
  static get tableName() {
    return 'category';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get relationMappings() {
    let Challenge = require('./Challenge');

    return {
      challenges: {
        relation: Model.HasManyRelation,
        modelClass: Challenge,
        join: {
          from: 'category.id',
          to: 'challenges.category_id',
        }
      }

    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required:[
        'name',
      ],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
      },
    };
  }
}

module.exports = Category;
