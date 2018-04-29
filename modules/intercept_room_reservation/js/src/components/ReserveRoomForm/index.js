// React
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Intercept
import interceptClient from 'interceptClient';
import drupalSettings from 'drupalSettings';

// Components
import Button from 'material-ui/Button';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Formsy, { addValidationRule } from 'formsy-react';
import SelectResource from 'intercept/SelectResource';
import InputDate from 'intercept/Input/InputDate';
import InputTime from 'intercept/Input/InputTime';
import InputNumber from 'intercept/Input/InputNumber';
import InputText from 'intercept/Input/InputText';
import ReserveRoomConfirmation from './ReserveRoomConfirmation';

const { constants } = interceptClient;
const c = constants;

const matchTime = (original, ref) => {
  if (ref instanceof Date === false || original instanceof Date === false) {
    return ref;
  }
  const output = new Date();
  output.setTime(original.getTime());
  output.setHours(ref.getHours());
  output.setMinutes(ref.getMinutes());
  output.setSeconds(ref.getSeconds());
  output.setMilliseconds(ref.getMilliseconds());
  return output;
};
const matchDate = (original, ref) => matchTime(ref, original);

addValidationRule('isRequired', (values, value) => value !== '');
addValidationRule('isPositive', (values, value) => value > 0);
addValidationRule('isRequiredIfServingRefreshments', (values, value) => {
  return !values.refreshments || value !== '';
});
addValidationRule('isFutureDate', (values, value) => value >= matchTime(new Date(), value));
addValidationRule('isFutureTime', (values, value) => value > new Date());
addValidationRule('isAfterStart', (values, value) => value > values.start);

class ReserveRoomForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expandRefreshments: false,
      openDialog: false,
      canSubmit: false,
    };

    this.toggleState = this.toggleState.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.updateValues = this.updateValues.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onOpenDialog = this.onOpenDialog.bind(this);
    this.onSwitchChange = this.onSwitchChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);

  }

  onInputChange(key) {
    return (event) => {
      this.updateValue(key, event.target.value);
    };
  }

  onValueChange(key) {
    return (value) => {
      this.updateValue(key, value);
    };
  }

  onDateChange(value) {
    const start = matchDate(this.props.values.start, value);
    const end = matchDate(this.props.values.end, value);
    this.updateValues({
      [c.DATE]: value,
      start,
      end,
    });
  }

  onStartChange(value) {
    const start = matchTime(value, this.props.values.start);
    const end = matchTime(value, this.props.values.end);
    this.updateValues({
      [c.DATE]: value,
      start,
      end,
    });
  }

  onSwitchChange(key) {
    return (event) => {
      this.updateValue(key, event.target.checked);
      this.setState({
        expandRefreshments: event.target.checked,
      });
    };
  }

  onOpenDialog = () => {
    this.setState({ openDialog: true });
  };

  onCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  toggleState(key) {
    return () => {
      this.setState({
        [key]: !this.state[key],
      });
    };
  }

  updateValue(key, value) {
    const newValues = { ...this.props.values, [key]: value };
    this.props.onChange(newValues);
  }

  updateValues(value) {
    const newValues = { ...this.props.values, ...value };
    this.props.onChange(newValues);
  }

  render() {
    const { values } = this.props;

    return (
      <div className="form">
        <Formsy
          className="form__main"
          ref="form"
          onValidSubmit={this.onOpenDialog}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
        >
          <SelectResource
            multiple={false}
            type={c.TYPE_ROOM}
            handleChange={this.onInputChange(c.TYPE_ROOM)}
            value={values[c.TYPE_ROOM]}
            label={'Room'}
            required
            name={c.TYPE_ROOM}
          />
          <div className="input-group--date-time">
            <InputDate
              handleChange={this.onDateChange}
              defaultValue={null}
              value={values[c.DATE]}
              name={c.DATE}
              required
              clearable={false}
              validations="isFutureDate"
              validationError="Date must be in the future"
            />
            <InputTime
              clearable
              label="Start Time"
              value={values.start}
              onChange={this.onValueChange('start')}
              name="start"
              required
              validations="isFutureTime"
              validationError="Must be in the future"
            />
            <InputTime
              clearable
              label="End Time"
              value={values.end}
              onChange={this.onValueChange('end')}
              name="end"
              required
              validations={{
                isFutureTime: true,
                isAfterStart: true,
              }}
              validationErrors={{
                isFutureTime: 'Must be in the future',
                isAfterStart: 'Must be after start time',
              }}
            />
          </div>
          <InputNumber
            label="Number of Attendees"
            value={values.attendees}
            onChange={this.onValueChange('attendees')}
            name={'attendees'}
            min={0}
            int
            validations="isPositive"
            validationError="Attendees must be a positive number"
          />
          <InputText
            label="Group Name"
            onChange={this.onValueChange('groupName')}
            value={values.groupName}
            name="groupName"
          />
          <ExpansionPanel
            elevation={0}
            expanded={this.state.expandRefreshments}
            onChange={this.toggleState('expandRefreshments')}
            className={'input-group input-group--expandable'}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              className={'input-group__summary'}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={values.refreshments}
                    onChange={this.onSwitchChange('refreshments')}
                    value="refreshments"
                  />
                }
                label="Serving light refreshments?"
                className={'input__label'}
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={'input-group__details'}>
              <InputText
                label="Please describe your light refreshments."
                value={values.refreshmentsDesc}
                onChange={this.onValueChange('refreshmentsDesc')}
                name="refreshmentDesc"
                required={values.refreshments}
                validations={'isRequiredIfServingRefreshments'}
                validationError={'This field is required if serving refreshments'}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <div className="form__actions">
            <Button type="submit" color="primary" disabled={!this.state.canSubmit}>
              Reserve
            </Button>
          </div>
        </Formsy>
        <ReserveRoomConfirmation
          open={this.state.openDialog}
          onCancel={this.onCloseDialog}
          onConfirm={() => {
            console.log(values);
            this.onCloseDialog();
          }}
          values={values}
        />

        {/* <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          transition={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Find a Room
              </Typography>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem button>
              <ListItemText primary="Phone ringtone" secondary="Titania" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary="Default notification ringtone" secondary="Tethys" />
            </ListItem>
          </List>
        </Dialog> */}
      </div>
    );
  }
}

ReserveRoomForm.propTypes = {
  values: PropTypes.shape({
    [c.TYPE_ROOM]: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    attendees: PropTypes.number,
    groupName: PropTypes.string,
    refreshments: PropTypes.bool,
    refreshmentsDesc: PropTypes.string,
    user: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

ReserveRoomForm.defaultProps = {
  values: {
    [c.TYPE_ROOM]: '',
    date: new Date(),
    start: new Date(),
    end: new Date(),
    attendees: 1,
    groupName: '',
    refreshments: false,
    refreshmentsDesc: '',
    user: drupalSettings.intercept.user.uuid,
  },
};

export default ReserveRoomForm;
