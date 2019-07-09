export const ADD_TODO = 'ADD_TODO'

export const addNewToDo = (newTodo) => {
    return {
        type:ADD_TODO,
        payload: newTodo
    }
}