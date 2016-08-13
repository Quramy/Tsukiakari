/* @flow */

import React, { Component } from 'react';
import Window from 'react-window-component';
import B from '../lib/bem';
import Tooltip from 'rc-tooltip';
import AccountList from './account-list';
import { isEqual } from 'lodash';
import 'twitter-text';
import Spinner from './spinner';
import UploadMedia from '../containers/upload-media';
import TweetWindowHeader from './tweet-window-header';
import TweetEditor from './tweet-editor';
import TweetWindowFooter from './tweet-window-footer';

import type { Account } from '../../../types/account';
import type { Media } from '../../../types/media';
import type { Mentions } from '../../../types/mentions';

const b = B.with('tweet-window');

type Props = {
  isOpen: boolean;
  media: Array<Media>;
  mentions: Mentions;
  accounts: Array<Account>;
  close: Function;
  post: Function;
  uploadMedia: Function;
};

type State = {
  status: string;
  destroyTooltip : boolean;
  selectedAccount: Account;
  path: string;
  suggestions: Mentions;
  isDragOver: boolean;
};

export default class TweetWindow extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      status: '',
      destroyTooltip: false,
      selectedAccount: props.accounts[0],
      path: '',
      suggestions: props.mentions,
      isDragOver: false,
    };
    this.close = this.close.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAccountSelect = this.onAccountSelect.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.onDropFile = this.onDropFile.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  /* eslint-disable react/sort-comp */
  props: Props;
  state: State;
  close: Function;
  onClick: Function;
  onChange: Function;
  onAccountSelect: Function;
  onSelectFile: Function;
  onDropFile: Function;
  onDragOver: Function;

  componentWillReceiveProps(nextProps: Props) {
    const nextId = nextProps.replyTweet.id_str;
    if (nextId && nextId !== this.props.replyTweet.id_str) {
      this.setState({ status: `@${nextProps.replyTweet.user.screen_name} ` });
    }
    if (nextProps.isOpen !== this.props.isOpen) {
      this.setState({ destroyTooltip: true });
    }
    if (nextProps.media.length !== this.props.media.length) {
      this.setState({ path: '', isDragOver: false });
    }
    if (!nextProps.isMediaUploading) {
      this.setState({ isDragOver: false });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): bool {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  onAccountSelect(account: Account) {
    this.setState({ selectedAccount: account, destroyTooltip: true });
  }

  onClick() {
    this.props.post(this.state.selectedAccount, this.state.status, this.props.replyTweet);
    // TODO: move to reducer, if post failed note delete status
    this.setState({ status: '', destroyTooltip: true });
  }

  onChange(status: string) {
    this.setState({ status });
  }

  onSelectFile(e: SyntheticEvent): void { // eslint-disable-line flowtype/require-return-type
    // TODO: accounce
    if (this.props.media.length >= 4) return;
    if (e.target instanceof HTMLElement) {
      this.setState({ path: e.target.value });
      this.props.uploadMedia({ account: this.state.selectedAccount, files: e.target.files });
    }
  }

  onDropFile({ dataTransfer }) {
    // TODO: accounce
    if (this.props.media.length >= 4) return;
    this.setState({ path: dataTransfer.path });
    this.props.uploadMedia({ account: this.state.selectedAccount, files: dataTransfer.files });
  }

  // eslint-disable-next-line flowtype/require-return-type
  onDragOver(): void {
    if (this.props.media.length >= 4) return;
    this.setState({ isDragOver: true });
  }

  close() {
    this.props.close();
    this.setState({ destroyTooltip: true });
  }

  renderAvatar(): ?React$Element<*> {
    // TODO:
    if (!this.state.selectedAccount) return null;
    return (
      <img
        src={this.state.selectedAccount.profile_image_url}
        className={b('avatar')}
        alt="avatar"
      />
    );
  }

  renderTooltip(): ?React$Element<*> {
    return (
      <div className={b('tooltip')}>
        <AccountList
          accounts={this.props.accounts}
          selectedAccount={this.state.selectedAccount}
          onSelect={this.onAccountSelect}
        />
      </div>
    );
  }

  renderAccount(): ?React$Element<*> {
    if (this.props.accounts.length === 0) {
      return <i className="fa fa-spin fa-spinner" />;
    }
    return (
      <Tooltip
        trigger="click"
        overlay={this.props.accounts.length > 1
                 ? this.renderTooltip()
                 : null}
        destroyTooltipOnHide={this.state.destroyTooltip}
        placement="bottom"
        mouseLeaveDelay={0}
        overlayStyle={{
          position: 'absolute',
          top: '5px',
          left: '50px',
          zIndex: '99999',
        }}
      >
        {this.renderAvatar()}
      </Tooltip>
    );
  }

  renderDropOverlay(): ?React$Element<*> {
    if (!this.state.isDragOver || this.props.isMediaUploading) return null;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.9)',
          position: 'absolute',
          top: 0,
          left: 0,
          boxSizing: 'border-box',
          flexDirection: 'column',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#888',
        }}
        onDragLeave={() => {
          this.setState({ isDragOver: false });
        }}
      >
        <div
          style={{
            fontSize: '48px',
            pointerEvents: 'none',
            height: '60px',
          }}
        >
          <i className="lnr lnr-picture" />
        </div>
        <div
          style={{
            fontSize: '20px',
            pointerEvents: 'none',
          }}
        >
          Please drag photo here
        </div>
      </div>
    );
  }

  renderUploadSpinner(): ?React$Element<*> {
    if (!this.props.isMediaUploading) return null;
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#fff',
          opacity: '0.7',
        }}
      >
        <Spinner style={{ padding: '10% 0 0 80px' }} />
      </div>
    );
  }

  render(): ?React$Element<*> {
    // eslint-disable-next-line no-undef
    const remain = 140 - twttr.txt.getTweetLength(this.state.status);
    let buttonState = undefined;
    if (remain < 0 || remain === 140) buttonState = 'isDisabled';
    else if (this.props.isPosting) buttonState = 'isLoading';
    return (
      <Window
        isOpen={this.props.isOpen}
        x={100}
        y={300}
        width={380}
        height={180}
        minWidth={300}
        minHeight={150}
        maxWidth={800}
        maxHeight={800}
        style={{
          backgroundColor: '#fff',
          pointerEvents: 'auto',
          padding: this.props.media.length === 0 ? '0 0 4px 0' : '0 0 64px 0',
        }}
        className={b()}
      >
        <TweetWindowHeader close={this.close} />
        <div
          className={b('body')}
          onDragOver={this.onDragOver}
          onDrop={this.onDropFile}
        >
          {this.renderAccount()}
          <div className={b('textarea-wrapper')}>
            <TweetEditor onChange={this.onChange} mentions={this.props.mentions} />
            {this.renderDropOverlay()}
            <UploadMedia media={this.props.media} />
            <TweetWindowFooter
              remain={remain}
              onClick={this.onClick}
              onSelectFile={this.onSelectFile}
              buttonState={buttonState}
            />
          </div>
        </div>
        {this.renderUploadSpinner()}
      </Window>
    );
  }
}
