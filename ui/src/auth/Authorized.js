import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

export const MEMBER_ROLE = 'member'
export const VIEWER_ROLE = 'viewer'
export const EDITOR_ROLE = 'editor'
export const ADMIN_ROLE = 'admin'
export const SUPERADMIN_ROLE = 'superadmin'

export const isUserAuthorized = (meRole, requiredRole) => {
  switch (requiredRole) {
    case VIEWER_ROLE:
      return (
        meRole === VIEWER_ROLE ||
        meRole === EDITOR_ROLE ||
        meRole === ADMIN_ROLE ||
        meRole === SUPERADMIN_ROLE
      )
    case EDITOR_ROLE:
      return (
        meRole === EDITOR_ROLE ||
        meRole === ADMIN_ROLE ||
        meRole === SUPERADMIN_ROLE
      )
    case ADMIN_ROLE:
      return meRole === ADMIN_ROLE || meRole === SUPERADMIN_ROLE
    case SUPERADMIN_ROLE:
      return meRole === SUPERADMIN_ROLE
    // 'member' is the default role and has no authorization for anything currently
    case MEMBER_ROLE:
    default:
      return false
  }
}

const Authorized = ({
  children,
  meRole,
  isUsingAuth,
  requiredRole,
  replaceWithIfNotAuthorized,
  replaceWithIfNotUsingAuth,
  replaceWithIfAuthorized,
  propsOverride,
}) => {
  // if me response has not been received yet, render nothing
  if (typeof isUsingAuth !== 'boolean') {
    return null
  }

  if (meRole === null) {
    console.log('meRole === null -- /purgatory!')
  }

  // React.isValidElement guards against multiple children wrapped by Authorized
  const firstChild = React.isValidElement(children) ? children : children[0]

  if (!isUsingAuth) {
    return replaceWithIfNotUsingAuth || firstChild
  }

  if (isUserAuthorized(meRole, requiredRole)) {
    return replaceWithIfAuthorized || firstChild
  }

  if (propsOverride) {
    return React.cloneElement(firstChild, {...propsOverride})
  }

  return replaceWithIfNotAuthorized || null
}

const {bool, node, shape, string} = PropTypes

Authorized.propTypes = {
  isUsingAuth: bool,
  replaceWithIfNotUsingAuth: node,
  replaceWithIfAuthorized: node,
  replaceWithIfNotAuthorized: node,
  children: node.isRequired,
  me: shape({
    role: string.isRequired,
  }),
  requiredRole: string.isRequired,
  propsOverride: shape(),
}

const mapStateToProps = ({auth}) => {
  // me could be null if a 403 Forbidden was received, such as if the user's
  // current organization no longer exists
  const meRole = _.get(auth, 'me.role', null)
  return {
    meRole,
    isUsingAuth: auth.isUsingAuth,
  }
}

export default connect(mapStateToProps)(Authorized)
