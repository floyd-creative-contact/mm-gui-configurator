/**
 * Test suite for the skill line parser
 * Run this file to verify parser functionality
 */

import { parseSkillLine, generateSkillLine } from './index';

// Test cases from the MythicMobs spec
const testCases = [
  // Basic mechanic
  'damage{amount=10} @target ~onAttack',

  // Complex skill with all components
  'skill{s=FireBurst} @self ~onDamaged <50% 0.5',

  // Effect with particles
  'effect:particles{p=flame;a=20} @PIR{r=5} ~onTimer:100',

  // Message with placeholders
  'message{m="Hello <target.name>"} @trigger',

  // Inline conditions
  'damage{a=10} @target ?day ?!raining',

  // Simple mechanic no params
  'heal @self',

  // Mechanic with targeter options
  'teleport @randomlocationInRadius{r=10}',

  // Range health modifier
  'skill{s=PhaseTwo} @self ~onDamaged =30%-50%',

  // Greater than health modifier
  'damage{amount=20} @target >75%',

  // Just mechanic and parameters
  'potion{type=POISON;duration=100;level=2}',

  // Complex targeter
  'damage{a=5} @livingInRadius{r=3;conditions=[ - hasaura{aura=Burning} true ]}',
];

console.log('🧪 Testing MythicMobs Skill Line Parser\n');
console.log('='.repeat(80) + '\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase}`);
  console.log('-'.repeat(80));

  try {
    // Parse the skill line
    const ast = parseSkillLine(testCase);
    console.log('✅ Parsed successfully');
    console.log('AST:', JSON.stringify(ast, null, 2));

    // Generate skill line from AST
    const generated = generateSkillLine(ast);
    console.log('\n📝 Generated:', generated);

    // Parse again to verify round-trip
    const ast2 = parseSkillLine(generated);
    const generated2 = generateSkillLine(ast2);

    if (generated === generated2) {
      console.log('✅ Round-trip successful!');
      passed++;
    } else {
      console.log('⚠️  Round-trip mismatch:');
      console.log('   First:  ', generated);
      console.log('   Second: ', generated2);
      failed++;
    }
  } catch (error) {
    console.log('❌ Parse failed:', error instanceof Error ? error.message : error);
    failed++;
  }

  console.log('\n' + '='.repeat(80) + '\n');
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log('🎉 All tests passed!');
} else {
  console.log('⚠️  Some tests failed. Check output above.');
}
