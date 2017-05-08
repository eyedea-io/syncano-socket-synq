import fetch from 'node-fetch'
import {data, response} from 'syncano-server'

import envs from '../helpers/envs'

const user = META.user || {}
const postData = ARGS.POST

if( !user.hasOwnProperty('id') ){
  response.error({message: 'Unauthorized endpoint call'}, 401)
  process.exit()
}

const channelMessage = {
  "payload": {
    "message": postData.video_url
  },
  "room": `default.${user.username}`
}

const url = `${envs.syncanoUrl}instances/${META.instance}/channels/default/publish/`

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': META.token
  },
  body: JSON.stringify(channelMessage)
}).then(res => res.json())
  .then( json => {
    data.video_storage.where('synq_video_id', postData.video_id).first().then( result => {
      data.video_storage.update(result.id, {
        embeded_url: postData.video_url,
        synq_widget: postData.embed_url,
        synq_state: postData.state
      })
    })
  })
