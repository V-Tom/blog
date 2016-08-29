'use strict'
const { Types:{ ObjectId } }=require('mongoose')

module.exports = (agent, assert) => {
  let count = 1
  let articleId = null
  let articleDbId = null
  let article = {
    title: '测试文章',
    author: 'Nomand',
    meta: '测试文章meta',
    subTitle: '测试文章subTitle',
    intro: { preview: '测试文章preview', pic: 'http://www.baidu.com' },
    tags: ['Node', 'Ruby', 'Go'],
    content: '##测试文章content',
    githubArticleUrl: "https://github.com/V-Tom/article"
  }

  describe('article detail', ()=> {
      /**
       * 新建文章
       */
      it('blog article create : /blog/article', done=> {
        agent
          .post('/blog/article')
          .set('token', global.adminToken)
          .send(article)
          .expect(200)
          .end((err, res)=> {
            if (err) return done(err)

            let body = res.body

            assert.equal(0, body.status)

            done()
          })
      })

      /**
       * 获取文章全部列表
       */

      it('blog get list : /blog/articlelist?page=1&limit=10', done=> {
        let limit = 10
        let page = 1
        agent
          .get(`/blog/articlelist?page=${page}&limit=${limit}`)
          .expect(200)
          .end((err, res)=> {
            if (err) return done(err)

            let body = res.body

            assert.equal(0, body.status)

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

      it('blog get list : /blog/articlelist?page=1&limit=10&tag=Node', done=> {
        let limit = 10
        let page = 1
        agent
          .get(`/blog/articlelist?page=${page}&limit=${limit}&tag=Node`)
          .expect(200)
          .end((err, res)=> {
            if (err) return done(err)

            let body = res.body

            assert.equal(0, body.status)

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
      it('blog get article : /blog/article', done=> {
        agent
          .get(`/blog/article?articleId=${articleId}`
          )
          .expect(200)
          .end((err, res)=> {
            if (err) return done(err)

            let body = res.body

            assert.equal(0, body.status)

            body = body.result

            body = body.data
            assert.equal(articleId, body.articleId)
            assert.equal(articleDbId, body._id)
            assert.equal(article.title, body.title)
            assert.equal(article.author, body.author)
            assert.equal(article.meta, body.meta)
            assert.equal(article.content, body.content)
            assert.equal(article.subTitle, body.subTitle)
            assert.equal(article.githubArticleUrl, body.githubArticleUrl)
            assert.equal(article.tags.length, body.tags.length)
            assert.equal(article.tags[0], body.tags[0])
            assert.equal(article.tags[1], body.tags[1])
            assert.equal(article.tags[2], body.tags[2])
            assert.equal(article.intro.preview, body.intro.preview)
            assert.equal(article.intro.pic, body.intro.pic)

            done()
          })
      })
      /**
       * 更新文章
       */
      it('blog article update : /blog/article', done=> {
        article.title = '测试更新文章'
        article.meta = '测试更新文章meta'
        agent
          .put(
            `/blog/article/${articleId}`
          )
          .set('token', global.adminToken)
          .send(article)
          .expect(200)
          .end((err, res)=> {
            if (err) return done(err)

            let body = res.body

            assert.equal(0, body.status)

            done()
          })
      })

      /**
       * 获取文章 part two
       */
      it('blog get article : /blog/article', done=> {
        agent
          .get(`/blog/article?articleId=${articleId}`
          )
          .expect(200)
          .end((err, res)=> {
            if (err) return done(err)

            let body = res.body

            assert.equal(0, body.status)

            body = body.result

            body = body.data
            assert.equal(articleId, body.articleId)
            assert.equal(articleDbId, body._id)
            assert.equal(article.title, body.title)
            assert.equal(article.author, body.author)
            assert.equal(article.meta, body.meta)
            assert.equal(article.content, body.content)
            assert.equal(article.subTitle, body.subTitle)
            assert.equal(article.githubArticleUrl, body.githubArticleUrl)
            assert.equal(article.tags.length, body.tags.length)
            assert.equal(article.tags[0], body.tags[0])
            assert.equal(article.tags[1], body.tags[1])
            assert.equal(article.tags[2], body.tags[2])
            assert.equal(article.intro.preview, body.intro.preview)
            assert.equal(article.intro.pic, body.intro.pic)

            done()
          })
      })

      /**
       * 删除文章
       */
      it('blog article remove : /blog/article/', done=> {
        agent
          .delete(`/blog/article/${articleId}/${articleDbId}`)
          .set('token', global.adminToken)
          .expect(200)
          .end((err, res)=> {
            if (err) return done(err)

            let body = res.body

            assert.equal(0, body.status)

            done()
          })
      })
    }
  )
}