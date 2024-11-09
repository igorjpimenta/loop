import { API_URL } from '../config'

import axios from 'axios'

axios.defaults.baseURL = `${API_URL}/api`
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
