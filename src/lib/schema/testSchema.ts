/**
 * Test suite for the schema database
 * Run this file to verify schema functionality
 */

import {
  getMechanic,
  getTargeter,
  getCondition,
  getTrigger,
  searchSchemas,
  validateMechanicParameters,
  getAutocompleteSuggestions,
  getAllMechanicNames,
  getAllTargeterNames,
  getAllConditionNames,
  getAllTriggerNames,
} from './schemaLoader';

console.log('🧪 Testing MythicMobs Schema Database\n');
console.log('='.repeat(80) + '\n');

let passed = 0;
let failed = 0;

// Test 1: Get mechanic by name
console.log('Test 1: Get mechanic by name');
console.log('-'.repeat(80));
const damageMechanic = getMechanic('damage');
if (damageMechanic && damageMechanic.name === 'damage') {
  console.log('✅ Found damage mechanic');
  console.log(`   Description: ${damageMechanic.description}`);
  console.log(`   Parameters: ${Object.keys(damageMechanic.parameters).length}`);
  passed++;
} else {
  console.log('❌ Failed to find damage mechanic');
  failed++;
}
console.log();

// Test 2: Get mechanic by alias
console.log('Test 2: Get mechanic by alias');
console.log('-'.repeat(80));
const damageMechanicByAlias = getMechanic('d');
if (damageMechanicByAlias && damageMechanicByAlias.name === 'damage') {
  console.log('✅ Found damage mechanic by alias "d"');
  passed++;
} else {
  console.log('❌ Failed to find damage mechanic by alias');
  failed++;
}
console.log();

// Test 3: Get targeter
console.log('Test 3: Get targeter');
console.log('-'.repeat(80));
const pirTargeter = getTargeter('@PIR');
if (pirTargeter && pirTargeter.name === 'PIR') {
  console.log('✅ Found PIR targeter');
  console.log(`   Description: ${pirTargeter.description}`);
  console.log(`   Options: ${Object.keys(pirTargeter.options).length}`);
  passed++;
} else {
  console.log('❌ Failed to find PIR targeter');
  failed++;
}
console.log();

// Test 4: Get condition
console.log('Test 4: Get condition');
console.log('-'.repeat(80));
const healthCondition = getCondition('health');
if (healthCondition && healthCondition.name === 'health') {
  console.log('✅ Found health condition');
  console.log(`   Description: ${healthCondition.description}`);
  console.log(`   Value type: ${healthCondition.valueType}`);
  passed++;
} else {
  console.log('❌ Failed to find health condition');
  failed++;
}
console.log();

// Test 5: Get trigger
console.log('Test 5: Get trigger');
console.log('-'.repeat(80));
const attackTrigger = getTrigger('~onAttack');
if (attackTrigger && attackTrigger.name === 'onAttack') {
  console.log('✅ Found onAttack trigger');
  console.log(`   Description: ${attackTrigger.description}`);
  passed++;
} else {
  console.log('❌ Failed to find onAttack trigger');
  failed++;
}
console.log();

// Test 6: Get trigger with value (onTimer)
console.log('Test 6: Get trigger with value (onTimer)');
console.log('-'.repeat(80));
const timerTrigger = getTrigger('onTimer:100');
if (timerTrigger && timerTrigger.name === 'onTimer' && timerTrigger.hasValue) {
  console.log('✅ Found onTimer trigger');
  console.log(`   Has value: ${timerTrigger.hasValue}`);
  console.log(`   Value type: ${timerTrigger.valueType}`);
  passed++;
} else {
  console.log('❌ Failed to find onTimer trigger');
  failed++;
}
console.log();

// Test 7: Validate mechanic parameters (valid)
console.log('Test 7: Validate mechanic parameters (valid)');
console.log('-'.repeat(80));
const validParams = { amount: 10, type: 'magic' };
const validation1 = validateMechanicParameters('damage', validParams);
if (validation1.valid) {
  console.log('✅ Valid parameters accepted');
  passed++;
} else {
  console.log('❌ Valid parameters rejected');
  console.log(`   Errors: ${validation1.errors.join(', ')}`);
  failed++;
}
console.log();

// Test 8: Validate mechanic parameters (missing required)
console.log('Test 8: Validate mechanic parameters (missing required)');
console.log('-'.repeat(80));
const invalidParams = { type: 'magic' }; // missing 'amount'
const validation2 = validateMechanicParameters('damage', invalidParams);
if (!validation2.valid && validation2.errors.some(e => e.includes('amount'))) {
  console.log('✅ Missing required parameter detected');
  console.log(`   Errors: ${validation2.errors.join(', ')}`);
  passed++;
} else {
  console.log('❌ Failed to detect missing required parameter');
  failed++;
}
console.log();

// Test 9: Search schemas
console.log('Test 9: Search schemas');
console.log('-'.repeat(80));
const searchResults = searchSchemas('damage');
if (searchResults.length > 0 && searchResults[0].name === 'damage') {
  console.log(`✅ Found ${searchResults.length} results for "damage"`);
  console.log(`   Top result: ${searchResults[0].name} (${searchResults[0].type})`);
  passed++;
} else {
  console.log('❌ Search failed');
  failed++;
}
console.log();

// Test 10: Get autocomplete suggestions
console.log('Test 10: Get autocomplete suggestions');
console.log('-'.repeat(80));
const mechanicSuggestions = getAutocompleteSuggestions('mechanic');
const targeterSuggestions = getAutocompleteSuggestions('targeter');
if (mechanicSuggestions.length > 0 && targeterSuggestions.length > 0) {
  console.log(`✅ Got ${mechanicSuggestions.length} mechanic suggestions`);
  console.log(`   Examples: ${mechanicSuggestions.slice(0, 5).join(', ')}`);
  console.log(`✅ Got ${targeterSuggestions.length} targeter suggestions`);
  console.log(`   Examples: ${targeterSuggestions.slice(0, 5).join(', ')}`);
  passed++;
} else {
  console.log('❌ Failed to get autocomplete suggestions');
  failed++;
}
console.log();

// Summary
console.log('='.repeat(80));
console.log('\n📊 Schema Database Stats:');
console.log(`   Mechanics: ${getAllMechanicNames().length}`);
console.log(`   Targeters: ${getAllTargeterNames().length}`);
console.log(`   Conditions: ${getAllConditionNames().length}`);
console.log(`   Triggers: ${getAllTriggerNames().length}`);

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);

if (failed === 0) {
  console.log('🎉 All tests passed!');
} else {
  console.log('⚠️  Some tests failed. Check output above.');
}
