const INITIAL_DATA = {
  title: [],
  header: "Client",
};

const HeaderReducer = (state = INITIAL_DATA, action) => {
  switch (action.type) {
    case "SHOW_CLIENT": {
      console.log("()()()()(()", action.payload);

      return state.header;
    }
    case "CHANGE_HEADER": {
      return state.header;
    }
    default:
      return state;
  }
};

export default HeaderReducer;
