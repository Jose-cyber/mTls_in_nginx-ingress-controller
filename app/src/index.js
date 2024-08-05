const app =  require('./infra/server')
require('dotenv').config()

const port =  process.env.PORT || 8080

app.listen(port, ()=>{ 
  console.info(`Server runing in port: ${port}`)
})


module.exports = app