const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;

  res.status(404).send({ msg: "Not authorized to access this route" });
};

export default checkPermission;
