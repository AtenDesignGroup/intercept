import { createSelector } from 'reselect';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import intercept from 'intercept-client';

export const published = selector =>
  createSelector(selector, items => pickBy(items, item => item.data.status === '1'));

export const peek = (selector, field) =>
  createSelector(selector, items => mapValues(items, item => item.data[field]));

export const keyValues = (selector, field) =>
  createSelector(selector, items =>
    map(items, (item, key) => ({
      key,
      value: item.data[field],
    })),
  );

export const record = (resource, id) => state => state[resource].items[id];

export const records = resource => state => state[resource].items;

export const bundle = (resource, id) => (state) => {
  const base = record(resource, id)(state);

  // Just return an id if no record is found.
  // @todo This should probably be handled better and a warning or exception thrown
  //  as it could result in unintended side effects.
  if (!base) {
    window.console.warn(`Not data found for ${resource}: ${id}. Falling back to uuid`);
    return id;
  }

  const entity = Object.assign({}, base).data;
  const model = intercept.models[resource];
  // Get all relationships with reducers.
  const relationships = model
    .getRelationshipAliases()
    .filter(rel => model.schema[rel].model in state);
  relationships.forEach((rel) => {
    // Replace the uuid with the entity object.
    entity[rel] = Array.isArray(entity[rel])
      ? entity[rel].map(item => bundle(model.schema[rel].model, item)(state))
      : bundle(model.schema[rel].model, entity[rel])(state);
  });
  return entity;
};

export const bundles = resource => state =>
  mapValues(records(resource)(state),
    (value, id) => bundle(resource, id)(state));

//
// Event Types
//
export const eventType = id => record('taxonomy_term--event_type', id);
export const eventTypes = records('taxonomy_term--event_type');
export const eventTypesOptions = keyValues(eventTypes, 'name');
export const eventTypesLabels = peek(eventTypes, 'name');

//
// Events
//
export const event = id => state => state['node--event'].items[id];
export const events = state => state['node--event'].items;
export const eventsOptions = keyValues(events, 'title');
export const eventsLabels = peek(events, 'title');

//
// Locations
//
export const location = id => state => state['node--location'].items[id];
export const locations = state => state['node--location'].items;
export const locationsOptions = keyValues(locations, 'title');
export const locationsLabels = peek(locations, 'title');
