const libGenerateArticleId = require('./lib.tool.generateArticleId')
const libUpdateGithubArticleRepo = require('./lib.tools.updateGithubArtcleRepo')

exports.getVerifyCode = function () {
  return {
    base64: null,
    code: undefined
  }
}

exports.generateArticleId = libGenerateArticleId.index
exports.updateArticleRepo = libUpdateGithubArticleRepo.index
exports.libUniverse = require('./lib.tool.universe')