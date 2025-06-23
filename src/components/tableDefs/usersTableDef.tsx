import { Button } from '@cmk/fe_utils'
import { formatUserName } from '../../utils/formatUsername'
import { mdiStar, mdiDotsVertical } from '@mdi/js'
import { Tooltip, Badge } from '@mui/material'
import Icon from '@mdi/react'

export const usersTableDef = (data: any) => {
  const groupMembers = data?.user?.groups?.[0]?.group_members ?? []
  return {
    data: groupMembers, //[{ column1: "ABCD", column2: "EFGH" }],
    columns: [
      {
        // sortKey: "name",
        // filterKey: "column1",
        header: 'Name',
        renderCell: (item) => <td>{formatUserName(item)}</td>,
      },
      {
        // sortKey: "email",
        // filterKey: "column1",
        header: 'Email',
        renderCell: 'email',
      },
      {
        // sortKey: "email",
        // filterKey: "column1",
        style: { width: '4rem' },
        header: '',
        renderCell: (item) => (
          <td>
            <Tooltip
              title={
                data?.user?.groups?.[0].group_admin_user_id === item.user_id &&
                'Group Admin'
              }
              placement="top"
              arrow
            >
              <Badge
                badgeContent={
                  data?.user?.groups?.[0].group_admin_user_id ===
                    item.user_id && (
                    <Icon path={mdiStar} size={0.75} color="orange" />
                  )
                }
              >
                <img
                  src={item.photo_url}
                  width={32}
                  style={{ borderRadius: 9999, marginLeft: '1rem' }}
                />
              </Badge>
            </Tooltip>
          </td>
        ),
      },
      {
        // sortKey: "email",
        // filterKey: "column1",
        style: { width: '2rem' },
        header: '',
        renderCell: (item) => (
          <td>
            <Button variant="outlined" iconButton icon={mdiDotsVertical} />
          </td>
        ),
      },
    ],
  }
}
