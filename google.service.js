const { google } = require('googleapis');
const { auth } = require('google-auth-library');
const { env } = require('typed-dotenv').config();

const sheets = google.sheets('v4');

const RANGE = 'A7:A';
const GOOGLE_SHEET_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

class GoogleService {
  constructor() {
    this.googleAuth();
  }

  googleAuth() {
    try {
      const keys = JSON.parse(env.GOOGLE_CREDITS);
      const client = auth.fromJSON(keys);
      client.scopes = [GOOGLE_SHEET_SCOPE];
      google.options({ auth: client });
    } catch (e) {
    }
  }

  /**
   * @param {string} spreadsheetId
   * @param {string} sheetName
   * @param {string} [range]
   *
   * @returns {Promise<Record<string, any>[] | null>}
   * */
  async getSheet(spreadsheetId, sheetName, range) {
    try {
      return await sheets.spreadsheets.values
        .get({
          spreadsheetId,
          range: `${sheetName}!${range || RANGE}`,
        })
        .then((response) => {
          const shortRange = response.data.range.replace(sheetName, '').replace('!', '');
          const sheetKey = shortRange.split(':')[0].replace(/\d/g, '');
          const sheetStartFrom = +shortRange.split(':')[0].replace(/\D/g, '');

          console.info({ sheetName, sheetKey, sheetStartFrom, length: response.data.values.length });

          return (
            response.data.values
              .map((row, index) => ({
                value: row[0],
                index: sheetStartFrom + index,
                sheetKey,
                fullPath: `${sheetName}!${sheetKey}${sheetStartFrom + index}`,
              }))
              .filter((item) => !!item.value) || null
          );
        });
    } catch (e) {
      return Promise.resolve(null);
    }
  }

  /**
   * @param {string} spreadsheetId
   * @param {string} range
   *
   * @returns {Promise< null>}
   * */
  async removeSheetRange(spreadsheetId, range) {
    try {
      return await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
      });
    } catch (e) {
      return Promise.resolve(null);
    }
  }

  /**
   * @param {string} spreadsheetId
   * @param {string} sheetName
   * @param {string} value
   * */
  async appendToSheet(spreadsheetId, sheetName, value) {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!${RANGE}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[value]],
        },
      });
    } catch (e) {
    }
  }
}
const googleService = new GoogleService();

module.exports = {
  googleService,
};
