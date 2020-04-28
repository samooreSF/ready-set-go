let { Model, snakeCaseMappers } = require('objection');

class Challenge extends Model {
  static get tableName() {
    return 'challenges';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get relationMappings() {
    let User = require('./User');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'challenges.user_id',
          to: 'users.id',
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'title',
        'caption',
      ],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        caption: { type: 'string' },
      },
    };
  }
}

module.exports = Challenge;
