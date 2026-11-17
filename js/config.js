/**
 * REPAIRFLOW · CENTRAL CONFIGURATION
 *
 * Change DATA_SOURCE later without modifying UI code.
 *   google_sheets: READ-ONLY public Google Sheet (legacy option)
 *   mock: generated demo data, saved in this browser (localStorage)
 *   json: read-only public JSON URL (CORS must be allowed)
 *   api:  Cloudflare Worker REST API with GET /tasks, POST /tasks, PUT /tasks/:id,
 *         PATCH /tasks/:id/completion
 */
export const CONFIG = Object.freeze({
  DATA_SOURCE: 'api',

  // Google Sheet from the provided link (Share → Anyone with the link → Viewer).
  GOOGLE_SHEET_ID: '1ZXIr9iFJ4bvcDWuoesaBPyFXGiqV121iPjx943rcknw',

  // ID of the worksheet tab. Usually 0 for the first worksheet.
  // If another tab is used, open it in Google Sheets and copy the gid= value.
  GOOGLE_SHEET_GID: '95940409',

  // One header row, located on the very first row of the worksheet.
  GOOGLE_SHEET_HEADERS: 1,

  // Used only with DATA_SOURCE === 'json'.
  JSON_URL: 'https://example.com/repairflow/tasks.json',

  // Used only with DATA_SOURCE === 'api'. No trailing slash.
  API_BASE_URL: 'https://repairflow-api.nguyenvinhelectronics.workers.dev',
  FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfwkoK2CJ7Ea4JDPjp0TMnhm-7NRFsrBUI57yD68th_8bn7Nw/viewform?usp=header',

  MOCK_STORAGE_KEY: 'repairflow-studio-demo-v2',
  TIME_ZONE: 'Asia/Ho_Chi_Minh',
  AUTO_REFRESH_MS: 60_000,
});
