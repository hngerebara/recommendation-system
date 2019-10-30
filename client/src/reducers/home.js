export default (state={articles: []}, action) => {
    switch(action.type) {
      case 'HOME_PAGE_LOADED':
        return {
          ...state,
          articles: action.data.message,
        };
      default:
        return state;
    }
  };