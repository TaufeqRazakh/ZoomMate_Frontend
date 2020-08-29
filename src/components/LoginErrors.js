import React from 'react'
import PropTypes from 'prop-types'

const LoginErrors = (props) => {
  return (
    <>
      { props.loginErrors &&
        <div className="text-danger">Something was wrong, please try again</div>
      }
    </>
  )
}

LoginErrors.propTypes = {
  loginErrors: PropTypes.bool
}

export default LoginErrors
