export const SAVE_COLUMN_STATE = 'SAVE_COLUMN_STATE'

export const saveColumnState = (columnState) => {
    return (dispatch) => {
        dispatch({
            type: SAVE_COLUMN_STATE,
            payload:columnState
        })
        
    }
}