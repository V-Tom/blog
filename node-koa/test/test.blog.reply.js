'use strict'
const { Types:{ ObjectId } }=require('mongoose')

module.exports = (agent, assert) => {

  let articleDbId = new ObjectId()
  let articleId = 2333333
  let replyTo = new ObjectId()
  let replyId = null
  let reply = {
    articleId: articleId,
    articleDbId: articleDbId,
    replyTo: replyTo,
    user: 'Nomand',
    time: new Date().toString(),
    content: '测试用户评论内容'
  }

  describe('user reply', ()=> {
    /**
     * 添加评论
     */
    it('add reply : /blog/reply', done=> {
      agent.post('/blog/reply')
        .send(reply)
        .set('token', global.userToken)
        .expect(200)
        .end((err, res)=> {
          if (err) return done(err)

          let body = res.body
          assert.equal(0, body.status)

          done()
        })
    })
    /**
     * 得到评论
     */
    it('get reply : blog/reply?articleId=06lkb716bk5b&page=1&limit=10', done=> {
      agent.get(`/blog/reply?articleId=${articleId}&page=1&limit=10`)
        .set('token', global.userToken)
        .expect(200)
        .end((err, res)=> {
          if (err) return done(err)

          let body = res.body
          assert.equal(0, body.status)

          body = body.result

          //data
          assert.equal(1, body.count)
          assert.equal(1, body.data.length)

          //data content
          body = body.data[0]
          replyId = body._id

          assert.equal(articleId, body.articleId)
          assert.equal(reply.content, body.content)
          assert.equal(reply.replyTo, body.replyTo)

          //data user
          body = body.user
          assert.equal(global.blogSeedUserId, body._id)

          done()
        })
    })
    /**
     * 删除评论
     */
    it(`delete reply : /blog/reply?replyId=${replyId}&articleId=${articleId}`, done=> {
      agent.delete(`/blog/reply?replyId=${replyId}&articleId=${articleId}`)
        .set('token', global.adminToken)
        .expect(200)
        .end((err, res)=> {
          if (err) return done(err)

          let body = res.body
          assert.equal(0, body.status)

          done()
        })
    })
  })
}