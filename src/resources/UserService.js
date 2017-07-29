const Promise = require('bluebird');
const storage = require('developmentsoftware-api-commons').storage;
const uuidV4 = require('uuid/v4');

class UserService {

    constructor(storage) {
        this.COLLECTION = 'users';
        this.storage = storage;
    }

    all() {
        return new Promise((resolv, reject) => {
            this.storage.getCollection(this.COLLECTION)
                .then(col => {
                    col.find({}).toArray()
                        .then(items => {
                            resolv(items.map(this.modelMap))
                        })
                        .catch(reject)
                })
                .catch(reject)
        })
    }

    get(id) {
        return new Promise((resolv, reject) => {
            this.find({id: id})
                .then(data => {
                    if (0 >= data.length) {
                        reject({
                            status: 404,
                            message: 'Not Found'
                        })
                    }
                    resolv(data[0])

                })
                .catch(reject)
        });
    }

    find(query) {
        return new Promise((resolv, reject) => {
            this.storage.getCollection(this.COLLECTION)
                .then(col => {
                    col.find(query)
                        .toArray()
                        .then(items => {
                            resolv(items.map(this.modelMap));
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    create(data) {
        return new Promise((resolv, reject) => {
            this.bulkCreate([data])
                .then(data => {
                    resolv(data[0])
                })
                .catch(reject);
        });

    }

    update(id, data) {
        return new Promise((resolv, reject) => {
            this.get(id)
                .then(user => {
                    let object = this.modelMap(data, user);
                    this.storage.getCollection(this.COLLECTION).then(col => {
                        col.updateOne({id: id}, object)
                            .then(() => {
                                resolv(this.modelMap(object));
                            })
                            .catch(reject);
                    });
                })
                .catch(reject);
        });
    }

    bulkCreate(data) {
        let users = data.map(this.modelMap);

        return new Promise((resolv, reject) => {
            this.storage.getCollection(this.COLLECTION)
                .then(col => {
                    col.insertMany(users)
                        .then(items => {
                            resolv(items.ops.map(item => {
                                return this.modelMap(item);
                            }));
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
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

module.exports = new UserService(storage);