import React from 'react'
import PropTypes from 'prop-types'

function Drawer({
  children,
  visible,
}) {
  return (
    <div className="board-drawer" style={{width: 200, display: visible ? 'block' : 'none'}}>
      { children }
    </div>
  )
}

Drawer.propTypes = {
  children: PropTypes.any,
  visible: PropTypes.bool,
}

export default Drawer

