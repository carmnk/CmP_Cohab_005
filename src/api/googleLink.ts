const clientID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID
const redirectUri =
  import.meta.env?.MODE === 'ssr'
    ? 'http://localhost/ssr/'
    : import.meta.env.VITE_APP_GOOGLE_REDIRECT_URI

const basicScopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'openid',
]

const basicScopesString = basicScopes.join(' ')

export const getGoogleOauthLoginLink = (
  state: string,
  redirectUriIn?: string
) =>
  `https://accounts.google.com/o/oauth2/auth?&client_id=${clientID}&redirect_uri=${
    redirectUriIn ?? redirectUri
  }&response_type=code&scope=${basicScopesString}&state=${state}`
