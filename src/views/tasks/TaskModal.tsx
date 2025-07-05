import {
  Button,
  Checkbox,
  CSelect2,
  CTextField,
  CTreeView,
  DropdownMenu,
  Flex,
  Modal,
} from '@cmk/fe_utils'
import {
  Avatar,
  Box,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { formatUserName } from '../../utils/formatUsername'
import { CDateTimePicker } from '../../components/DateTimePicker'
import moment, { Moment } from 'moment'
import { AppControllerData } from '../../appController/types/appControllerData'
import { getUserInitials } from '../../utils/getUserInitials'
import {
  mdiAccount,
  mdiAccountGroup,
  mdiChevronDoubleRight,
  mdiDelete,
  mdiFileTree,
  mdiFilter,
  mdiFilterOff,
  mdiOpenInNew,
  mdiPencil,
  mdiPlus,
} from '@mdi/js'
import Icon from '@mdi/react'
import { AddTaskTreeItem } from './AddTaskTreeItem'
import { Task } from '../../appController/types/tasks'
import { AppControllerActions } from '../../appController/useAppControllerActions'
import { CAvatar } from '../../components/CAvatar'

const taskStatusValues = ['open', 'completed']
const taskStatusOptions = taskStatusValues.map((val) => ({
  value: val,
  label: val,
  textLabel: val,
}))

const defaultTaskData: Omit<Task, 'task_id'> = {
  task_name: '',
  task_description: '',
  owner_user_id: 'null' as any,
  owner_group_id: 'null' as any,
  task_status: 'open',
  task_editors_user_ids: [],
  task_editor_user_id: null as any,
  due_datetime: null,
  parent_task_id: null as any,
  created_at: null as any,
}

export type TaskModalProps = {
  data: AppControllerData
  open: boolean
  onClose: () => void
  createOrEditTask: AppControllerActions['createOrEditTask']
  deleteTask: AppControllerActions['deleteTask']
  onSwitchTask: (newTaskId: number) => void
  task_id?: number
}

const getRecursiveParentTaskIds = (task_id: number, tasks: Task[]) => {
  const task = tasks?.find((t) => t.task_id === task_id)
  const parentId = task?.parent_task_id
  const recursiveTasks = parentId
    ? getRecursiveParentTaskIds(parentId, tasks)
    : []
  return [parentId, ...recursiveTasks]
}

const formatFormData = (formDataIn: any) => ({
  ...formDataIn,
  owner_group_id:
    formDataIn.owner_group_id === 'null' ? null : formDataIn.owner_group_id,
  owner_user_id:
    formDataIn.owner_user_id === 'null' ? null : formDataIn.owner_user_id,
  // due_datetime:
  //   formDataIn.formDataIn !== null ? moment(formDataIn.formDataIn : null,
})
const validateFormData = (formData: Task) => {
  if (
    ['task_name', 'owner_user_id', 'task_status'].find(
      (fieldName) => !formData[fieldName]
    )
  ) {
    return false
  }
  if (
    formData?.due_datetime !== null &&
    !moment(formData?.due_datetime).isValid()
  )
    return false
  return true
}

const getInitialFormData = (task?: Task | null) =>
  task
    ? ({
        ...task,
        due_datetime:
          typeof task?.due_datetime === 'string'
            ? moment(task?.due_datetime)
            : task?.due_datetime,
      } as unknown as Task)
    : defaultTaskData

export const TaskModal = (props: TaskModalProps) => {
  const {
    data,
    open,
    onClose,
    createOrEditTask,
    task_id,
    deleteTask,
    onSwitchTask,
  } = props
  const theme = useTheme()
  const isMinSmViewport = useMediaQuery(theme.breakpoints.up('sm'))
  const isMinLgViewport = useMediaQuery(theme.breakpoints.up('lg'))
  const groups = data?.user?.groups
  const groupMembers = groups?.[0]?.group_members
  const [ui, setUi] = useState({
    isEditorSelectOpen: false,
    isGroupSelectOpen: false,
    showOnlyOpenSubtasks: false,
  })

  const existingTask = useMemo(
    () =>
      (!!task_id && data?.tasks?.find((task) => task.task_id === task_id)) ||
      null,
    [task_id, data?.tasks]
  )

  const [formData, setFormData] = useState<Task>(
    getInitialFormData(existingTask) as Task
  )
  const editorRef = useRef(null)
  const groupSelectRef = useRef(null)

  const handleToggleShowOnlyOpenSubtasks = useCallback(() => {
    setUi((current) => ({
      ...current,
      showOnlyOpenSubtasks: !current?.showOnlyOpenSubtasks,
    }))
  }, [])

  const handleToggleEditorSelectOpen = useCallback(() => {
    setUi((current) => ({
      ...current,
      isEditorSelectOpen: !current?.isEditorSelectOpen,
    }))
  }, [])
  const handleToggleGroupSelectOpen = useCallback(() => {
    setUi((current) => ({
      ...current,
      isGroupSelectOpen: !current?.isGroupSelectOpen,
    }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const formDataAdj = formatFormData(formData)
    if (!task_id) {
      formDataAdj.owner_user_id = data?.user?.user_id
    }
    if (!validateFormData(formDataAdj)) {
      alert('Formdata incomplete')
      return
    }
    if (formDataAdj?.due_datetime) {
      formDataAdj.due_datetime = moment(formDataAdj.due_datetime).format(
        'YYYY-MM-DDTHH:mm:00.000Z'
      )
    }

    await createOrEditTask?.(formDataAdj)
  }, [formData, createOrEditTask, data?.user, task_id])

  const handleChange = useCallback((newValue: string, e: any) => {
    const name = e?.target?.name
    setFormData((current) => ({ ...current, [name]: newValue }))
  }, [])

  const ownerGroupsOptions = useMemo(() => {
    return [
      { value: 'null', label: 'Only You', icon: mdiAccount },
      ...(groups?.map?.((gr) => ({
        value: gr.group_id,
        label: gr.group_name || 'Your Group (unnamed)',
        icon: mdiAccountGroup,
      })) ?? []),
    ]
  }, [groups])

  // const handleChangeOwnerGroup = useCallback(
  //   (newValue: string, e: any) => {
  //     const name = e?.target?.name
  //     setFormData((current) => ({
  //       ...current,
  //       [name]: newValue,
  //       task_editors_user_ids:
  //         newValue === 'null'
  //           ? current.task_editors_user_ids.filter(
  //               (id) => id === data?.user?.user_id
  //             )
  //           : current.task_editors_user_ids,
  //       task_editor_user_id:
  //         newValue === 'null' &&
  //         current.task_editor_user_id !== data?.user?.user_id
  //           ? (data?.user?.user_id as number)
  //           : current.task_editor_user_id,
  //     }))
  //   },
  //   [data?.user]
  // )
  // const handleChangeArray = useCallback((newValue: string[], e: any) => {
  //   const name = e?.target?.name
  //   setFormData((current) => ({ ...current, [name]: newValue }))
  // }, [])

  const handleChangeDate = useCallback((newValue: Moment) => {
    setFormData((current) => ({ ...current, due_datetime: newValue as any }))
  }, [])

  const createUser = useMemo(() => {
    const groupMember = groupMembers?.find(
      (mem) =>
        mem.user_id ===
        (formData?.task_id
          ? (formData?.owner_user_id as any)
          : data?.user?.user_id)
    )
    return groupMember
  }, [groupMembers, formData?.task_id, formData?.owner_user_id, data?.user])

  const editorUser = useMemo(() => {
    const groupMember = groupMembers?.find(
      (mem) => mem.user_id === formData?.task_editor_user_id
    )
    return groupMember
  }, [groupMembers, formData?.task_editor_user_id])

  const metaFields = useMemo(
    () => (
      <Box>
        <Box
          display="grid"
          gridTemplateColumns="auto auto auto"
          alignItems="center"
          alignContent="center"
          justifyItems="center"
          mb="0.5rem"
        >
          <Typography variant="caption">In Charge</Typography>
          <Typography variant="caption">Group</Typography>
          <Typography variant="caption">Created</Typography>

          <CAvatar
            ref={editorRef}
            user={editorUser}
            size={42}
            sx={{
              // background: editorUser?.user_color,
              width: 42,
              height: 42,
              fontSize: '1.7rem',
              cursor: 'pointer',
            }}
            onClick={handleToggleEditorSelectOpen}
          />
          <Button
            iconButton
            icon={
              formData.owner_group_id &&
              (formData.owner_group_id as any) !== 'null'
                ? mdiAccountGroup
                : mdiAccount
            }
            variant="outlined"
            borderRadius={999}
            color="inherit"
            ref={groupSelectRef}
            onClick={handleToggleGroupSelectOpen}
          />
          <CAvatar user={createUser} />
        </Box>

        <Box maxWidth={190} mt="0.25rem">
          <Typography variant="caption" component="label" display="block">
            Due Datetime
          </Typography>
          <CDateTimePicker
            format="DD.MM.YYYY HH:mm"
            slotProps={{
              textField: {
                // name: 'due_datetime',
                variant: 'outlined',
                size: 'small',
                slotProps: { input: { name: 'due_datetime' } },
              },
            }}
            // name="due_datetime"
            // label="Due Datetime"
            value={formData?.due_datetime as any}
            onChange={handleChangeDate}
          />
        </Box>
        <Box mt="0.25rem">
          <CSelect2
            options={taskStatusOptions}
            name="task_status"
            label="Task Status"
            value={formData.task_status}
            size="small"
            onChange={handleChange}
          />
        </Box>
        {/* <CSelect2
              name="owner_group_id"
              label="Group"
              value={formData.owner_group_id ?? ''}
              options={ownerGroupsOptions}
              size="small"
              onChange={handleChangeOwnerGroup}
              disableHelperText
            /> */}
      </Box>
    ),
    [
      createUser,
      editorUser,
      formData?.due_datetime,
      formData.owner_group_id,
      formData.task_status,
      handleChange,
      handleChangeDate,
      handleToggleEditorSelectOpen,
      handleToggleGroupSelectOpen,
    ]
  )

  const editorUserDropdownItemOptions = useMemo(
    () =>
      groupMembers?.map((member) => ({
        id: member.user_id as any,
        label: (
          <Typography component="div" pl={'0.25rem'}>
            {formatUserName(member)}
          </Typography>
        ),
        value: member.user_id,
        icon: (
          <CAvatar
            size={32}
            user={member}
            sx={{
              fontSize: '1.0rem',
              cursor: 'pointer',
            }}
          />
        ) as any,
        onClick: () => {
          handleChange(member?.user_id as any, {
            target: { name: 'task_editor_user_id' },
          })
        },
      })) ?? [],
    [groupMembers, handleChange]
  )

  const groupDropdownItemOptions = useMemo(
    () =>
      ownerGroupsOptions?.map((gr) => ({
        id: gr.value as any,
        label: (
          <Typography component="div" pl={'0.25rem'}>
            {gr.label}
          </Typography>
        ),
        value: gr.value,
        icon: gr?.icon as any,
        onClick: () => {
          handleChange(gr.value as any, {
            target: { name: 'owner_group_id' },
          })
        },
      })) ?? [],
    [ownerGroupsOptions, handleChange]
  )

  const handleSubmitNewTask = useCallback(
    (task_name, parent_task_id) => {
      console.log(
        'Please create a new task with task_name: ',
        task_name,
        ' and parent_id: ',
        parent_task_id
      )
      const newTask: Omit<Task, 'task_id' | 'created_at'> = {
        task_name,
        task_description: '',
        task_status: 'open',
        due_datetime: null,
        parent_task_id,
        task_editors_user_ids: [],
        task_editor_user_id: data?.user?.user_id as number,
        owner_user_id: data?.user?.user_id as number,
        owner_group_id: null,
      }
      createOrEditTask(newTask as Task, true)
    },
    [createOrEditTask, data?.user]
  )

  const handleToggleTaskStatus = useCallback(
    (task_id) => {
      const task = data?.tasks?.find((t) => t.task_id === task_id)
      if (!task) {
        return
      }
      createOrEditTask(
        {
          ...task,
          task_status: task?.task_status === 'open' ? 'completed' : 'open',
        },
        true
      )
    },
    [createOrEditTask, data?.tasks]
  )

  const getRecursiveSubtasks = useCallback(
    (parent_id: number | null, toggleTaskStatus: (task_id: number) => void) => {
      const parentTaskId = parent_id ?? task_id
      const subTasks =
        (parentTaskId &&
          data?.tasks?.filter(
            (task) =>
              task?.parent_task_id === parentTaskId &&
              (!ui?.showOnlyOpenSubtasks || task?.task_status === 'open')
          )) ||
        []
      const subTaskTreeItems = subTasks
        ?.sort?.((a, b) => a?.task_id - b?.task_id)
        ?.map?.((task) => ({
          ...task,
          _parentId: parent_id,
          nodeId: task?.task_id,
          itemId: task?.task_id,
          labelText: (
            <Flex alignItems="center">
              <Checkbox
                sx={{ ml: '0.5rem' }}
                value={task?.task_status === 'completed'}
                size="small"
                onClick={() => task?.task_id && toggleTaskStatus(task?.task_id)}
              />
              <Typography overflow="hidden" textOverflow="ellipsis">
                {task?.task_name}
              </Typography>
            </Flex>
          ) as any,
          children: getRecursiveSubtasks(task?.task_id, toggleTaskStatus),
        }))
      return subTaskTreeItems
    },
    [task_id, data?.tasks, ui?.showOnlyOpenSubtasks]
  )

  const recursiveSubTasks = useMemo(
    () => getRecursiveSubtasks(null, handleToggleTaskStatus),
    [getRecursiveSubtasks, handleToggleTaskStatus]
  )

  // const subTasks = useMemo(
  //   () =>
  //     (task_id &&
  //       data?.tasks?.filter((task) => task?.parent_task_id === task_id)) ||
  //     [],
  //   [task_id, data?.tasks]
  // )
  const subTasksTreeItems = recursiveSubTasks

  useEffect(() => {
    if (!task_id) {
      return
    }
    setFormData(getInitialFormData(existingTask) as Task)
  }, [task_id])

  const recursiveParentTasks = useMemo(
    () =>
      task_id &&
      [task_id, ...getRecursiveParentTaskIds(task_id, data?.tasks)]
        ?.map?.((taskId) =>
          data?.tasks?.find((task) => task.task_id === taskId)
        )
        ?.filter((val) => val)
        .reverse(),
    [task_id, data?.tasks]
  )

  const scrollDown = useCallback(() => {
    const element = document.querySelector('.MuiDialogContent-root')
    element?.scrollTo(0, element?.scrollHeight)
  }, [[]])

  useEffect(() => {
    scrollDown?.()
  }, [data?.tasks, scrollDown])

  return (
    <Modal
      header={
        <Box>
          <Flex alignItems="center" gap="1rem" height="1.5rem">
            <Typography variant="h6">
              {task_id ? 'Edit Task' : 'Add Task'}
            </Typography>
            <Box>
              {task_id && (
                <Flex
                  alignItems="center"
                  gap={'0.25rem'}
                  // mt={'-1.2rem'}
                  // mb="2rem"
                >
                  {recursiveParentTasks &&
                    recursiveParentTasks?.map((task, tIdx) => (
                      <Fragment key={task?.task_id}>
                        <Chip
                          label={task?.task_name}
                          size="small"
                          color={
                            tIdx === recursiveParentTasks?.length - 1
                              ? 'primary'
                              : 'default'
                          }
                          onClick={() =>
                            (tIdx !== recursiveParentTasks?.length - 1 &&
                              task?.task_id &&
                              onSwitchTask(task?.task_id)) ||
                            undefined
                          }
                        />
                        {/* {tIdx === recursiveParentTasks?.length - 1 ? (
                    <Chip
                      label={task?.task_name}
                      size="small"
                      color="primary"
                    />
                  ) : (
                    <Typography>{task?.task_name}</Typography>
                  )} */}
                        {tIdx !== recursiveParentTasks?.length - 1 && (
                          <Icon path={mdiChevronDoubleRight} size={0.5} />
                        )}
                      </Fragment>
                    ))}
                </Flex>
              )}
            </Box>
          </Flex>
          <Flex
            mt="1rem"
            alignItems="flex-start"
            justifyContent="space-between"
            gap="2rem"
          >
            <Box flex={1}>
              {/* <Typography variant="h6"> */}

              {/* </Typography> */}
              <Box>
                <CTextField
                  name="task_name"
                  label="Task Name"
                  value={formData.task_name}
                  size="small"
                  onChange={handleChange}
                />
              </Box>
              {!isMinSmViewport && <Box mt="0.0rem">{metaFields}</Box>}
              <Box>
                <CTextField
                  name="task_description"
                  label="Task Description"
                  value={formData.task_description}
                  multiline
                  minRows={3}
                  size="small"
                  onChange={handleChange}
                />
              </Box>
            </Box>

            {isMinSmViewport && metaFields}
          </Flex>
          <Flex mb={'0.25rem'} alignItems="center" gap="1rem">
            <Typography>Subtasks ({recursiveSubTasks?.length ?? 0})</Typography>
            <Button
              borderRadius={9999}
              label={
                // ui?.showOnlyOpenSubtasks ?
                'Only Open Tasks'
              }
              icon={ui?.showOnlyOpenSubtasks ? mdiFilterOff : mdiFilter}
              size="small"
              color={ui?.showOnlyOpenSubtasks ? 'primary' : 'inherit'}
              onClick={handleToggleShowOnlyOpenSubtasks}
            />
          </Flex>
        </Box>
      }
      open={open}
      width={640}
      isConfirmation
      onConfirm={handleSubmit}
      onClose={onClose}
      disableCloseOnConfirmation
      confirmationLabel="Save"
      minHeight={task_id ? '97dvh' : undefined}
    >
      <Stack height="100%">
        <Box
          overflow={'auto'}
          width="100%"
          // height="calc(100% - 10rem)"
          mt={'-1rem'}
          sx={{ '& .MuiSimpleTreeView-root': { maxWidth: 'none' } }}
        >
          {task_id ? (
            <Box
              // maxHeight={
              //   isMinLgViewport ? '540px' : isMinSmViewport ? '320px' : '220px'
              // }
              flex={1}
              overflow="auto"
            >
              <CTreeView
                items={subTasksTreeItems}
                actions={(item) =>
                  item?.insertItem
                    ? []
                    : [
                        // {
                        //   label: 'open',

                        //   icon: mdiOpenInNew,
                        //   variant: 'outlined',
                        //   action: () => {
                        //     console.log('SHOULD SWITCH TASK', item)
                        //     onSwitchTask(item?.task_id)
                        //   },
                        //   tooltip: 'open subtask as maintask',
                        // },
                        {
                          label: 'create subtask',
                          variant: 'outlined',
                          icon: (
                            <Box
                              position="relative"
                              top={0}
                              height={24}
                              width={24}
                              overflow="hidden"
                              // onClick={() =>
                              //   handleSubmitNewTask('New Task', item?.task_id)
                              // }
                            >
                              <Box
                                position="absolute"
                                top={-2}
                                left={2}
                                height={24}
                              >
                                <Icon path={mdiFileTree} size={0.85} />
                              </Box>
                              <Box
                                position="absolute"
                                top={-13}
                                left={12}
                                height={24}
                              >
                                <Icon path={mdiPlus} size={0.5} />
                              </Box>
                            </Box>
                          ) as any,
                          action: () => {
                            handleSubmitNewTask('New Task', item?.task_id)
                          },
                          tooltip: 'create another subtask',
                        },
                        {
                          label: 'delete',

                          icon: mdiDelete,
                          variant: 'outlined',
                          action: () => {
                            deleteTask(item?.task_id)
                          },
                          tooltip: 'delete subtask',
                        },
                        {
                          label: 'edit',

                          icon: mdiPencil,
                          variant: 'outlined',
                          action: () => {
                            console.log('SHOULD SWITCH TASK', item)
                            onSwitchTask(item?.task_id)
                          },
                          tooltip: 'edit subtask',
                        },
                      ]
                }
              />
              <AddTaskTreeItem
                parent_task_id={task_id as number}
                onSubmitNewTask={handleSubmitNewTask}
                // onFocus={subTasksscrollContainerRef}
              />
            </Box>
          ) : (
            <Typography>Please save the tasks first</Typography>
          )}
        </Box>
      </Stack>
      <DropdownMenu
        open={ui.isEditorSelectOpen}
        onClose={handleToggleEditorSelectOpen}
        anchorEl={editorRef.current}
        items={editorUserDropdownItemOptions}
      />
      <DropdownMenu
        open={ui.isGroupSelectOpen}
        onClose={handleToggleGroupSelectOpen}
        anchorEl={groupSelectRef.current}
        items={groupDropdownItemOptions}
      />
    </Modal>
  )
}
