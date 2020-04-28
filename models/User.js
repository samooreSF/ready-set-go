let { Model, snakeCaseMappers } = require('objection');
let Password = require('objection-password')();

class User extends Password(Model) {
  static get tableName() {
    return 'users';
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
          from: 'users.id',
          to: 'challenges.user_id',
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'username',
        'email',
        'password'
      ],
      properties: {
        id: { type: 'integer' },
        username: {type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    };
  }
}

module.exports = User;
