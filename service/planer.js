// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');

const env = process.env.NODE_ENV || 'test';
const config = require('../config/config')[env];

async function getRoute() {
  // const routeUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=Katowice+dworzec&destination=Welnowiec+Kosciol&mode=transit&key=${config.mapApiKey}`;
  // const route = await fetch(routeUrl).then((res) => res.json());

  // console.log('Response ->', route);

  // route.routes[0].legs.forEach((leg) => {
  //   console.log(leg);
  //   leg.steps.forEach((step) => {
  //     if(step.travel_mode === 'TRANSIT') {
  //       console.log(step.transit_details);
  //     }
  //   });
  // });
}

module.exports = {
  getRoute,
};
