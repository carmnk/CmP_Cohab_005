import { Box, Chip, Typography } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { formatUserName } from "../utils/formatUserName";
import { useCallback, useMemo } from "react";
import { Flex } from "@cmk/fe_utils";

export type TasksSectionProps = {
  data: any;
};
declare const BASE_URL: string;

export const SchedulesSection = (props: TasksSectionProps) => {
  const { data } = props;
  const tasks = data?.tasks;
  const groupMembers = data?.user?.groups?.[0].group_members;

  const navigateRaw = useNavigate();
  const navigate = useCallback(
    (to: string) => {
      const toAdj = to.startsWith("/") ? to.slice(1) : to;
      const destination = BASE_URL + toAdj;
      console.log("navigate", to, "toAdj", toAdj, "destination", destination);
      navigateRaw(destination);
    },
    [navigateRaw]
  );

  const privateTasks = useMemo(() => {
    return tasks.filter((task) => !task?.owner_group_id);
  }, [tasks]);
  const groupTasks = useMemo(() => {
    return tasks.filter((task) => task?.owner_group_id);
  }, [tasks]);

  return (
    <Typography>*COMING SOON* </Typography>
    // <Box minHeight="8rem" mt="1rem">
    //   {/* <Typography variant="h6">Tasks</Typography> */}

    //   <Flex gap={2}>
    //     <Typography>My Personal Tasks ({privateTasks.length})</Typography>
    //     <Box>
    //       <Typography>
    //         open: (
    //         {privateTasks.filter((task) => task.task_status === "open")?.length}
    //         )
    //       </Typography>
    //       <Typography>overdue: ( COMING SOON* )</Typography>
    //     </Box>
    //   </Flex>
    //   <Flex gap={2}>
    //     <Typography>Group Tasks ({groupTasks.length})</Typography>
    //     <Box>
    //       <Typography>
    //         open: (
    //         {groupTasks.filter((task) => task.task_status === "open")?.length})
    //       </Typography>
    //       <Typography>overdue: ( COMING SOON* )</Typography>
    //     </Box>
    //   </Flex>
    // </Box>
  );
};
