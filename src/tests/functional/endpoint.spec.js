const client = require('mongodb');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../../app');
const storage = require('developmentsoftware-api-commons').storage;

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

chai.use(chaiHttp);

describe('/GET not found', () => {
    it('it should GET other endpoint', function (done) {
        chai.request(server)
            .get('/people')
            .end((err, res) => {
                expect(res).have.status(404);
                expect(err.message).to.be.eql('Not Found');
                done();
            });
    });
});


describe('/GET users', () => {
    it('it should GET all the users', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        chai.request(server)
            .get('/users')
            .end((err, res) => {
                expect(res).have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(2);
                done();
            });
    });

    it('it should GET one user', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        chai.request(server)
            .get('/users/one-id-fake')
            .end((err, res) => {
                expect(res).have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.be.a('string');
                done();
            });
    });

    it('it should POST the user', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        chai.request(server)
            .post('/users')
            .send({
                first_name: 'New',
                last_name: 'User',
                email: 'new@gmail.lo',
                connector: 'facebook'
            })
            .end((err, res) => {
                expect(res).have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.be.a('string');
                expect(res.body.email).to.be.eql('new@gmail.lo');
                expect(res.body.connector).to.be.eql('facebook');
                done();
            });
    });

    it('it should PATH the user', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        chai.request(server)
            .patch('/users/one-id-fake')
            .send({
                first_name: 'Sr. Homero'
            })
            .end((err, res) => {
                expect(res).have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.be.eql('one-id-fake');
                expect(res.body.first_name).to.be.eql('Sr. Homero');
                expect(res.body.last_name).to.be.eql('Tompson');
                done();
            });
    });

    it('it should PUT the user', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        chai.request(server)
            .put('/users/one-id-fake')
            .send({
                first_name: 'Sr. Homero'
            })
            .end((err, res) => {
                expect(res).have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.be.eql('one-id-fake');
                expect(res.body.first_name).to.be.eql('Sr. Homero');
                expect(res.body.last_name).to.be.eql('Tompson');
                done();
            });
    });
});


describe('/GET users fail', () => {
    it('it should GET all the users', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        chai.request(server)
            .get('/users')
            .end((err, res) => {
                expect(res).have.status(500);
                expect(err.message).to.be.eql('Internal Server Error');
                done();
            });
    });
    it('it should GET force prod env', function (done) {
        server.set('env', 'prod');
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        chai.request(server)
            .get('/users')
            .end((err, res) => {
                expect(res).have.status(500);
                expect(err.message).to.be.eql('Internal Server Error');
                done();
            });
    });
});


// Mock Objects
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

// Mock Objects
function failObject() {

    return new Promise((resolv) => {
        resolv({
                collection: () => {
                    return new Promise((resolv) => {
                        resolv({
                            find: () => {
                                return {
                                    toArray: () => {
                                        return new Promise((resolv, reject) => {
                                            reject({
                                                code: 500,
                                                message: 'Some problem!'
                                            });
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
