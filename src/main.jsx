import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import 'react-toastify/dist/ReactToastify.css'
import './index.css'

import { ToastContainer } from 'react-toastify'

import { Provider } from 'react-redux'
import { store, persistor } from './store.js'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    <ToastContainer position='top-center' autoClose={1500} />
  </Provider>
)
