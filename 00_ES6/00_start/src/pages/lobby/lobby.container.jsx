import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { SessionContext } from '../../common';
import { getListOfRooms, canenrollRoom } from '../../api/rooms';
import { LobbyComponent } from './lobby.component';

class LobbyContainerInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rooms: [], nickname: '', selectedRoom: '' };

    this.fetchRooms = this.fetchRooms.bind(this);
  }

  async fetchRooms() {
    const rooms = await getListOfRooms();
    this.setState({ rooms });
  }

  async joinRoomRequest() {
    const canEnroll = await canenrollRoom(this.state.selectedRoom, this.state.nickname);

    if (canEnroll) {
      console.log(`*** Join Room Request succeeded
      Nickname: ${this.state.nickname}
      Room: ${this.state.selectedRoom}`);

      this.props.setChatSessionInfo(this.state.nickname, this.state.selectedRoom);
      this.props.history.push('/chat');

    } else {
      console.log(`Join room request failed try another nickname`);
    }
  }

  onFieldChange = (id) => (value) => {
    this.setState({ [id]: value })
  }

  onJoinRoomRequest = () => {
    this.joinRoomRequest();
  }

  render() {
    return (
      <LobbyComponent
        rooms={this.state.rooms}
        fetchRooms={this.fetchRooms}
        nickname={this.state.nickname}
        onFieldChange={this.onFieldChange}
        selectedRoom={this.state.selectedRoom}
        onJoinRoomRequest={this.onJoinRoomRequest}
      />
    );
  }
}

LobbyContainerInner.propTypes = {
  setChatSessionInfo : PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const LobbyContainerWithSessionInner = (props) =>
      <SessionContext.Consumer>
       {(sessionInfo) => <LobbyContainerInner 
                          setChatSessionInfo={sessionInfo.setChatSessionInfo}
                          {...props}/>
       }
      </SessionContext.Consumer>
    

export const LobbyContainer = withRouter(
  LobbyContainerWithSessionInner
);

