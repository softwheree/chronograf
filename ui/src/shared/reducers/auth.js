const getInitialState = () => ({
  links: null,
  me: null,
  isMeLoading: false,
  isAuthLoading: false,
  logoutLink: null,
})

import {getMeRole} from 'shared/reducers/helpers/auth'

import {DEFAULT_ORG_NAME} from 'src/admin/constants/dummyUsers'

export const initialState = getInitialState()

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_EXPIRED': {
      const {auth: {links}} = action.payload
      console.log('AUTH_EXPIRED reducer')
      return {...initialState, links}
    }
    case 'AUTH_REQUESTED': {
      return {...state, isAuthLoading: true}
    }
    case 'AUTH_RECEIVED': {
      const {auth: {links}} = action.payload
      return {...state, links, isAuthLoading: false}
    }
    case 'ME_GET_REQUESTED': {
      return {...state, isMeLoading: true}
    }
    case 'ME_GET_COMPLETED__NON_AUTH': {
      const {me} = action.payload
      return {
        ...state,
        me: {...me},
        isMeLoading: false,
      }
    }
    case 'ME_GET_COMPLETED__AUTH': {
      const {me, me: {currentOrganization}} = action.payload
      return {
        ...state,
        me: {
          ...me,
          role: getMeRole(me),
          currentOrganization: currentOrganization || DEFAULT_ORG_NAME, // TODO: make sure currentOrganization is received as non-superadmin
        },
        isMeLoading: false,
      }
    }
    case 'LOGOUT_LINK_RECEIVED': {
      const {logoutLink} = action.payload
      const isUsingAuth = !!logoutLink
      return {...state, logoutLink, isUsingAuth}
    }
  }

  return state
}

export default authReducer
