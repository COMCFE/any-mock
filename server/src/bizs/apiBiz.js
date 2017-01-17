let db = require('./../common/db');
let util = require('./../common/util');

let _hasAuth = (appId, userId, username) => {
  return new Promise((resolve, reject) => {
    let filterObj = {
      appId: appId,
      $or: [
        { userId: userId },
        { authorizedUser: { $elemMatch: username } }
      ]
    };
    db.findOne('apps', filterObj)
      .then(app => resolve(!!app))
      .catch(reason => reject(reason));
  });
};

let validateApi = (req, res, next) => {
  let properties = ['apiName', 'apiPath', 'apiMethod', 'responseHeaders', 'responseStatus', 'responseContentType'];
  for (let p of properties) {
    if (!req.body[p]) {
      return next(`${p} required`);
    }
  }
  next();
};

let findApi = (req, res, next) => {
  let appId = req.params.appId;
  let apiId = req.params.apiId;
  let user = req.reqData.user;
  _hasAuth(appId, user.userId, user.username)
    .then(isAuthed => {
      if (!isAuthed) {
        res.status(401);
        return res.end();
      }
      db.findOne('apis', { apiId: apiId })
        .then(api => {
          if (!api) {
            res.status(404);
            return res.end();
          }
          req.reqData.api = api;
          next();
        }).catch(reason => next(reason));
    });
};

let createApi = (req, res, next) => {
  let appId = req.params.appId;
  let userId = req.reqData.user.userId;
  let body = req.body;
  _hasAuth(appId, userId, req.reqData.user.username)
    .then(isAuthorized => {
      if (!isAuthorized) return next('unauthorized.');
      let apiEntity = {
        appId: appId,
        userId: userId,
        createDate: Date.now(),
        apiId: util.buildRandomString(),
        apiName: body.apiName,
        apiPath: body.apiPath,
        apiMethod: body.apiMethod,
        responseHeaders: body.responseHeaders,
        responseStatus: body.responseStatus,
        responseContentType: body.responseContentType,
        responseData: body.responseData,
        isEnable: true
      };
      db.apis.insert(apiEntity, (err, newApi) => {
        if (err) return next(err);
        res.status(201);
        res.json(newApi);
      });
    }).catch(reason => next(reason));
};

let updateApi = (req, res, next) => {
  let apiId = req.params.apiId;
  let body = req.body;

  let updateEntity = {
    $set: {
      apiName: body.apiName,
      apiPath: body.apiPath,
      apiMethod: body.apiMethod,
      responseHeaders: body.responseHeaders,
      responseStatus: body.responseStatus,
      responseContentType: body.responseContentType,
      responseData: body.responseData,
      isEnable: !!body.isEnable
    }
  };

  db.apis.update({ apiId: apiId }, updateEntity, {}, (err, numReplaced) => {
    if (err) return next(err);
    if (numReplaced === 0) return next('update failed, please retry');
    res.status(202);
    res.json(true);
  });
};

let getApi = (req, res, next) => {
  return req.reqData.api;
};

let deleteApi = (req, res, next) => {
  let apiId = req.params.apiId;
  db.remove('apis', { _id: req.reqData.api._id })
    .then(numRemoved => {
      if (numRemoved === 0) return next('Delete failed, please retry.');
      res.json(true);
    })
    .catch(reason => next(reason));
};

module.exports = {
  createApi: createApi,
  updateApi: updateApi,
  getApi: getApi,
  deleteApi: deleteApi,
  validateApi: validateApi,
  findApi: findApi
};
