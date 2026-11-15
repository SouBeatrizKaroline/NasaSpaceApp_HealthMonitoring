const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../web/core.js'),P=require('../web/planner-core.js');
const row=(extra={})=>({id:'r1',astronautCode:'A',missionCode:'M',stage:'pre',recordedAt:'2026-11-15T12:00:00Z',mission:{gravity:'Earth gravity'},measurements:{heartRate:{value:'70',unit:'bpm'}},measurementSource:'Manual device reading',wellbeing:{sleepHours:null},...extra});
test('report round trip preserves units, values, sources and blank optional fields',()=>{
 const original=C.normalizeRecord(row());const parsed=C.parseReport(C.report([original],'A','M'));
 assert.deepEqual(parsed.records,[original]);assert.equal(parsed.records[0].wellbeing.sleepHours,null);assert.equal(parsed.records[0].measurements.oxygen,undefined);
});
test('exports isolate both crew and mission',()=>{
 const rows=[row(),row({id:'r2',astronautCode:'B'}),row({id:'r3',missionCode:'N'})];assert.equal(C.report(rows,'A','M').records.length,1);
});
test('invalid, mixed scope, duplicate and wrong unit reports are rejected',()=>{
 assert.throws(()=>C.parseReport({}));const valid=C.report([row()],'A','M');
 for(const changed of [{...valid,version:2},{...valid,records:[row(),row({id:'2',astronautCode:'B'})]},{...valid,records:[row(),row()]},{...valid,records:[row({measurements:{heartRate:{value:70,unit:'unknown'}}})]}])assert.throws(()=>C.parseReport(changed));
});
test('comparison identifies missing phases and does not convert blank measurements into zero',()=>{
 const during=row({id:'2',stage:'during',measurements:{heartRate:{value:'75',unit:'bpm'}},wellbeing:{sleepHours:'0'}});
 const comparison=C.compare([row(),during]);assert.equal(comparison.latest.post,null);assert.equal(comparison.difference(during,'heartRate'),5);assert.equal(comparison.difference(during,'sleepHours'),null);
 assert.equal(C.normalizeRecord(during).wellbeing.sleepHours,'0');
});
test('planner strips unknown fields and finds the exhaustive optimum',()=>{
 const plan=P.validatePlan({budget:20,crewId:'PRIVATE',tasks:[{name:'A',duration:10,value:4},{name:'B',duration:20,value:9}]});
 assert.equal(plan.crewId,undefined);assert.equal(P.exact(plan).points,9);const result=P.runBrowserQaoa(plan.tasks,plan.budget);assert.ok(P.scorePlan(plan,result.bits).minutes<=20);
});
test('Qiskit result must match the exact current tasks and budget',()=>{
 const plan=P.validatePlan({budget:10,tasks:[{name:'A',duration:10,value:4}]});assert.equal(P.importResult({method:'qiskit-qaoa',plan,bits:[1]},plan).points,4);
 assert.throws(()=>P.importResult({method:'qiskit-qaoa',plan:{...plan,budget:20},bits:[1]},plan));assert.throws(()=>P.importResult({method:'qiskit-qaoa',plan,bits:[2]},plan));
});
