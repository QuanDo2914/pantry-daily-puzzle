// Compare the complete production build against the PR base. No generation or deployment.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

const base=process.argv[2]||'origin/main',root=process.cwd();
const baseSha=execFileSync('git',['rev-parse',`${base}^{commit}`],{encoding:'utf8'}).trim();
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'pantry-production-base-'));
function inventory(directory){
 const files={};
 function visit(relative){for(const name of fs.readdirSync(path.join(directory,relative)).sort()){const next=path.join(relative,name),absolute=path.join(directory,next);if(fs.statSync(absolute).isDirectory())visit(next);else files[next]=crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex')}}
 visit('');return files;
}
try{
 const archive=execFileSync('git',['archive',baseSha],{maxBuffer:30*1024*1024});
 const extracted=spawnSync('tar',['-x','-C',temporary],{input:archive});if(extracted.status!==0)throw Error(extracted.stderr.toString());
 execFileSync(process.execPath,[path.join(temporary,'scripts/build.mjs')],{cwd:temporary,stdio:'pipe'});
 execFileSync(process.execPath,[path.join(root,'scripts/build.mjs')],{cwd:root,stdio:'pipe'});
 const baseline=inventory(path.join(temporary,'dist')),candidate=inventory(path.join(root,'dist'));
 assert.deepEqual(candidate,baseline,'Production output differs from the PR base');
 const deployment=JSON.parse(fs.readFileSync('vercel.json'));assert.equal(deployment.git.deploymentEnabled,false,'Automatic deployments must remain on hold');
 const changedRuntime=execFileSync('git',['diff',baseSha,'--name-only','--','src/app.js','src/index.html','src/styles.css','src/sw.js','src/game','src/data','public/puzzles','scripts/build.mjs','package.json','.openai/hosting.json'],{encoding:'utf8'}).trim();
 assert.equal(changedRuntime,'','Existing runtime, live data, build, or hosting files changed');
 const report={baseCommit:baseSha,productionFilesCompared:Object.keys(candidate).length,allFilePathsAndSHA256HashesMatch:true,runtimeAndLiveDataUnchanged:true,automaticVercelGitDeploymentsHeld:true,artifactInventorySHA256:crypto.createHash('sha256').update(JSON.stringify(candidate)).digest('hex')};
 fs.mkdirSync('docs/main-review',{recursive:true});fs.writeFileSync('docs/main-review/production-equivalence.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report));
}finally{
 fs.rmSync(temporary,{recursive:true,force:true});
}
