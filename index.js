const core = require('@actions/core');
const axios = require('axios').default;
const fs = require('fs');
const path = require("path");
const FormData = require('form-data');


function info(msg) {
  try {
    if (typeof msg == 'string') {
      core.info(msg);
    } else {
      core.info(JSON.stringify(msg));
    }
  } catch {
    core.info(msg);
  }
}

async function upload(url, apiKey, formData) {
  return axios.post(url, formData, {
    headers: {
      'X-API-KEY': apiKey,
      ...formData.getHeaders()
    }
  });
}

async function uploadTestCaseAttachment(server, apiKey, formData, replace, testCaseID) {
  const url = `${server}/test_case_file_upload/?` + new URLSearchParams({
    replace: replace,
  });

  formData.append("file_upload_tc", testCaseID);
  return upload(url, apiKey, formData);
}

async function uploadStepAttachment(server, apiKey, formData, replace, stepID) {
  const url = `${server}/step_file_upload/?` + new URLSearchParams({
    replace: replace,
  });

  formData.append("file_upload_step", stepID);
  return upload(url, apiKey, formData);
}

async function uploadGlobalAttachment(server, apiKey, formData, replace) {
  const url = `${server}/global_file_upload/?` + new URLSearchParams({
    replace: replace,
  });

  return upload(url, apiKey, formData);
}

async function run() {
  try {
    // required inputs
    let server = core.getInput('zeuz_server_host').trim();
    // remove trailing slash if present
    if (server.slice(-1) == '/') {
      server = server.slice(0, -1);
    }
    const apiKey = core.getInput('zeuz_api_key').trim();

    const attachmentType = core.getInput('zeuz_attachment_type').trim().toLowerCase();
    const itemID = core.getInput('zeuz_attachment_item_id').trim();
    const attachmentPath = core.getInput('zeuz_attachment_path').trim();
    const replaceAttachment = core.getInput('zeuz_attachment_replace').trim().toLowerCase() === 'true';

    info(`Server: ${server}`);
    info(`Attachment type: ${attachmentType}`);
    info(`Item ID: ${itemID}`);
    info(`Attachment path: ${attachmentPath}`);
    info(`Replace attachment?: ${replaceAttachment}`);

    if (attachmentType !== 'global' && itemID === 'none') {
      if (itemID === 'step') {
        core.setFailed('ERROR: step ID must be provided.');
      } else if (itemID === 'test_case') {
        core.setFailed('ERROR: test case ID must be provided.');
      }
      return;
    }

    info(__dirname);
    if (!fs.existsSync(attachmentPath)) {
      core.setFailed(`ERROR: file not found at: ${attachmentPath}`);
      return;
    }

    const fileName = path.basename(attachmentPath);
    const formData = new FormData();
    formData.append(fileName, fs.createReadStream(attachmentPath));

    let response = null;
    if (attachmentType === 'global') {
      response = await uploadGlobalAttachment(server, apiKey, formData, replaceAttachment);
    } else if (attachmentType === 'test_case') {
      response = await uploadTestCaseAttachment(server, apiKey, formData, replaceAttachment, itemID);
    } else if (attachmentType === 'step') {
      response = await uploadStepAttachment(server, apiKey, formData, replaceAttachment, itemID);
    }

    if (response === null) {
      core.setFailed("Failed to make api request");
      return;
    }

    if (response.data.status && response.data.status === 'Failed') {
      core.setFailed(`ERROR: failed to upload attachment, repsonse: ${JSON.stringify(response.data)}`);
      return;
    }
    info(`Attachment uploaded successfully: ${response.data}`);
  } catch (error) {
    info(error.stack)
    core.setFailed(error.message);
  }
}

run();
