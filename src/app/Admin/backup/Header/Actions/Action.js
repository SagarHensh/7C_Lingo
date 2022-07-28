export const showClientHeader = (data) => {
  return {
    type: "SHOW_CLIENT",
    payload: data,
  };
};

export const changeHeader = (data) => {
  return {
    type: "CHANGE_HEADER",
    payload: data,
  };
};
