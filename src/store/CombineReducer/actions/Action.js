export const valueChange = (path) => {
  // console.log("from action>>>>>", path);
  return {
    type: "CHANGE_VALUE",
    payload: path
  };
};
