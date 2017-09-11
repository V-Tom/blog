'use strict'
module.exports = (agent, assert) => {
  describe('user', () => {

    it('/auth/user/admin', done => {

      const secret = 'NOMAND_KOA_BLOG_SERVR_FARMWORK'

      agent
        .post(`/auth/user/admin?secret=${secret}`)
        .expect(200)
        .end((err, res) => {

          if (err) return done(err)

          let body = res.body

          assert.equal(200, body.status)

          body = JSON.parse(res.text).result

          assert.isString(body.token)

          /**
           * set global adminToken
           * @type {*}
           */
          global.adminToken = body.token
          done()
        })
    })
  })
}