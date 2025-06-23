import { Box } from "@mui/material";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type UserImageProps = {
  src?: string;
};
declare const BASE_URL: string;
const pointerCursor = {
        cursor: "pointer",
      }

export const UserImageComponent = (props: UserImageProps) => {
  const { src } = props;

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
  return (
    <Box
      borderRadius={9999}
      key="user-image-box"
      width={32}
      height={32}
      overflow={"hidden"}
      border="1px solid #333"
      onClick={() => navigate("/users")}
      sx={pointerCursor}
    >
      <img src={src} alt="User Image" width={32} />
    </Box>
  );
};
export const UserImage = memo(UserImageComponent);
