import { CSelect2, CTextField, Modal, MultiSelect } from "@cmk/fe_utils";
import { Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { formatUserName } from "../utils/formatUserName";

const taskStatusValues = ["open", "completed"];
const taskStatusOptions = taskStatusValues.map((val) => ({
  value: val,
  label: val,
  textLabel: val,
}));

export type Task = {
  task_id?: number;
  task_name: string;
  task_description: string;
  owner_user_id: string | null;
  owner_group_id: string | null;
  task_status: string;
  task_editors_user_ids: number[];
};
const defaultTaskData: Task = {
  task_name: "",
  task_description: "",
  owner_user_id: "null",
  owner_group_id: "null",
  task_status: "open",
  task_editors_user_ids: [],
};

export type TaskModalProps = {
  data: any;
  open: boolean;
  onClose: () => void;
  onConfirm: (formData: Task) => Promise<void>;
  task_id?: number;
};

const formatFormData = (formDataIn: any) => ({
  ...formDataIn,
  owner_group_id:
    formDataIn.owner_group_id === "null" ? null : formDataIn.owner_group_id,
  owner_user_id:
    formDataIn.owner_user_id === "null" ? null : formDataIn.owner_user_id,
});
const validateFormData = (formData: Task) => {
  if (
    ["task_name", "owner_user_id", "task_status"].find(
      (fieldName) => !formData[fieldName]
    )
  ) {
    return false;
  }
  return true;
};

export const TaskModal = (props: TaskModalProps) => {
  const { data, open, onClose, onConfirm, task_id } = props;
  const groups = data?.user?.groups;
  const groupMembers = groups?.[0]?.group_members;

  const initialFormData = task_id
    ? data?.tasks?.find((task) => task.task_id === task_id) || defaultTaskData
    : defaultTaskData;
  const [formData, setFormData] = useState<Task>(initialFormData);

  const ownerGroupsOptions = useMemo(() => {
    return [
      { value: "null", label: "Only You" },
      ...(groups?.map?.((gr) => ({
        value: gr.group_id,
        label: gr.group_name || "Your Group (unnamed)",
      })) ?? []),
    ];
  }, [groups]);

  const groupMemberOptions = useMemo(() => {
    return [
      ...(groupMembers
        ?.map?.((mem) => ({
          value: mem.user_id,
          label: formatUserName(mem),
        }))
        .filter(
          (member) =>
            formData?.owner_group_id !== "null" ||
            member.value === data?.user?.user_id
        ) ?? []),
    ];
  }, [groupMembers, data?.user, formData?.owner_group_id]);

  const handleSubmit = useCallback(async () => {
    const formDataAdj = formatFormData(formData);
    if (!task_id) {
      formDataAdj.owner_user_id = data?.user?.user_id;
    }
    if (!validateFormData(formDataAdj)) {
      alert("Formdata incomplete");
      return;
    }

    console.log("submit", formData, formDataAdj);
    await onConfirm?.(formDataAdj);
  }, [formData, onConfirm, data?.user, task_id]);

  const handleChange = useCallback((newValue: string, e: any) => {
    const name = e?.target?.name;
    setFormData((current) => ({ ...current, [name]: newValue }));
  }, []);
  const handleChangeOwnerGroup = useCallback(
    (newValue: string, e: any) => {
      const name = e?.target?.name;
      setFormData((current) => ({
        ...current,
        [name]: newValue,
        task_editors_user_ids:
          newValue === "null"
            ? current.task_editors_user_ids.filter(
                (id) => id === data?.user?.user_id
              )
            : current.task_editors_user_ids,
      }));
    },
    [data?.user]
  );
  const handleChangeArray = useCallback((newValue: string[], e: any) => {
    const name = e?.target?.name;
    setFormData((current) => ({ ...current, [name]: newValue }));
  }, []);

  return (
    <Modal
      header={task_id ? "Edit Task" : "Add Task"}
      open={open}
      width={640}
      isConfirmation
      onConfirm={handleSubmit}
      onClose={onClose}
      disableCloseOnConfirmation

      // maxWidth="calc(100% - 0rem) !important"
    >
      <Box>
        <CTextField
          name="task_name"
          label="Task Name"
          value={formData.task_name}
          size="small"
          onChange={handleChange}
        />
        <CTextField
          name="task_description"
          label="Task Description"
          value={formData.task_description}
          multiline
          minRows={3}
          size="small"
          onChange={handleChange}
        />
        {formData?.task_id && (
          <CTextField
            label="owner_user_id"
            disabled
            value={formData?.owner_user_id as any}
            size="small"
            onChange={handleChange}
          />
        )}
        <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={2}>
          <CSelect2
            name="owner_group_id"
            label="Group"
            value={formData.owner_group_id ?? ""}
            options={ownerGroupsOptions}
            size="small"
            onChange={handleChangeOwnerGroup}
          />
          <CSelect2
            options={taskStatusOptions}
            name="task_status"
            label="Task Status"
            value={formData.task_status}
            size="small"
            onChange={handleChange}
          />
          <MultiSelect
            options={groupMemberOptions}
            name="task_editors_user_ids"
            label="Task Editors"
            value={formData?.task_editors_user_ids}
            size="small"
            onChange={handleChangeArray}
          />
        </Box>
      </Box>
    </Modal>
  );
};
