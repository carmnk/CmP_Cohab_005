import { Schedule } from '../appController/types/schedule'
import { ScheduleEntry } from '../appController/types/scheduleEntry'
import { Task } from '../appController/types/tasks'
import { User } from '../appController/types/user'
import { makeApiQuery } from './00_utils/makeApiQuery'

//SETTING BASE URL
export const BASE_URL = import.meta.env.VITE_BE_SERVER_URL

export const API = {
  // TODO: create a generic + google user type
  verifyGoogleLogin: makeApiQuery<{ code: string }, { user: User }>(
    'api/v1/apps/cohab/user/google/login',
    'POST'
  ),

  getUser: makeApiQuery<never, { data: User }>('api/v1/apps/cohab/user'),
  changeUsername: makeApiQuery<{ user_name: string }, any>(
    'api/v1/apps/cohab/username',
    'PUT'
  ),
  changeUserColor: makeApiQuery<{ user_color: string }, any>(
    'api/v1/apps/cohab/usercolor',
    'PUT'
  ),
  changeGroupName: (group_id: number) =>
    makeApiQuery<{ group_name: string }, any>(
      `api/v1/apps/cohab/groupname/${group_id}`,
      'PUT'
    ),
  changeGroupAdmin: (group_id: number) =>
    makeApiQuery<{ group_admin_user_id: number }, any>(
      `api/v1/apps/cohab/groupadmin/${group_id}`,
      'PUT'
    ),
  removeUserFromGroup: (group_id: number, user_id: number) =>
    makeApiQuery<never, any>(
      `api/v1/apps/cohab/group/${group_id}/remove/${user_id}`,
      'DELETE'
    ),

  logoutUser: makeApiQuery<never, any>('api/v1/apps/cohab/user/logout', 'POST'),
  getTasks: makeApiQuery<never, { data: Task[] }>('api/v1/apps/cohab/tasks'),
  createTask: makeApiQuery<Task, any>('api/v1/apps/cohab/task', 'POST'),
  editTask: (task_id: number) =>
    makeApiQuery<Task, any>('api/v1/apps/cohab/task/' + task_id, 'PUT'),
  deleteTask: (task_id: number) =>
    makeApiQuery<never, any>('api/v1/apps/cohab/task/' + task_id, 'DELETE'),

  getSchedules: makeApiQuery<never, { data: Schedule[] }>(
    'api/v1/apps/cohab/schedules'
  ),
  createSchedule: makeApiQuery<Schedule, any>(
    'api/v1/apps/cohab/schedule',
    'POST'
  ),
  editSchedule: (schedule_id: number) =>
    makeApiQuery<Schedule, any>(
      `api/v1/apps/cohab/schedule/${schedule_id}`,
      'PUT'
    ),
  deleteSchedule: (schedule_id: number) =>
    makeApiQuery<never, any>(
      `api/v1/apps/cohab/schedule/${schedule_id}`,
      'DELETE'
    ),

  createScheduleEntry: makeApiQuery<ScheduleEntry, any>(
    'api/v1/apps/cohab/schedule_entry',
    'POST'
  ),
  editScheduleEntry: (schedule_entry_id: number) =>
    makeApiQuery<ScheduleEntry, any>(
      `api/v1/apps/cohab/schedule_entry/${schedule_entry_id}`,
      'PUT'
    ),
  deleteScheduleEntry: (schedule_entry_id: number) =>
    makeApiQuery<never, any>(
      `api/v1/apps/cohab/schedule_entry/${schedule_entry_id}`,
      'DELETE'
    ),

  sendGroupInvitation: makeApiQuery<
    { invitee_email: string },
    { success: boolean }
  >('api/v1/apps/cohab/group/invition/send', 'POST'),
  acceptGroupInvitation: makeApiQuery<
    { group_invitation_id: number },
    { success: boolean }
  >('api/v1/apps/cohab/group/invition/reply', 'POST'),
  getDataChanges: makeApiQuery<
    never,
    { data: { user_changes: any[]; data_changes: any[] } }
  >('api/v1/apps/cohab/changes'),
}

// TODO ADD Satisfy type condition
