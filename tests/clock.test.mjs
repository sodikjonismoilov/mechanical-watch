import test from 'node:test';
import assert from 'node:assert/strict';
import { clockAngles } from '../src/clock.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('midnight aligns all hands at twelve',()=>{const a=clockAngles(new Date(2026,0,1,0,0,0));near(a.hour,0);near(a.minute,0);near(a.second,0)});
test('hands interpolate fractional local time',()=>{const a=clockAngles(new Date(2026,0,1,3,30,15,500));near(a.second,-2*Math.PI*15.5/60);near(a.minute,-2*Math.PI*(30+15.5/60)/60);near(a.hour,-2*Math.PI*(3+30/60+15.5/3600)/12)});
test('time jumps are immediately reflected without accumulated drift',()=>{clockAngles(new Date(2026,0,1,1));const a=clockAngles(new Date(2026,0,2,18,0,0));near(a.hour,-Math.PI);near(a.minute,0);near(a.second,0)});
