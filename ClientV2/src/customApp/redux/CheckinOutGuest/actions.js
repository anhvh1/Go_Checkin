const actions = {
  GUEST_GET_DATA_REQUEST: 'GUEST_GET_DATA_REQUEST',
  GUEST_GET_DATA_REQUEST_SUCCESS: 'GUEST_GET_DATA_REQUEST_SUCCESS',
  GUEST_GET_DATA_REQUEST_ERROR: 'GUEST_GET_DATA_REQUEST_ERROR',
  getInitData: (filterData) => {
    return (disPatch) => {
      disPatch({
        type: actions.GUEST_GET_DATA_REQUEST,
        payload: {filterData}
      });
    }
  }
};
export default actions;