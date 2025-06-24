import { makeApiQuery } from './00_utils/makeApiQuery'

//SETTING BASE URL
export const BASE_URL = import.meta.env.VITE_BE_SERVER_URL

export const API = {
  // TODO: create a generic + google user type
  verifyGoogleLogin: makeApiQuery<{ code: string }, { user: any }>(
    'api/v1/apps/cohab/user/google/login',
    'POST'
  ),

  getUser: makeApiQuery<never, any>('api/v1/apps/cohab/user'),
  changeUsername: makeApiQuery<{ user_name: string }, any>(
    'api/v1/apps/cohab/username',
    'PUT'
  ),
  changeGroupName: (group_id: number) =>
    makeApiQuery<{ group_name: string }, any>(
      `api/v1/apps/cohab/groupname/${group_id}`,
      'PUT'
    ),

  logoutUser: makeApiQuery<never, any>('api/v1/apps/cohab/user/logout', 'POST'),
  getTasks: makeApiQuery<never, any>('api/v1/apps/cohab/tasks'),
  createTask: makeApiQuery<never, any>('api/v1/apps/cohab/task', 'POST'),
  editTask: (task_id: number) =>
    makeApiQuery<never, any>('api/v1/apps/cohab/task/' + task_id, 'PUT'),
  deleteTask: (task_id: number) =>
    makeApiQuery<never, any>('api/v1/apps/cohab/task/' + task_id, 'DELETE'),
  sendGroupInvitation: makeApiQuery<
    { invitee_email: string },
    { success: boolean }
  >('api/v1/apps/cohab/group/invition/send', 'POST'),
  acceptGroupInvitation: makeApiQuery<
    { group_invitation_id: number },
    { success: boolean }
  >('api/v1/apps/cohab/group/invition/reply', 'POST'),
}

// TODO ADD Satisfy type condition
