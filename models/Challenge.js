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
    let Videos = require('./Videos');
    let Category = require('./Category');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'challenges.user_id',
          to: 'users.id',
        }
      },
      video: {
        relation: Model.BelongsToOneRelation,
        modelClass: Videos,
        join: {
          from: 'challenges.video_id',
          to: 'videos.id',
        }
      },
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'challenges.category_id',
          to: 'category.id',
        }
      },
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'title',
        'caption',
        'categoryId',
        'videoId',
        'userId',
      ],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        videoId: { type: 'integer' },
        categoryId: { type: 'integer' },
        userId: { type: 'integer' },
        caption: { type: 'string' },
      },
    };
  }
}

module.exports = Challenge;
