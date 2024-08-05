const express = require('express')
const appRoutes = express.Router()


appRoutes
  .route('/')
  .get((req, res)=>{
    res.status(200).json({app: 'teste'})
  })

appRoutes
  .route('/hello')
  .get((req, res)=>{
    res.status(200).json({hello: 'world'})
  })

module.exports = appRoutes
