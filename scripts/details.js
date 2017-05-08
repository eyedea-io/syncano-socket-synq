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

const details = syncanoObject => {
  const detailForm = new FormData()
  detailForm.append('api_key', envs.synqApiKey)
  detailForm.append('video_id', syncanoObject.synq_video_id)
  fetch(`${envs.synqUrl}video/details`, {method: 'POST', body: detailForm })
    .then(response => response.json())
    .then(data => response.json(data))
    .catch(err => response.error(err))
}

data.video_storage
  .where('id', postData.id)
  .where('user', user.id)
  .firstOrFail()
  .then(details)
  .catch(err => response.error(err))
