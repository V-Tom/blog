'use strict'
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = (agent, assert) => {

  let count = 1
  let articleId = null
  let articleDbId = null
  const now = Date.now()
  const localTime = new Date(now)
  let article = {
    title: '测试文章',
    articleId: '测试文章articleId',
    author: 'Nomand',
    meta: '测试文章meta',
    subTitle: '测试文章subTitle',
    introPreview: '测试文章preview',
    introWrapper: 'http://www.baidu.com',
    postTime: {
      localTime,
      UTCTime: now
    },
    tags: ['Node', 'Ruby', 'Go'],
    content: '##测试文章content',
    gitArticleUrl: "https://github.com/V-Tom/article"
  }

  describe('article detail', () => {
      /**
       * 新建文章
       */
      it('blog article create : /blog/article', done => {
        agent
          .post('/blog/article')
          .set('token', global.adminToken)
          .send(article)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)

            let body = res.body

            assert.equal(200, body.status)

            done()
          })
      })

      /**
       * 获取文章全部列表
       */

      it('blog get list : /blog/list?page=1&limit=10', done => {
        let limit = 10
        let page = 1
        agent
          .get(`/blog/list?page=${page}&limit=${limit}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)

            let body = res.body

            assert.equal(200, body.status)

            body = body.result
            assert.equal(count, body.count)
            assert.equal(count, body.data.length)
            assert.equal(limit, body.limit)
            assert.equal(page, body.page)

            articleId = body.data[0].articleId
            articleDbId = body.data[0]._id

            done()
          })
      })

      /**
       * 通过tag 获取文章列表
       */

      it('blog get list : /blog/list?page=1&limit=10&tag=Node', done => {
        let limit = 10
        let page = 1
        agent
          .get(`/blog/list?page=${page}&limit=${limit}&tag=Node`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)

            let body = res.body

            assert.equal(200, body.status)

            body = body.result
            assert.equal(count, body.count)
            assert.equal(count, body.data.length)
            assert.equal(limit, body.limit)
            assert.equal(page, body.page)

            articleId = body.data[0].articleId
            articleDbId = body.data[0]._id

            done()
          })
      })
      /**
       * 获取文章 part one
       */
      it('blog get article : /blog/article/:articleId', done => {
        agent
          .get(`/blog/article/${articleId}`
          )
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)

            let body = res.body

            assert.equal(200, body.status)

            body = body.result

            body = body.data

            assert.equal(articleId, body.articleId)
            assert.equal(articleDbId, body._id)
            assert.equal(article.title, body.title)
            assert.equal(article.author, body.author)
            assert.equal(article.meta, body.meta)
            assert.equal(article.content, body.content)
            assert.equal(article.subTitle, body.subTitle)
            assert.equal(article.gitArticleUrl, body.gitArticleUrl)
            assert.equal(article.tags.length, body.tags.length)
            assert.equal(article.tags[0], body.tags[0])
            assert.equal(article.tags[1], body.tags[1])
            assert.equal(article.tags[2], body.tags[2])
            assert.equal(article.introPreview, body.introPreview)
            assert.equal(article.introWrapper, body.introWrapper)

            done()
          })
      })
      /**
       * 更新文章
       */
      it('blog article update : /blog/article', done => {
        article.title = '测试更新文章'
        article.meta = '测试更新文章meta'
        agent
          .put(
            `/blog/article/${articleId}`
          )
          .set('token', global.adminToken)
          .send(article)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)

            let body = res.body

            assert.equal(200, body.status)

            done()
          })
      })

      /**
       * 删除文章
       */
      it('blog article remove : /blog/article/', done => {
        agent
          .delete(`/blog/article/${articleId}/${articleDbId}`)
          .set('token', global.adminToken)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)

            let body = res.body

            assert.equal(200, body.status)

            done()
          })
      })
    }
  )
}