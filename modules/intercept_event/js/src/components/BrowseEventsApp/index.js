import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import ViewSwitcher from 'intercept/ViewSwitcher';
import { connect } from 'react-redux';
import map from 'lodash/map';
import moment from 'moment';
import interceptClient from 'interceptClient';
import EventFilters from './../EventFilters';
import EventList from './../EventList';
import EventCalendar from './../EventCalendar';

const { select, api } = interceptClient;
const eventIncludes = [
  'field_image_primary',
  'field_image_primary.field_media_image',
  'field_room',
];

const styles = theme => ({});

function generateFilters(values) {
  const filter = {
    published: {
      path: 'status',
      value: '1',
    },
  };

  if (!values) {
    return filter;
  }

  const types = [
    { id: 'type', path: 'field_event_type.uuid', conjunction: 'OR' },
    { id: 'location', path: 'field_location.uuid', conjunction: 'OR' },
    { id: 'audience', path: 'field_event_audience.uuid', conjunction: 'OR' },
    { id: 'tag', path: 'field_event_tags.uuid', conjunction: 'AND' },
  ];

  types.forEach((type) => {
    if (values[type.id] && values[type.id].length > 0) {
      if (type.conjunction === 'AND') {
        const group = `${type.id}-group`;
        filter[group] = {
          type: 'group',
          conjunction: type.conjunction,
        };
        values[type.id].forEach((element, key) => {
          const id = `${type.id}-${key}`;
          filter[id] = {
            path: type.path,
            value: element,
            memberOf: group,
          };
        });
      }
      else {
        filter[type.id] = {
          path: type.path,
          value: values[type.id],
          operator: 'IN',
        };
      }
    }
  });

  if (values.date) {
    const startDate = moment(values.date);
    filter['date'] = {
      path: 'field_date_time.value',
      value: [startDate.toISOString(), startDate.add(1, 'days').toISOString()],
      operator: 'BETWEEN',
    };
  }

  return filter;
}

class BrowseEventsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'list',
    };

    this.handleViewChange = this.handleViewChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchEvents({
      filters: generateFilters(),
      include: eventIncludes,
    });
  }

  handleViewChange = (event, value) => {
    this.setState({ view: value });
  };

  render() {
    const { calendarEvents, events, fetchEvents, purge, eventsLoading } = this.props;

    function onFilterChange(values) {
      fetchEvents({
        filters: generateFilters(values),
        include: eventIncludes,
        replace: true,
      });
    }

    const eventComponent =
      this.state.view === 'list' ? (
        <EventList events={events} />
      ) : (
        <EventCalendar events={calendarEvents} />
      );

    return (
      <div>
        <ViewSwitcher handleChange={this.handleViewChange} />
        <Grid
          container
          justify="space-between"
          direction="row-reverse"
          spacing={24}
          wrap={'nowrap'}
        >
          <Grid item s={3}>
            <p>{eventsLoading ? 'Loading' : ''}</p>
            <EventFilters onChange={onFilterChange} />
          </Grid>
          <Grid item s={8}>
            {eventComponent}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  events: select.bundles('node--event')(state),
  eventsLoading: select.recordsAreLoading('node--event')(state),
  calendarEvents: select.calendarEvents(state),
});

const mapDispatchToProps = dispatch => ({
  fetchEvents: (options) => {
    dispatch(api['node--event'].fetchAll(options));
  },
  purge: () => {
    dispatch(api['node--event'].purge());
  },
});

BrowseEventsApp.propTypes = {
  calendarEvents: PropTypes.arrayOf(Object).isRequired,
  events: PropTypes.object.isRequired,
  fetchEvents: PropTypes.func.isRequired,
  purge: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(BrowseEventsApp),
);
