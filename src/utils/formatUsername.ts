export const formatUserName = (user: any) => {
  return (
    user?.user_name ||
    (user?.first_name
      ? user?.first_name + (user?.last_name ? " " + user?.last_name : "")
      : "")
  );
};
