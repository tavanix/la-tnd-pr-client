import { configureStore } from '@reduxjs/toolkit'

import userReducer from './features/user/userSlice'
import employeesReducer from './features/employees/employeesSlice'

import storage from 'redux-persist/lib/storage'
import storageSession from 'redux-persist/lib/storage/session'

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { combineReducers } from 'redux'

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['employees'],
}

const rootReducer = combineReducers({
  userState: userReducer,
  employeesState: employeesReducer,
})

const appReducer = (state, action) => {
  if (action.type === 'user/logout') {
    // 👉 вручную чистим persist-данные
    storage.removeItem('persist:root')
    return rootReducer(undefined, action)
  }
  return rootReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, appReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Игнорируем экшены redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
