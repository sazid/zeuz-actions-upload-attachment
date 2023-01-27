const core = require('@actions/core');
const axios = require('axios').default;
const wait = require('./wait');


/*
// most @actions toolkit packages have async methods
async function run() {
  try {
    const ms = core.getInput('milliseconds');
    info(`Waiting ${ms} milliseconds ...`);

    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    info((new Date()).toTimeString());

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}
*/

async function getMachines(server, apiKey, teamID, projectID) {
  // remove trailing slash if present
  if (server.slice(-1) == '/') {
    server = server.slice(0, -1);
  }
  const url = `${server}/api/machines/list`;

  return axios.get(url, {
    params: {
      team: teamID,
      project: projectID,
    },
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    }
  })
}

function checkMachineRegex(target, list) {
  for (let i = 0; i < list.length; i++) {
    if (target.test(list[i])) {
      return list[i];
    }
  }
  return null;
}

function info(msg) {
  try {
    if (typeof (msg) == 'string') {
      core.info(msg);
    } else {
      core.info(JSON.stringify(msg));
    }
  } catch {
    core.info(msg);
  }
}

async function run() {
  try {
    // required inputs
    const server = core.getInput('zeuz_server_host');
    const apiKey = core.getInput('zeuz_api_key');
    const teamID = parseInt(core.getInput('zeuz_team_id'));
    const projectID = core.getInput('zeuz_project_id');
    const nodeID = core.getInput('node_id');
    const nodeIDRegex = new RegExp(nodeID);

    // optional inputs
    // retry interval cannot be less than 1
    const retryInterval = Math.max(1, parseInt(core.getInput('retry_interval')));
    // retry timeout >= retry interval
    const retryTimeout = Math.max(retryInterval, parseInt(core.getInput('retry_timeout')));

    info(`Server: ${server}`);
    info(`Team ID: ${teamID}`);
    info(`Project: ${projectID}`);
    info(`Node ID Regex pattern: ${nodeID}`);
    info(`Retry timeout: ${retryTimeout}`);
    info(`Retry interval: ${retryInterval}`);

    let response = null;
    for (let i = 0; i < retryTimeout; i += retryInterval) {
      try {
        response = await getMachines(server, apiKey, teamID, projectID);
        const machines = response.data;
        try {
          info(JSON.stringify(machines));
        } catch {
          info(machines)
        }

        let pickedNodeID = checkMachineRegex(nodeIDRegex, machines.map(m => m.name));
        if (pickedNodeID != null) {
          info("Picked machine: " + pickedNodeID);
          core.setOutput("node_id", pickedNodeID);
          return;
        } else {
          info(`Iteration #${i}: Could not find machine. Retrying...`);
          await wait(retryInterval * 1000);
        }
      } catch (error) {
        info(`error fetching machines list, error: ${error}`);
        info(error.stack);
      }
    }

    core.setFailed(`Failed to find any available nodes with the given node id pattern: ${nodeID}`);
  } catch (error) {
    info(error.stack)
    core.setFailed(error.message);
  }
}

run();
