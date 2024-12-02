import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { userReducer } from './entity/user/slice'

const rootReducer = combineReducers({
    user: userReducer
})

const persistConfig = {
    key: "root",
   storage,
  };


const persistedReducer = persistReducer(persistConfig, rootReducer);
//В приведенном выше коде мы заменили значение свойства reducer в хранилище с userReducer на persistedReducer, 
//что является расширенным редуктором с конфигурацией для сохранения userReducer состояния в локальном хранилище
  
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
 getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        //Redux Persist автоматически настраивает некоторое промежуточное ПО, 
        //которое может приводить к появлению несериализуемых значений при повторном заполнении в консоли.
      },
    }),
});

export const persistor = persistStore(store)
//С помощью этой функции наш store будет сохранён в локальном хранилище, и даже после обновления браузера наши данные останутся.

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch