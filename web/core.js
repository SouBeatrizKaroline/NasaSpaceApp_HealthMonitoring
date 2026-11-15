/* Shared record contract used by onboard capture, reports, and ground review. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CrewCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const RECORD_KEY = 'crew-health-check.records.v2';
  const codePattern = /^[A-Z0-9][A-Z0-9-]{0,23}$/;
  const units = {heartRate: 'bpm', temperature: '°C', oxygen: '%', bp: 'mmHg', glucose: 'mg/dL'};
  const stages = ['pre', 'during', 'post'];
  function object(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
  function text(value, maximum = 4000) {
    if (value == null) return null;
    if (typeof value !== 'string' || value.length > maximum) throw new Error('invalidText');
    return value;
  }
  function optionalNumber(value, min, max) {
    if (value == null || value === '') return null;
    if (!['string', 'number'].includes(typeof value) || String(value).trim() === '') throw new Error('invalidNumber');
    const number = Number(value);
    if (!Number.isFinite(number) || number < min || number > max) throw new Error('invalidNumber');
    return value;
  }
  function normalizeRecord(input) {
    if (!object(input) || !object(input.mission) || !object(input.measurements)) throw new Error('invalidRecord');
    if (!codePattern.test(input.astronautCode) || !codePattern.test(input.missionCode)) throw new Error('invalidCode');
    if (!stages.includes(input.stage) || typeof input.recordedAt !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}T/.test(input.recordedAt) || !Number.isFinite(Date.parse(input.recordedAt))) throw new Error('invalidRecord');
    const id = text(input.id, 128);
    if (!id) throw new Error('invalidRecord');
    const measurements = {};
    for (const [key, reading] of Object.entries(input.measurements)) {
      if (!Object.hasOwn(units, key) || !object(reading) || reading.unit !== units[key]) throw new Error('invalidUnit');
      const value = reading.value;
      if (key === 'bp') {
        if (typeof value !== 'string' || !/^\d{1,3}\s*\/\s*\d{1,3}$/.test(value)) throw new Error('invalidMeasurement');
      } else {
        optionalNumber(value, 0, key === 'oxygen' ? 100 : 2000);
        if (value == null || value === '') throw new Error('invalidMeasurement');
      }
      measurements[key] = {value, unit: reading.unit};
      if (reading.source != null) measurements[key].source = text(reading.source, 300);
      if (reading.measuredAt != null) measurements[key].measuredAt = text(reading.measuredAt, 100);
    }
    const wellbeing = input.wellbeing || {};
    if (!object(wellbeing)) throw new Error('invalidRecord');
    const functions = input.functionChanges || [];
    if (!Array.isArray(functions) || functions.length > 30) throw new Error('invalidRecord');
    functions.forEach(value => { if (typeof value !== 'string') throw new Error('invalidRecord'); text(value, 200); });
    if (input.privateFollowUp != null && typeof input.privateFollowUp !== 'boolean') throw new Error('invalidRecord');
    return {
      id, astronautCode: input.astronautCode, missionCode: input.missionCode, stage: input.stage,
      recordedAt: input.recordedAt,
      mission: {
        phase: text(input.mission.phase, 200), gravity: text(input.mission.gravity, 200),
        timeSinceTransition: text(input.mission.timeSinceTransition, 200),
        day: optionalNumber(input.mission.day, 0, 100000)
      },
      reason: text(input.reason, 200), description: text(input.description), onset: text(input.onset, 300),
      pattern: text(input.pattern, 300), associatedChanges: text(input.associatedChanges, 1000),
      functionChanges: functions.slice(),
      wellbeing: {sleepHours: optionalNumber(wellbeing.sleepHours, 0, 24), mood: optionalNumber(wellbeing.mood, 1, 5), stress: optionalNumber(wellbeing.stress, 1, 5)},
      measurements, measurementSource: text(input.measurementSource, 300), measurementTime: text(input.measurementTime, 100),
      reviewPreference: text(input.reviewPreference, 200), privateFollowUp: Boolean(input.privateFollowUp),
      mediaStored: false
    };
  }
  function compare(records) {
    const latest = Object.fromEntries(stages.map(stage => [stage,
      records.filter(row => row.stage === stage).sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt))[0] || null]));
    const baseline = latest.pre;
    function difference(row, metric) {
      if (!baseline || !row) return null;
      const base = metric === 'sleepHours' ? baseline.wellbeing?.sleepHours : baseline.measurements?.[metric]?.value;
      const current = metric === 'sleepHours' ? row.wellbeing?.sleepHours : row.measurements?.[metric]?.value;
      if (base == null || base === '' || current == null || current === '' || metric === 'bp') return null;
      if (metric !== 'sleepHours' && baseline.measurements[metric].unit !== row.measurements[metric].unit) return null;
      if (!Number.isFinite(Number(base)) || !Number.isFinite(Number(current))) return null;
      return Math.round((Number(current) - Number(base)) * 100) / 100;
    }
    return {latest, difference};
  }
  function report(records, crew, mission) {
    const selected = records.filter(row => row.astronautCode === crew && row.missionCode === mission).map(normalizeRecord);
    if (!selected.length || selected.length > 500) throw new Error('invalidCount');
    return {format: 'crew-health-report', version: 1, exportedAt: new Date().toISOString(),
      scope: {crewId: crew, missionId: mission}, records: selected};
  }
  function parseReport(value) {
    if (!object(value)) throw new Error('invalidReport');
    const legacy = ['crew-health-check-demo-v2', 'crew-health-check-demo-v3'].includes(value.format);
    if (!legacy && (value.format !== 'crew-health-report' || value.version !== 1)) throw new Error('invalidFormat');
    if (!Array.isArray(value.records) || !value.records.length || value.records.length > 500) throw new Error('invalidCount');
    const records = value.records.map(normalizeRecord);
    const first = records[0];
    if (records.some(row => row.astronautCode !== first.astronautCode || row.missionCode !== first.missionCode)) throw new Error('mixedScope');
    if (new Set(records.map(row => row.id)).size !== records.length) throw new Error('duplicateRecord');
    if (!legacy && (!object(value.scope) || value.scope.crewId !== first.astronautCode || value.scope.missionId !== first.missionCode)) throw new Error('mixedScope');
    return {scope: {crewId: first.astronautCode, missionId: first.missionCode}, records};
  }
  return {RECORD_KEY, codePattern, units, stages, normalizeRecord, compare, report, parseReport};
});
