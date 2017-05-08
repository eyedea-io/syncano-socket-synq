import fetch from 'node-fetch'
import FormData from 'form-data'

import {data, response} from 'syncano-server'


const videoObject = ARGS.POST
const user = META.user || {}

if( !user.hasOwnProperty('id') ){
  response.error({message: 'Unauthorized endpoint call'}, 401)
  process.exit()
}

data.video_storage
.where('user', user.id)
.where('id', videoObject.id)
.firstOrFail()
.then(() => {
  data.video_storage.delete(videoObject.id)
    .then(() => response.json({success: true}))
    .catch(err => response.error(err))
})
.catch(err => response.error(err))
