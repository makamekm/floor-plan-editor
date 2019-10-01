import React from "react";
import ReactDOM from "react-dom";

export default class Portal extends React.Component<{
  selector?: string;
}> {
  public element: HTMLElement;

  public componentDidMount() {
    this.element = this.props.selector
      ? document.querySelector(this.props.selector)
      : document.body;
    this.forceUpdate();
  }

  public render() {
    if (this.element === undefined) {
      return null;
    }

    return ReactDOM.createPortal(this.props.children, this.element);
  }
}
