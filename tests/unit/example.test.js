import { describe, it, expect } from 'vitest';

/**
 * Example test file showing how to write tests with Vitest
 * 
 * This demonstrates common testing patterns you can use for your utility functions.
 */

// Example utility function to test (you would import this from your actual code)
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function isEven(num) {
  return num % 2 === 0;
}

// Test suites
describe('Math utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should return zero when multiplying by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(multiply(-3, 4)).toBe(-12);
    });
  });

  describe('isEven', () => {
    it('should return true for even numbers', () => {
      expect(isEven(4)).toBe(true);
      expect(isEven(0)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(isEven(3)).toBe(false);
      expect(isEven(1)).toBe(false);
    });

    it('should handle negative numbers', () => {
      expect(isEven(-2)).toBe(true);
      expect(isEven(-3)).toBe(false);
    });
  });
});
