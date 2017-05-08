// This script is only simple example for testing purposes only. It should be replaced with proper authentication script or socket.
import fetch from 'node-fetch'
import {users, data, response} from 'syncano-server'


const { username, password } = ARGS.POST

const createUser = () => {
  const user = {
    email: username,
    username,
    password
  }

users.create(user)
  .then(res => response.json({token: res.user_key, username: res.username}))
  .catch(err => response.error(err))
}

const authenticateUser = () => {
  const url = `https://api.syncano.rocks/v2/instances/${META.instance}/users/auth/`
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': META.token
    }
  })
  .then(res => res.json())
  .then(json => response.json({token: json.user_key, username: json.username}))
  .catch(({ response: err }) => {
    err.json().then(json => response.error(json))
  })
}

users
  .where('username', 'eq', username)
  .firstOrFail()
  .then(authenticateUser)
  .catch(createUser)
