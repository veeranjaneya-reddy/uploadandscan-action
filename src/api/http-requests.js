const axios = require('axios');
const { calculateAuthorizationHeader } = require('./veracode-hmac.js');
const appConfig = require('../app-cofig.js');
const core = require('@actions/core');

async function getResourceByAttribute (vid, vkey, resource) {
  const resourceUri = resource.resourceUri;
  const queryAttribute = resource.queryAttribute;
  const queryValue = resource.queryValue;
  const queryAttribute2 = resource.queryAttribute2;
  const queryValue2 = resource.queryValue2;
  var urlQueryParams = queryAttribute !== '' ? `?${queryAttribute}=${queryValue}` : '';
  const { host, vid: updatedVid, vkey: updatedVkey } = getHostAndCredentials(vid, vkey);
  if ( queryAttribute2 ){
    urlQueryParams = urlQueryParams+`&${queryAttribute2}=${queryValue2}`;
  }
  const headers = {
    'Authorization': calculateAuthorizationHeader(updatedVid, updatedVkey, host, resourceUri, 
      urlQueryParams, 'GET')
  };

  const appUrl = `https://${host}${resourceUri}${urlQueryParams}`;
  try {
    core.info('appUrl', appUrl)
    const response = await axios.get(appUrl, { headers });
    return response.data; // Access the response data
  } catch (error) {
    console.error(error);
  }
}

async function getResource (vid, vkey, resource) {
  const resourceUri = resource.resourceUri;
  const { host, vid: updatedVid, vkey: updatedVkey } = getHostAndCredentials(vid, vkey);
  const headers = {
    'Authorization': calculateAuthorizationHeader(updatedVid, updatedVkey, host, resourceUri, '', 'GET')
  };
  const appUrl = `https://${host}${resourceUri}`;
  try {
    const response = await axios.get(appUrl, { headers });
    return response.data; // Access the response data
  } catch (error) {
    console.error(error);
  }
}

async function createResource(vid, vkey, resource) {
  const resourceUri = resource.resourceUri;
  const resourceData = resource.resourceData;
  const { host, vid: updatedVid, vkey: updatedVkey } = getHostAndCredentials(vid, vkey);
  const headers = {
    'Authorization': calculateAuthorizationHeader(updatedVid, updatedVkey, host, resourceUri, 
      '', 'POST')
  };

  const appUrl = `https://${host}${resourceUri}`;
  try {
    const response = await axios.post(appUrl, resourceData, { headers });
    return response.data; // Access the response data
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getResourceByAttribute,
  getResource,
  createResource,
};