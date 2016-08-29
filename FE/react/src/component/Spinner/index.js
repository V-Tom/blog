import React, { Component, PropTypes }from 'react'
import ReactDOM from 'react-dom'
import './Spinner.stylus'

class Spinner extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="Spinner">
        <div className="Spinner-ring-container">
          <section className="Spinner-ring Spinner-ring-1"></section>
          <section className="Spinner-ring Spinner-ring-2"></section>
        </div>
      </div>
    )
  }
}

Spinner.instance = null

Spinner.show = ()=> {
  if (Spinner.instance) {
    return false
  }
  const div = document.createElement('div')
  document.body.appendChild(div)

  //instance cache
  Spinner.instance = div

  ReactDOM.render(<Spinner/>, div)
}

Spinner.remove = ()=> {
  let div = Spinner.instance
  if (!div) {
    return false
  }
  Spinner.instance = null
  div.parentNode.removeChild(div)
  ReactDOM.unmountComponentAtNode(div)
}


export default Spinner