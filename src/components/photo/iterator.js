'use strict'

const React = require('react')
const { Component, PropTypes } = React
const { get, move } = require('../../common/util')


class PhotoIterator extends Component {
  constructor(props) {
    super(props)
  }

  isSelected(photo) {
    return this.props.selected === photo.id
  }

  isContext(photo) {
    return get(this.props.ui, 'context.photo.id') === photo.id
  }

  select = (photo) => {
    if (!this.isSelected(photo)) {
      this.props.onSelect({
        photo: photo.id,
        item: photo.item
      })
    }
  }

  open = (photo) => {
    if (!this.props.isOpen) {
      this.props.onOpen({
        id: photo.item, photos: [photo.id]
      })
    }
  }

  handleContextMenu = (photo, event) => {
    this.props.onContextMenu(event, 'photo', {
      id: photo.id
    })
  }

  handleDropPhoto = ({ id, to, offset }) => {
    const { onSort, photos } = this.props

    const item = photos[0].item
    const order = move(photos.map(photo => photo.id), id, to, offset)

    onSort({ item, photos: order })
  }

  map(fn) {
    return this.props.photos.map(photo => fn({
      photo,
      cache: this.props.cache,
      isSelected: this.isSelected(photo),
      isContext: this.isContext(photo),
      isDisabled: this.props.isDisabled,
      onDropPhoto: this.handleDropPhoto,
      onContextMenu: this.handleContextMenu
    }))
  }

  static propTypes = {
    photos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired
      })
    ).isRequired,

    cache: PropTypes.string,
    selected: PropTypes.number,
    ui: PropTypes.object,

    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,

    onContextMenu: PropTypes.func,
    onOpen: PropTypes.func,
    onSelect: PropTypes.func,
    onSort: PropTypes.func
  }
}

module.exports = {
  PhotoIterator
}
