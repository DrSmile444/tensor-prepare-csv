const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");

const puppeteer = require("puppeteer-core");

const wsUrlRegexp =
  /ws:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

/**
 * @typedef { import("puppeteer-core").Page } Page
 */

/**
 * Get it from:
 * 1) chrome://version
 * 2) Executable Path
 * */
const chromeHome =
  "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome";

const chromeParams =
  "--remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')\\";

const chromeLaunchCommand = `${chromeHome} ${chromeParams}`;

const selectors = {
  input:
    '[accept="application/pdf, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf, .pptx, .xlsx, .docx"]',
  uploadButton:
    "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.R5HjH > c-wiz > div.oLbzv > c-wiz > div > div:nth-child(1) > div > div.ld4Jde > div > button > span[jsname]",
  downloadButtonReady:
    "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.R5HjH > c-wiz > div.oLbzv > c-wiz > div > div:nth-child(1) > div > div.ld4Jde > div > button:nth-child(2)[style]",
  downloadButton:
    "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.R5HjH > c-wiz > div.oLbzv > c-wiz > div > div:nth-child(1) > div > div.ld4Jde > div > button:nth-child(2) > span[jsname]",
  clearTranslateButton:
    "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.R5HjH > c-wiz > div.oLbzv > c-wiz > div > div:nth-child(1) > div > div.sUGHdf > div.Pjatl > div > span > button > i",
};

/**
 * @param {'ua'|'ru'} lang
 * */
const loadTranslatedFiles = (lang) => {
  const translatedDir = "./2-translated";

  ["true-negatives.docx", "true-positives.docx"]
    .filter((fileName) => fs.existsSync(path.join(translatedDir, fileName)))
    .forEach((fileName) => {
      const newFileNameArray = fileName.split(".");
      newFileNameArray.splice(1, 0, lang);

      console.log(fileName);
      console.log(newFileNameArray.join("."));

      fse.moveSync(
        path.join(translatedDir, fileName),
        path.join(translatedDir, newFileNameArray.join(".")),
        { overwrite: true }
      );
    });
};

/**
 * @param {Page} page
 * @param {string} filePath
 * */
const translateFile = async (page, filePath) => {
  const elementHandle = await page.$("input[type=file][accept]");
  await elementHandle.uploadFile(path.join(__dirname, filePath));

  await page.waitForSelector(selectors.uploadButton);

  await page.waitForSelector(selectors.uploadButton);
  const uploadButton = await page.$(selectors.uploadButton);
  await uploadButton.evaluate((b) => b.click());

  await page.waitForSelector(selectors.downloadButtonReady);
  await page.waitForSelector(selectors.downloadButton);
  const downloadButton = await page.$(selectors.downloadButton);
  await downloadButton.evaluate((b) => b.click());

  await page.waitForTimeout(1000);

  await page.waitForSelector(selectors.clearTranslateButton);
  const clearButton = await page.$(selectors.clearTranslateButton);
  await clearButton.evaluate((b) => b.click());
};

const runDebugChrome = () => {
  return new Promise((resolve) => {
    const run = exec(chromeLaunchCommand);

    const stream = run.stderr.on("data", (logs) => {
      const urlMatch = wsUrlRegexp.exec(logs);

      if (urlMatch) {
        resolve(urlMatch[0]);
        stream.destroy();
      }
    });
  });
};

(async () => {
  const wsChromeEndpointUrl = await runDebugChrome();

  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointUrl,
    slowMo: 50,
  });

  const page = await browser.newPage();

  const session = await page.target().createCDPSession();
  await session.send("Page.enable");
  await session.send("Page.setWebLifecycleState", { state: "active" });

  console.log("Go to ua site");
  await page.goto(
    "https://translate.google.com/?source=gtx&sl=ru&tl=uk&op=docs",
    { waitUntil: "networkidle0" }
  );

  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "./2-translated",
    eventsEnabled: true,
  });

  await translateFile(page, "1-cases/true-negatives.docx");
  await translateFile(page, "1-cases/true-positives.docx");
  loadTranslatedFiles("ua");
  await page.waitForTimeout(1000);

  console.log("Go to ru site");
  await page.goto(
    "https://translate.google.com/?source=gtx&sl=uk&tl=ru&op=docs"
  );

  await translateFile(page, "1-cases/true-negatives.docx");
  await translateFile(page, "1-cases/true-positives.docx");
  loadTranslatedFiles("ru");
  await page.waitForTimeout(1000);

  console.log("Await until end");

  await page.waitForTimeout(2000);

  await browser.close();
})();
