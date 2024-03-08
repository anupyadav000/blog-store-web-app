import { initialState } from "../state/State";
export const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SetLoggedIn":
      return {
        ...state,
        isLogin: action.isLogin,
      };
    case "SetUser":
      return {
        ...state,
        user: action.user,
      };
    case "SetAllBlogs": {
      return {
        ...state,
        allBlogs: action.allBlogs,
      };
    }
    case "AddInAllBlogs": {
      return {
        ...state,
        allBlogs: [...state.allBlogs, action.blog],
      };
    }
    case "SetUserBlogs": {
      return {
        ...state,
        userBlogs: action.userBlogs,
      };
    }
    case "AddInUserBlogs": {
      return {
        ...state,
        userBlogs: [...state.userBlogs, action.blog],
      };
    }
    default:
      return state;
  }
};
