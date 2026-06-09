// In-memory access token — never written to localStorage
let _accessToken = null

export const getAccessToken  = ()      => _accessToken
export const setAccessToken  = (token) => { _accessToken = token }
export const clearAccessToken = ()     => { _accessToken = null }
