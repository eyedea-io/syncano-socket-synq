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

const updateVideoObject = data => {
  data.video_storage
    .update(postData.id, { meta: data.userdata })
    .then(response => response.json("Success"))
    .catch(err => response.error(err))
}

const updateSynq = data => {
  const userData = Object.assign({}, {
    user_key: user.user_key,
    username: user.username,
    instance: META.instance
  }, postData.payload)

  const updateForm = new FormData()
  updateForm.append('api_key', envs.synqApiKey)
  updateForm.append('video_id', data.synq_video_id)
  updateForm.append('userdata', JSON.stringify(userData))

  fetch(`${envs.synqUrl}video/update`, {method: 'POST', body: updateForm })
    .then(res => res.json())
    .then(updateVideoObject)
    .catch(err => response.error(err))
}

data.video_storage
  .where('id', postData.id)
  .where('user', user.id)
  .firstOrFail()
  .then(updateSynq)
  .catch(err => response.error(err))
