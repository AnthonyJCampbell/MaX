// Copyright 2021 Metaswitch Networks - Highly Confidential Material
const fs = require("fs");
const chalk = require("chalk");

const isCI = process.env.CI === true || process.env.CI === "true";
const shouldRunAllResolutions =
  process.env.ALL_RESOLUTIONS === true || process.env.ALL_RESOLUTIONS === "true";
const isLocal = process.env.LOCAL === true || process.env.LOCAL === "true";

let storiesId;
let baseUrl;

if (!isCI && isLocal) {
  const stories = process.env.npm_config_stories;
  if (!stories) {
    console.log(chalk.bold.red("!!! BackstopJS Error !!!"));
    console.log("It seems you forgot to provide the stories you want to test locally.");
    console.log("\nPlease, provide the story ids you want to test, comma-separated, like this:");
    console.log(
      chalk.bgBlue(
        "npm run backstop:test-local --stories=components-avatar--contactless,components-incomingcallframe--gandalf-calling"
      )
    );
    console.log("\n");
    process.exit(1);
  }

  storiesId = process.env.npm_config_stories.split(",");
  baseUrl = "http://localhost:6006";
} else {
  if (!fs.existsSync("./storybook-static/stories.json")) {
    console.log(chalk.bold.red("!!! BackstopJS Error !!!"));
    console.log(
      "It seems a required command wasn't executed properly before you ran backstopJS."
    );
    console.log("\nPlease, run the following command first:");
    console.log(chalk.bgBlue("npm run backstop:pre-test"));
    console.log("\nAnd then, try to run backstop again\n");
    process.exit(1);
  }

  const stories = require("./storybook-static/stories.json");

  baseUrl = `file:///${__dirname}/storybook-static`;
  storiesId = Object.values(stories.stories).map((item) => item.id);
}

const report = ["CI"];

if (!isCI) {
  report.push("browser");
}

const scenarios = storiesId.map((id) => ({
  label: id,
  url: `${baseUrl}/iframe.html?id=${id}&viewMode=story`,
  delay: 1000,
  requireSameDimensions: false,
  misMatchThreshold: 0.01,
}));

const minimumSizeResolution = {
  label: "minimum-size",
  width: 850,
  height: 570,
};

const laptopResolution = {
  label: "laptop",
  width: 1366,
  height: 768,
};

const standardMonitorResolution = {
  label: "standard-monitor",
  width: 1920,
  height: 1080,
};

const fourKResolution = {
  label: "4K",
  width: 3840,
  height: 2160,
};

const standardMonitorPortraitResolution = {
  label: "standard-monitor-portrait",
  width: 1080,
  height: 1920,
};

const viewports = [laptopResolution];

if (shouldRunAllResolutions) {
  viewports.add(minimumSizeResolution);
  viewports.add(standardMonitorResolution);
  viewports.add(fourKResolution);
  viewports.add(standardMonitorPortraitResolution);
}

const config = {
  id: "maxuc",
  viewports,
  scenarios,
  paths: {
    bitmaps_reference: "backstop/bitmaps_reference",
    bitmaps_test: "backstop/output/bitmaps_test",
    html_report: "backstop/output/html_report",
    ci_report: "backstop/output/ci_report",
  },
  report,
  engine: "puppeteer",
  engineOptions: {
    args: ["--no-sandbox"],
  },
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false,
};

module.exports = config;
