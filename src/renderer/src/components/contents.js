import React, { Component, PropTypes } from 'react';
import { SortablePane, Pane } from 'react-sortable-pane';
import { isEmpty } from 'lodash';
import TimelineBox from './timeline-box';

export default class Contents extends Component {
  static propTypes = {
    timeline: PropTypes.array,
    fetchHomeTimeline: PropTypes.func,
    accounts: PropTypes.array,
    columns: PropTypes.array,
    deleteRequest: PropTypes.func,
    openAddColumnMenu: PropTypes.func,
    createFavorite: PropTypes.func,
  };

  static defaultProps = {
    columns: [],
  };

  renserPane() {
    return (
      <SortablePane
        margin={20}
        className="contents__sortable-pane"
        order={[]}
      >
        {this.renderPanes()}
      </SortablePane>
    );
  }

  renderPanes() {
    return this.props.columns.map(column => (
      <Pane
        id={column.id}
        key={column.id}
        width={320}
        minWidth={320}
        height={400}
        className="contents__pane"
      >
        <TimelineBox
          ref={column.id}
          column={column}
          deleteRequest={this.props.deleteRequest}
          timeline={this.props.timeline}
          createFavorite={this.props.createFavorite}
          accounts={this.props.accounts}
        />
      </Pane>
    ));
  }

  renderMessage() {
    return (
      <div
        className="contents__message--no-contents"
        onClick={this.props.openAddColumnMenu}
      >
        Please add new column.
      </div>
    );
  }

  render() {
    return (
      <div className="contents">
          {
            isEmpty(this.props.columns)
              ? this.renderMessage()
              : this.renserPane()
          }
      </div>
    );
  }
}
