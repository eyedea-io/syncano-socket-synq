import fetch from 'node-fetch'
import FormData from 'form-data'
import {data, response} from 'syncano-server'

import envs from '../helpers/envs'


const user = META.user || {}
const postData = ARGS.POST

if( !user.hasOwnProperty('id') ){
  response.error({message: 'Unauthorized endpoint call'}, 401)
  process.exit()
}

const createForm = new FormData()
const userData = Object.assign({}, {
  user_key: user.user_key,
  username: user.username,
  instance: META.instance
}, postData)
const uploader = syncanoObject => {
  const updateForm = new FormData()

  updateForm.append('api_key', envs.synqApiKey)
  updateForm.append('video_id', syncanoObject.synq_video_id)
  updateForm.append('timeout', '3 hours')

  fetch(`${envs.synqUrl}video/uploader`, {method: 'POST', body: updateForm })
  .then(res => res.json())
  .then(json => {
    data.video_storage.update(syncanoObject.id, {
      synq_upload: json,
    })
    .then(() => {
      response.json(json)
    })
  .catch(err => response.error(err))
  })
}

createForm.append('api_key', envs.synqApiKey)
createForm.append('userdata', JSON.stringify(userData))

fetch(`${envs.synqUrl}video/create`, {method: 'POST', body: createForm })
  .then(res => res.json())
  .then(json => {
    data.video_storage.create({
      synq_state: json.state,
      synq_video_id: json.video_id,
      user: user.id
    })
    .then(uploader)
  })
  .catch(err => response.error(err))
