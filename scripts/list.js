import {data, response} from 'syncano-server'


const user = META.user || {}

if( !user.hasOwnProperty('id') ){
  response.error({message: 'Unauthorized endpoint call'}, 401)
  process.exit()
}

data.video_storage
  .where('user', user.id)
  .list()
  .then(list => {
    const json = list.map(item => {
      return {
        id: item.id,
        url: item.embeded_url
      }
    })
    response.json(json)
  })
  .catch(err => response.error(err))
