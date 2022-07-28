const INITIAL_DATA = {
  title: [],
  header: "Sukanta",
};

const DashboardReducer = (state = INITIAL_DATA, action) => {
  switch (action.type) {
    case "SHOW_CLIENT": {
      //   const title = action.payload;
      console.log("()()()()(()", action.payload);
      //   return (state.title = title);
      return state.header;
    }
    default:
      return state;
  }
};

export default DashboardReducer;
