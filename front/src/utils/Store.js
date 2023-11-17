import { configureStore } from '@reduxjs/toolkit'
import logfetch from '../features/loginslice'
import  userinfo  from '../features/userinfo'

const reduxDevtools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()



const store = configureStore({

    reducer :{
        log : logfetch ,
        userinfo: userinfo }

},reduxDevtools)

export default store