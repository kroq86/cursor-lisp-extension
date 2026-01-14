// Quick test script for the Lisp interpreter
const { LispInterpreter } = require('./out/lisp/interpreter.js');

const interpreter = new LispInterpreter();

console.log('Testing Lisp Interpreter...\n');

const tests = [
    ['(+ 1 2)', 3],
    ['(* 2 3)', 6],
    ['(list 1 2 3)', [1, 2, 3]],
    ['(car (list 1 2 3))', 1],
    ['(if (> 5 3) "yes" "no")', 'yes'],
    ['(let ((x 10)) (+ x 5))', 15],
];

let passed = 0;
let failed = 0;

tests.forEach(([code, expected]) => {
    try {
        const result = interpreter.evaluate(code);
        const match = JSON.stringify(result) === JSON.stringify(expected);
        if (match) {
            console.log(`✅ ${code} = ${JSON.stringify(result)}`);
            passed++;
        } else {
            console.log(`❌ ${code} = ${JSON.stringify(result)}, expected ${JSON.stringify(expected)}`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ ${code} ERROR: ${error.message}`);
        failed++;
    }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
