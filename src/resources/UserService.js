const Promise = require('bluebird');
const commons = require('developmentsoftware-api-commons');
const ModelAbstractService = commons.model;
const uuidV4 = require('uuid/v4');

class UserService extends ModelAbstractService {

    constructor(storage) {
        super('users', storage);
    }

    modelMap(data, model) {
        return {
            id: data.id || model.id || uuidV4(),
            first_name: data.first_name || model.first_name,
            last_name: data.last_name || model.last_name,
            email: data.email || model.email,
            connector: (data.connector !== undefined) ? data.connector : model.connector || null,
            password: (data.password !== undefined) ? data.password : model.password || null
        }
    }
}

module.exports = new UserService(commons.storage);