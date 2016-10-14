'use strict'
module.exports = (agent, assert) => {
  describe('user', ()=> {
    it('/blog/user/getUserToken', done=> {
      agent
        .post('/blog/user/getUserToken')
        .send({
          'userId': global.blogSeedUserId
        })
        .expect(200)
        .end((err, res)=> {
          if (err) return done(err)

          let body = res.body
          assert.equal(0, body.status)

          body = JSON.parse(res.text).result
          assert.isString(body.token)

          //set global userToken
          global.userToken = body.token
          done()
        })
    })

    it('/blog/user/getAdminToken', done=> {
      agent
        .post('/blog/user/getAdminToken')
        .expect(200)
        .end((err, res)=> {
          if (err) return done(err)

          let body = res.body
          assert.equal(0, body.status)

          body = JSON.parse(res.text).result
          assert.isString(body.token)

          //set global adminToken
          global.adminToken = body.token
          done()
        })
    })
  })
}