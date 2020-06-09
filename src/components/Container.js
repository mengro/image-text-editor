import React from 'react'
import PropTypes from 'prop-types'

function Container({
  children
}) {
  return (
    <div style={{border: '1px solid #ebedf0'}}>
      { children }
    </div>
  )
}

Container.propTypes = {

}

export default Container

