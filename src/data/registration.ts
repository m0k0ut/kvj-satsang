export const registrationEndpoint = 'https://script.google.com/macros/s/AKfycbzr-Iuig0IT2iKQFDNHGAUlUhUuZ8Xszj2Ru3yyL_wTDDJJCcy3ItbGSgO_d4SPiH8W/exec';

export const registrationReady = registrationEndpoint.startsWith('https://script.google.com/macros/s/')
  && registrationEndpoint.endsWith('/exec');
