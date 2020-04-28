let { Model, snakeCaseMappers } = require('objection');

class Videos extends Model {
  static get tableName() {
    return 'videos';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get relationMappings() {
    let User = require('./User');
    let Challenge = require('./Challenge')

    return {
      userToVideo: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'videos.user_id',
          to: 'users.id',
        }
      },
      challengeToVideo: {
        relation: Model.HasManyRelation,
        modelClass: Challenge,
        join: {
          from: 'videos.id',
          to: 'challenge.videos_id',
        }
    }
  }
}
  static get jsonSchema() {
    return {
      type: 'object',
      required:[
        'videoLink',
      ],
      properties: {
        id: { type: 'integer' },
        videoLink: { type: 'string' },
      },
    };
  }
}

module.exports = Videos;
