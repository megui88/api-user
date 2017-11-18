const client = require('mongodb');
const expect = require('chai').expect;
const storage = require('developmentsoftware-api-commons').storage;
const user = require('../../resources/UserService');
const Promise = require('bluebird');
const elements = [
    {
        id: 'one-id-fake',
        first_name: 'Homero',
        last_name: 'Tompson',
        email: 'homero@gmail.lo',
        connector: null,
        password: 'some-hash'
    },
    {
        id: 'other-id-fake',
        first_name: 'Marge',
        last_name: 'Simpson',
        email: 'marge@gmail.lo',
        connector: 'facebook',
        password: null
    }
];

describe('The user service happy pass', () => {

    it('try get all users ', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();
        user.all().then(data => {
            expect(data.length).to.be.equal(2);
            done();
        });
    });

    it('try get one user ', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();
        user.get('one-id-fake').then(data => {
            expect(data.id).to.be.equal('one-id-fake');
            done();
        });
    });

    it('try get one user but not exist', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(notFoundObject);
        storage.db = null;
        storage.getDB();
        user.get('one-id-fake')
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Not Found');
                done();
            });
    });

    it('try create one user on password', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();
        const promise = user.create(
            {
                first_name: 'Homero',
                last_name: 'Tompson',
                email: 'homero@gmail.lo',
                connector: null,
                password: 'some-hash'
            });
        promise.then(data => {
            expect(data.id).to.be.a('string');
            expect(data.connector).to.be.a('null');
            expect(data.last_name).to.be.equal('Tompson');
            done();
        });
    });

    it('try create one user on connector', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();
        const promise = user.create(
            {
                first_name: 'Other',
                last_name: 'User',
                email: 'other@gmail.lo',
                connector: 'facebook'
            });
        promise.then(data => {
            expect(data.id).to.be.a('string');
            expect(data.password).to.be.a('null');
            expect(data.last_name).to.be.equal('User');
            done();
        });
    });

    it('try update first_name ', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();
        let updateObject = {
            first_name: 'Sr. Homero'
        };
        const promise = user.update('one-id-fake', updateObject);
        promise.then(data => {
            expect(data.id).to.be.a('string');
            expect(data.connector).to.be.a('null');
            expect(data.first_name).to.be.equal('Sr. Homero');
            expect(data.last_name).to.be.equal('Tompson');
            done();
        });
    });

    it('try update last_name ', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();
        let updateObject = {
            last_name: 'Simpson'
        };
        const promise = user.update('one-id-fake', updateObject);
        promise.then(data => {
            expect(data.id).to.be.a('string');
            expect(data.connector).to.be.a('null');
            expect(data.first_name).to.be.equal('Homero');
            expect(data.last_name).to.be.equal('Simpson');
            done();
        });
    });

});

describe('The user service fail', () => {

    it('try get all users ', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        storage.getDB();
        user.all()
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Some problem!');
                done();
            });
    });

    it('try get one user ', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        storage.getDB();
        user.get('one-id-fake')
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Some problem!');
                done();
            });
    });

    it('try create one user ', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        storage.getDB();
        const promise = user.create(
            {
                first_name: 'Homero',
                last_name: 'Tompson',
                email: 'homero@gmail.lo',
                connector: null,
                password: 'some-hash'
            });
        promise
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Some problem!');
                done();
            });
    });

    it('try update one user ', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        storage.getDB();
        let updateObject = {
            first_name: 'Sr. Homero'
        };
        const promise = user.update('one-id-fake', updateObject);
        promise
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Some problem!');
                done();
            });
    });

});

// MOCK

function promiseReject() {
    return new Promise((resolv, reject) => {
        reject({
            code: 500,
            message: 'Some problem!'
        });
    });
}

function successObject() {
    return new Promise((resolv) => {
        resolv({
                collection: () => {
                    return new Promise((resolv) => {
                        resolv({
                            insertMany: (object) => {
                                return new Promise((resolv) => {
                                    resolv({
                                        ops: object
                                    })
                                });
                            },
                            updateOne: (object) => {
                                return new Promise((resolv) => {
                                    resolv({
                                        ops: object
                                    })
                                });
                            },
                            find: () => {
                                return {
                                    toArray: () => {
                                        return new Promise((resolv) => {
                                            resolv(elements);
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            }
        );
    });
}

function notFoundObject() {
    return new Promise((resolv) => {
        resolv({
                collection: () => {
                    return new Promise((resolv) => {
                        resolv({
                            find: () => {
                                return {
                                    toArray: () => {
                                        return new Promise((resolv) => {
                                            resolv([]);
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            }
        );
    });
}

function failObject() {
    return new Promise((resolv) => {
        resolv({
                collection: () => {
                    return new Promise((resolv) => {
                        resolv({
                            insertMany: promiseReject,
                            updateOne: promiseReject,
                            find: () => {
                                return {
                                    toArray: promiseReject
                                }
                            }
                        });
                    });
                }
            }
        );
    });
}