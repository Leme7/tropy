'use strict'

const React = require('react')
const { PureComponent } = React
const { array, arrayOf, func, shape, string } = require('prop-types')
const { FormElement, FormSelect } = require('../form')
const { TemplateSelect } = require('../template/select')
const { ipcRenderer: ipc } = require('electron')


class AppPrefs extends PureComponent {
  handleThemeChange = ({ theme }) => {
    ipc.send('cmd', 'app:switch-theme', theme, theme)
  }

  handleItemTemplateChange = (template) => {
    this.props.onSettingsUpdate({
      itemTemplate: template.id
    })
  }

  handlePhotoTemplateChange = (template) => {
    this.props.onSettingsUpdate({
      photoTemplate: template.id
    })
  }

  render() {
    return (
      <div className="scroll-container">
        <div className="form-horizontal">
          <FormSelect
            id="prefs.app.style.theme"
            name="theme"
            isRequired
            value={this.props.settings.theme}
            options={this.props.themes}
            onChange={this.handleThemeChange}/>
          <FormElement
            id="prefs.app.template.item">
            <TemplateSelect
              templates={this.props.itemTemplates}
              selected={this.props.settings.itemTemplate}
              onChange={this.handleItemTemplateChange}/>
          </FormElement>
          <FormElement
            id="prefs.app.template.photo">
            <TemplateSelect
              templates={this.props.photoTemplates}
              selected={this.props.settings.photoTemplate}
              onChange={this.handlePhotoTemplateChange}/>
          </FormElement>
        </div>
      </div>
    )
  }

  static propTypes = {
    itemTemplates: array.isRequired,
    photoTemplates: array.isRequired,
    settings: shape({
      theme: string.isRequired,
    }).isRequired,
    themes: arrayOf(string).isRequired,
    onSettingsUpdate: func.isRequired
  }

  static defaultProps = {
    themes: ['light', 'dark']
  }
}


module.exports = {
  AppPrefs
}
