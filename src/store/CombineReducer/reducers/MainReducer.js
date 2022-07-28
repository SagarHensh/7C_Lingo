const INITIAL_STATE = {
  title: [],
  header: "Client",
  imagePath : ""
};

const MainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CHANGE_VALUE": {
      return {
        ...state,
        // header: action.payload,
        imagePath : action.payload
      };
    }
    default:
      return state;
  }
};

export default MainReducer;
