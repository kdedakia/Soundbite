export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'

export function loginSuccess(profile,id,refreshToken) {
  return { type: LOGIN_SUCCESS, profile, idToken: id, refreshToken: refreshToken }
}

export function loginError() {
  return { type: LOGIN_ERROR }
}
