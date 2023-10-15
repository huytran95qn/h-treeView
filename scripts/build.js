const host = 'https://huytran95qn.github.io/h-treeView/';

const execSync = require('child_process').execSync;

// ng build --configuration production --base-href https://huytran95qn.github.io/h-treeView/
execSync(`ng build --configuration production --base-href ${host}`, {stdio: 'inherit'});

// npx angular-cli-ghpages --dir=./dist/h-treeview
execSync(`npx angular-cli-ghpages --dir=./dist/h-treeview`);
