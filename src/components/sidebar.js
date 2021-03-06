'use strict'

const React = require('react')
const PropTypes = require('prop-types')

const Sidebar = ({ children }) => (
  <header id="sidebar">{children}</header>
)

Sidebar.propTypes = {
  children: PropTypes.node
}

module.exports = {
  Sidebar
}
