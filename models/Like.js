let { Model, snakeCaseMappers } = require('objection');
// let { User, Message } = require('../models');

class Like extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get tableName() {
    return 'likes';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'challengeId',
        'userId'
      ],
      properties: {
        id: { type: 'integer'},
        challengeId: {type: 'integer'},
        userId: {type: 'integer'}
      }
    };
  }

  static get relationMappings() {
    let Challenge= require('./Challenge');
    let User = require('./User');
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'likes.user_id',
          to: 'users.id'
        }
      },
      challenge: {
        relation: Model.HasOneRelation,
        modelClass: Challenge,
        join: {
          from: 'likes.challenge_id',
          to: 'challenges.id'
        }
      }
    }
  }
}

module.exports = Like;
