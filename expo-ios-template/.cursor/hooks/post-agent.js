// Hook script that runs when the agent finishes its task
const fs = require('fs');
const path = require('path');

// Read JSON input from stdin
let inputData = '';

process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(inputData);
    
    // Only run on successful completion
    if (payload.status !== 'completed') {
      console.log(JSON.stringify({}));
      process.exit(0);
    }

    // Check if there are uncommitted changes
    const { execSync } = require('child_process');
    let hasChanges = false;
    try {
      const status = execSync('git status --porcelain').toString();
      hasChanges = status.length > 0;
    } catch (e) {
      // Git might not be initialized
    }

    let followup_message = '';
    
    if (hasChanges) {
      followup_message = `I've completed the task. There are uncommitted changes. Would you like me to push an OTA update to your device using the \`/push-update\` skill, or do you need a full native build using \`/deploy-ios\`?`;
    } else {
      followup_message = `I've completed the task and all changes are committed. Let me know what feature you'd like to build next!`;
    }

    console.log(JSON.stringify({
      followup_message
    }));
  } catch (error) {
    console.log(JSON.stringify({}));
  }
});
