/**
 * Google Apps Script Unit Testing Framework
 * Simple testing framework for Google Apps Script functions
 * Requirements: 8.1
 */

/**
 * Test suite configuration
 */
const TEST_CONFIG = {
  ENABLE_LOGGING: true,
  LOG_LEVEL: 'INFO',
  MOCK_DATA_ENABLED: true,
  TEST_TIMEOUT: 30000, // 30 seconds
  ASSERTION_TIMEOUT: 5000 // 5 seconds
};

/**
 * Test results storage
 */
let testResults = {
  suites: [],
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  skippedTests: 0,
  startTime: null,
  endTime: null,
  duration: 0
};

/**
 * Current test context
 */
let currentSuite = null;
let currentTest = null;

/**
 * Test Suite Class
 */
class TestSuite {
  constructor(name, description = '') {
    this.name = name;
    this.description = description;
    this.tests = [];
    this.beforeEachFn = null;
    this.afterEachFn = null;
    this.beforeAllFn = null;
    this.afterAllFn = null;
    this.startTime = null;
    this.endTime = null;
    this.duration = 0;
  }

  beforeAll(fn) {
    this.beforeAllFn = fn;
  }

  afterAll(fn) {
    this.afterAllFn = fn;
  }

  beforeEach(fn) {
    this.beforeEachFn = fn;
  }

  afterEach(fn) {
    this.afterEachFn = fn;
  }

  addTest(test) {
    this.tests.push(test);
  }

  async run() {
    this.startTime = Date.now();
    testLog('INFO', `Starting test suite: ${this.name}`);

    try {
      // Run beforeAll hook
      if (this.beforeAllFn) {
        await this.beforeAllFn();
      }

      // Run all tests
      for (const test of this.tests) {
        try {
          // Run beforeEach hook
          if (this.beforeEachFn) {
            await this.beforeEachFn();
          }

          await test.run();

          // Run afterEach hook
          if (this.afterEachFn) {
            await this.afterEachFn();
          }
        } catch (error) {
          test.status = 'failed';
          test.error = error.message;
          test.stack = error.stack;
          testLog('ERROR', `Test failed: ${test.name} - ${error.message}`);
        }
      }

      // Run afterAll hook
      if (this.afterAllFn) {
        await this.afterAllFn();
      }

    } catch (error) {
      testLog('ERROR', `Test suite setup/teardown failed: ${this.name} - ${error.message}`);
    }

    this.endTime = Date.now();
    this.duration = this.endTime - this.startTime;
    testLog('INFO', `Completed test suite: ${this.name} in ${this.duration}ms`);
  }

  getResults() {
    const passed = this.tests.filter(t => t.status === 'passed').length;
    const failed = this.tests.filter(t => t.status === 'failed').length;
    const skipped = this.tests.filter(t => t.status === 'skipped').length;

    return {
      name: this.name,
      description: this.description,
      tests: this.tests.map(t => t.getResults()),
      totalTests: this.tests.length,
      passed,
      failed,
      skipped,
      duration: this.duration,
      success: failed === 0
    };
  }
}

/**
 * Test Case Class
 */
class TestCase {
  constructor(name, testFn, description = '') {
    this.name = name;
    this.description = description;
    this.testFn = testFn;
    this.status = 'pending';
    this.error = null;
    this.stack = null;
    this.startTime = null;
    this.endTime = null;
    this.duration = 0;
    this.assertions = [];
  }

  async run() {
    this.startTime = Date.now();
    currentTest = this;
    
    try {
      testLog('DEBUG', `Running test: ${this.name}`);
      await this.testFn();
      this.status = 'passed';
      testLog('DEBUG', `Test passed: ${this.name}`);
    } catch (error) {
      this.status = 'failed';
      this.error = error.message;
      this.stack = error.stack;
      testLog('ERROR', `Test failed: ${this.name} - ${error.message}`);
      throw error;
    } finally {
      this.endTime = Date.now();
      this.duration = this.endTime - this.startTime;
      currentTest = null;
    }
  }

  skip() {
    this.status = 'skipped';
    testLog('INFO', `Test skipped: ${this.name}`);
  }

  getResults() {
    return {
      name: this.name,
      description: this.description,
      status: this.status,
      duration: this.duration,
      error: this.error,
      stack: this.stack,
      assertions: this.assertions.length
    };
  }
}

/**
 * Assertion functions
 */
const assert = {
  /**
   * Assert that a value is truthy
   */
  isTrue(actual, message = '') {
    const assertion = {
      type: 'isTrue',
      actual,
      expected: true,
      message,
      passed: !!actual
    };
    
    if (currentTest) {
      currentTest.assertions.push(assertion);
    }
    
    if (!assertion.passed) {
      throw new Error(`Assertion failed: Expected truthy value, got ${actual}. ${message}`);
    }
  },

  /**
   * Assert that a value is falsy
   */
  isFalse(actual, message = '') {
    const assertion = {
      type: 'isFalse',
      actual,
      expected: false,
      message,
      passed: !actual
    };
    
    if (currentTest) {
      currentTest.assertions.push(assertion);
    }
    
    if (!assertion.passed) {
      throw new Error(`Assertion failed: Expected falsy value, got ${actual}. ${message}`);
    }
  },

  /**
   * Assert equality
   */
  equals(actual, expected, message = '') {
    const assertion = {
      type: 'equals',
      actual,
      expected,
      message,
      passed: actual === expected
    };
    
    if (currentTest) {
      currentTest.assertions.push(assertion);
    }
    
    if (!assertion.passed) {
      throw new Error(`Assertion failed: Expected ${expected}, got ${actual}. ${message}`);
    }
  },

  /**
   * Assert deep equality for objects
   */
  deepEquals(actual, expected, message = '') {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    const passed = actualStr === expectedStr;
    
    const assertion = {
      type: 'deepEquals',
      actual,
      expected,
      message,
      passed
    };
    
    if (currentTest) {
      currentTest.assertions.push(assertion);
    }
    
    if (!passed) {
      throw new Error(`Assertion failed: Objects not equal. Expected ${expectedStr}, got ${actualStr}. ${message}`);
    }
  },

  /**
   * Assert that a value is not null or undefined
   */
  isNotNull(actual, message = '') {
    const assertion = {
      type: 'isNotNull',
      actual,
      expected: 'not null',
      message,
      passed: actual !== null && actual !== undefined
    };
    
    if (currentTest) {
      currentTest.assertions.push(assertion);
    }
    
    if (!assertion.passed) {
      throw new Error(`Assertion failed: Expected non-null value, got ${actual}. ${message}`);
    }
  },

  /**
   * Assert that a value is null or undefined
   */
  isNull(actual, message = '') {
    const assertion = {
      type: 'isNull',
      actual,
      expected: null,
      message,
      passed: actual === null || actual === undefined
    };
    
    if (currentTest) {
      currentTest.assertions.push(assertion);
    }
    
    if (!assertion.passed) {
      throw new Error(`Assertion failed: Expected null value, got ${actual}. ${message}`);
    }
  },

  /**
   * Assert that a function throws an error
   */
  throws(fn, expectedError = null, message = '') {
    let threwError = false;
    let actualError = null;
    
    try {
      fn();
    } catch (error) {
      threwError = true;
      actualError = error;
    }
    
    const assertion = {
      type: 'throws',
      actual: actualError ? actualError.message : 'no error',
      expected: expectedError || 'any error',
      message,
      passed: threwError && (expectedError ? actualError.message.includes(expectedError) : true)
    };
    
    if (currentTest) {
      currentTest.assertions.push(assertion);
    }
    
    if (!assertion.passed) {
      if (!threwError) {
        throw new Error(`Assertion failed: Expected function to throw an error. ${message}`);
      } else if (expectedError && !actualError.message.includes(expectedError)) {
        throw new Error(`Assertion failed: Expected error containing "${expectedError}", got "${actualError.message}". ${message}`);
      }
    }
  },

  /**
   * Assert that a value contains a substring or property
   */
  contains(actual, expected, message = '') {
    let passed = false;
    
    if (typeof actual === 'string') {
      passed = actual.includes(expected);
    } else if (Array.isArray(actual)) {
      passed = actual.includes(expected);
    } else if (typeof actual === 'object' && actual !== null) {
      passed = actual.hasOwnProperty(expected);
    }
    
    const assertion = {
      type: 'contains',
      actual,
      expected,
      message,
      passed
    };
    
    if (currentTest) {
      currentTest.assertions.push(assertion);
    }
    
    if (!passed) {
      throw new Error(`Assertion failed: Expected ${actual} to contain ${expected}. ${message}`);
    }
  }
};

/**
 * Test runner functions
 */
function describe(name, description, testFn) {
  const suite = new TestSuite(name, description);
  currentSuite = suite;
  
  try {
    testFn();
  } catch (error) {
    testLog('ERROR', `Error setting up test suite ${name}: ${error.message}`);
  }
  
  testResults.suites.push(suite);
  currentSuite = null;
  return suite;
}

function it(name, testFn, description = '') {
  if (!currentSuite) {
    throw new Error('Test case must be defined within a test suite (describe block)');
  }
  
  const test = new TestCase(name, testFn, description);
  currentSuite.addTest(test);
  return test;
}

function beforeAll(fn) {
  if (!currentSuite) {
    throw new Error('beforeAll must be defined within a test suite (describe block)');
  }
  currentSuite.beforeAll(fn);
}

function afterAll(fn) {
  if (!currentSuite) {
    throw new Error('afterAll must be defined within a test suite (describe block)');
  }
  currentSuite.afterAll(fn);
}

function beforeEach(fn) {
  if (!currentSuite) {
    throw new Error('beforeEach must be defined within a test suite (describe block)');
  }
  currentSuite.beforeEach(fn);
}

function afterEach(fn) {
  if (!currentSuite) {
    throw new Error('afterEach must be defined within a test suite (describe block)');
  }
  currentSuite.afterEach(fn);
}

/**
 * Test execution functions
 */
async function runAllTests() {
  testResults.startTime = Date.now();
  testLog('INFO', 'Starting test execution');
  
  try {
    for (const suite of testResults.suites) {
      await suite.run();
    }
  } catch (error) {
    testLog('ERROR', `Test execution failed: ${error.message}`);
  }
  
  testResults.endTime = Date.now();
  testResults.duration = testResults.endTime - testResults.startTime;
  
  // Calculate totals
  testResults.totalTests = testResults.suites.reduce((sum, suite) => sum + suite.tests.length, 0);
  testResults.passedTests = testResults.suites.reduce((sum, suite) => 
    sum + suite.tests.filter(t => t.status === 'passed').length, 0);
  testResults.failedTests = testResults.suites.reduce((sum, suite) => 
    sum + suite.tests.filter(t => t.status === 'failed').length, 0);
  testResults.skippedTests = testResults.suites.reduce((sum, suite) => 
    sum + suite.tests.filter(t => t.status === 'skipped').length, 0);
  
  testLog('INFO', `Test execution completed in ${testResults.duration}ms`);
  testLog('INFO', `Results: ${testResults.passedTests} passed, ${testResults.failedTests} failed, ${testResults.skippedTests} skipped`);
  
  return getTestResults();
}

function getTestResults() {
  return {
    summary: {
      totalTests: testResults.totalTests,
      passed: testResults.passedTests,
      failed: testResults.failedTests,
      skipped: testResults.skippedTests,
      duration: testResults.duration,
      success: testResults.failedTests === 0
    },
    suites: testResults.suites.map(suite => suite.getResults())
  };
}

/**
 * Logging function for tests
 */
function testLog(level, message, context = null) {
  if (!TEST_CONFIG.ENABLE_LOGGING) return;
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  
  if (context) {
    console.log(logMessage, context);
  } else {
    console.log(logMessage);
  }
}

/**
 * Mock data helpers for testing
 */
const TestMocks = {
  /**
   * Create mock request parameters
   */
  createMockRequest(overrides = {}) {
    return {
      parameter: {
        token: CONFIG.API_TOKEN,
        action: 'crud',
        table: 'materials',
        operation: 'list',
        ...overrides
      },
      postData: null
    };
  },

  /**
   * Create mock POST request
   */
  createMockPostRequest(data, overrides = {}) {
    return {
      parameter: {
        token: CONFIG.API_TOKEN,
        ...overrides
      },
      postData: {
        contents: JSON.stringify(data)
      }
    };
  },

  /**
   * Create mock user data
   */
  createMockUser(overrides = {}) {
    return {
      id: 'test_user_001',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      status: 'active',
      ...overrides
    };
  },

  /**
   * Create mock material data
   */
  createMockMaterial(overrides = {}) {
    return {
      id: 'test_material_001',
      sku: 'TEST001',
      descripcion: 'Test Material',
      categoria: 'Test Category',
      unidad: 'Unit',
      costo_ref: 10.00,
      stock_actual: 100,
      stock_minimo: 10,
      proveedor_principal: 'Test Provider',
      activo: true,
      ...overrides
    };
  }
};

/**
 * Test utilities
 */
const TestUtils = {
  /**
   * Wait for a specified amount of time
   */
  async wait(ms) {
    return new Promise(resolve => {
      Utilities.sleep(ms);
      resolve();
    });
  },

  /**
   * Generate random test data
   */
  generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Generate random number
   */
  generateRandomNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};