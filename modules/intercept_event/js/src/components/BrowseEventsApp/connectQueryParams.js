/**
 * @file Handles connection between URL query params and props.
 * @author John Ferris
 */

// React Url Query
import {
  addUrlProps,
  UrlQueryParamTypes,
  encode,
  decode,
  Serialize,
} from 'react-url-query';

// Lodash
import pickBy from 'lodash/pickBy';

/* eslint-disable */
import interceptClient from 'interceptClient';
import updateWithHistory from 'intercept/updateWithHistory';
/* eslint-enable */

const { decodeArray, encodeArray, decodeObject, encodeObject } = Serialize;

const c = interceptClient.constants;

const removeFalseyProps = obj => pickBy(obj, prop => prop);

const encodeFilters = (value) => {
  const filters = removeFalseyProps({
    [c.KEYWORD]: encode(UrlQueryParamTypes.string, value[c.KEYWORD], ''),
    location: encodeArray(value[c.TYPE_LOCATION], ','),
    type: encodeArray(value[c.TYPE_EVENT_TYPE], ','),
    audience: encodeArray(value[c.TYPE_AUDIENCE], ','),
    [c.DATE]: !value[c.DATE] ? null : encode(UrlQueryParamTypes.date, value[c.DATE]),
    [c.DATE_START]: !value[c.DATE_START] ? null : encode(UrlQueryParamTypes.date, value[c.DATE_START]),
    [c.DATE_END]: !value[c.DATE_END] ? null : encode(UrlQueryParamTypes.date, value[c.DATE_END]),
  });
  return encodeObject(filters, ':', '_');
};

const decodeFilters = (values) => {
  if (!values) {
    return {};
  }
  const value = decodeObject(values, ':', '_');
  const filters = {
    [c.KEYWORD]: decode(UrlQueryParamTypes.string, value[c.KEYWORD], ''),
    [c.TYPE_LOCATION]: decodeArray(value.location, ',') || [],
    [c.TYPE_EVENT_TYPE]: decodeArray(value.type, ',') || [],
    [c.TYPE_AUDIENCE]: decodeArray(value.audience, ',') || [],
    [c.DATE]: decode(UrlQueryParamTypes.date, value[c.DATE]) || null,
    [c.DATE_START]: decode(UrlQueryParamTypes.date, value[c.DATE_START]) || null,
    [c.DATE_END]: decode(UrlQueryParamTypes.date, value[c.DATE_END]) || null,
  };
  return filters;
};

const urlPropsQueryConfig = {
  view: { type: UrlQueryParamTypes.string },
  calView: { type: UrlQueryParamTypes.string },
  date: { type: UrlQueryParamTypes.date },
  filters: {
    type: {
      decode: decodeFilters,
      encode: encodeFilters,
    },
  },
};

const connectQueryParams = component =>
  updateWithHistory(addUrlProps({ urlPropsQueryConfig })(component));
export default connectQueryParams;
