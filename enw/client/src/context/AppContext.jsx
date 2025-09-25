import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  theme: 'light',
  language: 'en',
  user: null,
  notifications: [],
};

// Action types
const ActionTypes = {
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_USER: 'SET_USER',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case ActionTypes.SET_LANGUAGE:
      return { ...state, language: action.payload };
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setTheme: (theme) =>
      dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
    setLanguage: (language) =>
      dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language }),
    setUser: (user) => dispatch({ type: ActionTypes.SET_USER, payload: user }),
    addNotification: (notification) =>
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          id: Date.now(),
          ...notification,
        },
      }),
    removeNotification: (id) =>
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export { ActionTypes };
