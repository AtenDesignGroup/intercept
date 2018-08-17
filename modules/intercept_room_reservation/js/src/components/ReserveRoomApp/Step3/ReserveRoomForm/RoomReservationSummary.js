import React from 'react';
import PropTypes from 'prop-types';
import interceptClient from 'interceptClient';
import { connect } from 'react-redux';

const { constants, select, utils } = interceptClient;
const c = constants;

const { getDayDisplay } = utils;
const timeDisplay = (time, date) => utils.getTimeDisplay(utils.getDateFromTime(time, date));

const RoomReservationSummary = props => (
  <article className="reservation-summary">
    <p className="reservation-summary__location">{props.location}</p>
    <h3 className="reservation-summary__room">{props.room}</h3>
    <span className="reservation-summary__date">{getDayDisplay(props.date)}&nbsp;</span>
    <span className="reservation-summary__time">{`${timeDisplay(
      props.start,
      props.date,
    )} to ${timeDisplay(props.end, props.date)}`}</span>
  </article>
);

RoomReservationSummary.propTypes = {
  room: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const roomId = ownProps[c.TYPE_ROOM];

  return {
    room: select.roomLabel(roomId)(state),
    location: select.roomLocationLabel(roomId)(state),
  };
};

export default connect(mapStateToProps)(RoomReservationSummary);
