import CryptoJS from 'crypto-js';

function fetchData() {
  return fetch(
    'http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/DailyTimetable/OD/1012/to/1008/2019-05-12',
    {
      headers: getAuthorizationHeader()
    }
  );
}

function getAuthorizationHeader() {
  var AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
  var AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';

  var GMTString = new Date().toGMTString();

  var hash = CryptoJS.HmacSHA1('x-date: ' + GMTString, AppKey);
  var sig = CryptoJS.enc.Base64.stringify(hash);

  var Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    sig +
    '"';

  return {
    Authorization: Authorization,
    'X-Date': GMTString,
    /*,'Accept-Encoding': 'gzip'*/
  };
  //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}

export default fetchData;
