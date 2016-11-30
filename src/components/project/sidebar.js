'use strict'

const React = require('react')
const { connect } = require('react-redux')
const { Component, PropTypes } = React
const { FormattedMessage } = require('react-intl')
const { Toolbar } = require('../toolbar')
const { ActivityPane } = require('../activity')
const { Lists } = require('../lists')
const { Tags } = require('../tags')
const { Sidebar } = require('../sidebar')
const { ProjectName } = require('./name')
const { ROOT } = require('../../constants/list')
const { has } = require('dot-prop')
const { IconTrash } = require('../icons')
const act = require('../../actions')


class ProjectSidebar extends Component {

  showSidebarMenu = (event) => {
    this.props.showContextMenu(event, 'sidebar')
  }

  showProjectMenu = (event) => {
    this.props.showContextMenu(
      event, 'project', { path: this.props.project.file }
    )
  }

  showListsMenu = (event) => {
    this.props.showContextMenu(event, 'lists')
  }

  showTagsMenu = (event) => {
    this.props.showContextMenu(event, 'tags')
  }

  showTrashMenu = (event) => {
    this.props.showContextMenu(event, 'trash', {})
  }

  handleTrashSelect = () => {
    if (!this.props.isTrashSelected) {
      this.props.onSelect({ trash: true, tag: null })
    }
  }

  render() {
    const { project, hasToolbar, isTrashSelected, ...props } = this.props

    delete props.showContextMenu

    return (
      <Sidebar>
        {hasToolbar && <Toolbar draggable/>}

        <div
          className="sidebar-body"
          onContextMenu={this.showSidebarMenu}>
          <section onContextMenu={this.showProjectMenu}>
            <nav>
              <ProjectName {...props} name={project.name}/>
            </nav>
          </section>

          <section onContextMenu={this.showListsMenu}>
            <h2><FormattedMessage id="sidebar.lists"/></h2>
            <nav>
              <Lists parent={ROOT}/>
            </nav>
          </section>

          <section>
            <nav>
              <ol>
                <li
                  className={isTrashSelected && 'active'}
                  onContextMenu={this.showTrashMenu}
                  onClick={this.handleTrashSelect}>
                  <IconTrash/>
                  <div className="title">
                    <FormattedMessage id="sidebar.trash"/>
                  </div>
                </li>
              </ol>
            </nav>
          </section>

          <section onContextMenu={this.showTagsMenu}>
            <h2><FormattedMessage id="sidebar.tags"/></h2>
            <nav>
              <Tags/>
            </nav>
          </section>
        </div>

        <ActivityPane/>

      </Sidebar>
    )
  }

  static propTypes = {
    isEditing: PropTypes.bool,
    isSelected: PropTypes.bool,
    isTrashSelected: PropTypes.bool,

    hasToolbar: PropTypes.bool,

    context: PropTypes.bool,

    project: PropTypes.shape({
      file: PropTypes.string,
      name: PropTypes.string
    }).isRequired,

    onProjectRename: PropTypes.func,
    onSelect: PropTypes.func,
    onEditableCancel: PropTypes.func,
    onEditableChange: PropTypes.func,

    showContextMenu: PropTypes.func
  }
}



module.exports = {
  ProjectSidebar: connect(
    ({ project, nav, ui }) => ({
      isEditing: has(ui.edit, 'project.name'),
      isSelected: !nav.list && !nav.trash,
      isTrashSelected: nav.trash,
      context: has(ui.context, 'project'),
      project,
    }),

    (dispatch) => ({

      onProjectRename() {
        dispatch(act.ui.edit.start({ project: { name: true } }))
      },

      onSelect(opts) {
        dispatch(act.nav.select({ list: null, trash: null, ...opts }))
      },

      onEditableChange(name) {
        dispatch(act.project.save({ name }))
        dispatch(act.ui.edit.cancel())
      },

      onEditableCancel() {
        dispatch(act.ui.edit.cancel())
      },

      showContextMenu(event, ...args) {
        event.stopPropagation()
        dispatch(act.ui.context.show(event, ...args))
      }

    })
  )(ProjectSidebar)
}
