import { push } from 'connected-react-router'

import { api, forms } from 'redux-restify'

import modals, { MODAL_SIZES } from '$trood/modals'

import mainConfig from '$trood/config'

import { STATE_REPLACE_ACTION } from '$trood/mainConstants'
import {
  setToken,
  clearStorage,
  clearToken,
} from '$trood/storage'

import { LOGIN_PAGE_URL, AUTH_MESSAGES } from './constants'

import {
  AUTH_API_NAME,
  LOGOUT_ENDPOINT,
  RECOVERY_ENDPOINT,
  VERIFY_TOKEN_ENDPOINT,
} from '$trood/authApiUrlSchema'


export const updateLinkedObject = (modelName, model) => dispatch => {
  dispatch(api.actions.entityManager[modelName].updateById(model.id, model))
  return model.id
}

const setAuthData = (data) => (dispatch) => {
  const { linkedObject } = mainConfig.services.auth
  const formattedResponse = Object.keys(data).reduce((memo, key) => {
    if (key === 'linkedObject') {
      const linkedObjectId = dispatch(updateLinkedObject(linkedObject, data[key]))
      return {
        ...memo,
        [key]: linkedObjectId,
      }
    }
    return {
      ...memo,
      [key]: data[key],
    }
  }, {})
  dispatch(forms.actions.authDataForm.changeSomeFields(formattedResponse))
}

export const login = (nextUrl = '/') => dispatch => {
  dispatch(forms.actions.authForm.submit()).then(({ data, status }) => {
    if (status === 200) {
      dispatch(setAuthData(data.data))
      setToken(data.data.token)
      dispatch(push(nextUrl))
    }
  })
}

export const recovery = (token) => (dispatch, getState) => {
  const recoveryForm = forms.selectors.recoveryForm.getForm(getState())
  dispatch(forms.actions.sendQuickForm({
    apiName: AUTH_API_NAME,
    endpoint: RECOVERY_ENDPOINT,
    method: token ? 'patch' : 'post',
    defaults: {
      token,
      ...recoveryForm,
    },
  }))
    .then(({ data, status }) => {
      if (status === 200) {
        dispatch(modals.actions.showMessageBoxModal({
          text: AUTH_MESSAGES[data.data.detail] || data.data.detail,
          size: MODAL_SIZES.small,
        }))
      }
    })
    .then(() => dispatch(forms.actions.recoveryForm.resetForm()))
    .catch(({ status }) => {
      if (status === 404) {
        dispatch(modals.actions.showMessageBoxModal({
          title: 'Ошибка',
          text: 'Аккаунт не найден',
          size: MODAL_SIZES.small,
        }))
      }
    })
}

export const logoutFront = () => (dispatch) => {
  clearStorage()
  clearToken()
  dispatch({
    type: STATE_REPLACE_ACTION,
    state: {},
  })
  dispatch(push(LOGIN_PAGE_URL))
}


export const logout = () => async (dispatch) => {
  await dispatch(forms.actions.sendQuickForm({
    apiName: AUTH_API_NAME,
    endpoint: LOGOUT_ENDPOINT,
  }))
  dispatch(logoutFront())
}

export const restoreAuthData = () => dispatch => {
  return
  dispatch(forms.actions.sendQuickForm({
    apiName: AUTH_API_NAME,
    endpoint: VERIFY_TOKEN_ENDPOINT,
  }))
    .then(({ data, status }) => {
      if (status === 200) {
        dispatch(setAuthData(data.data))
      } else {
        dispatch(logout())
      }
    })
    .catch(() => dispatch(logout()))
}

export const registerUser = ({
  login: loginValue,
  password,
}) => async (dispatch) => {
  return dispatch(forms.actions.sendQuickForm({
    model: 'account',
    values: {
      login: loginValue,
      password,
    },
  }))
}

export const changeAccountActive = (id, active) => dispatch => {
  return dispatch(forms.actions.sendQuickForm({
    model: 'account',
    defaults: {
      id,
      active,
    },
  }))
}
