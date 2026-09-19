import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Download, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { TestCase } from '../types';

export const TestSuiteRunner: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runningIndex, setRunningIndex] = useState<number>(-1);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);

  const fetchTestSuite = async () => {
    try {
      const res = await fetch('/api/test/suite');
      const data = await res.json();
      setTestCases(data.testCases || []);
      if (data.testCases && data.testCases.length > 0 && !selectedTestCase) {
        setSelectedTestCase(data.testCases[0]);
      }
    } catch (err) {
      console.error('Failed to fetch test suite:', err);
    }
  };

  useEffect(() => {
    fetchTestSuite();
  }, []);

  const runSingleTest = async (testId: string) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === testId ? { ...tc, status: 'running' } : tc))
    );

    try {
      const res = await fetch('/api/test/run-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId })
      });
      const data = await res.json();
      if (data.testCase) {
        setTestCases((prev) =>
          prev.map((tc) => (tc.id === testId ? data.testCase : tc))
        );
        if (selectedTestCase?.id === testId) {
          setSelectedTestCase(data.testCase);
        }
      }
    } catch (err) {
      console.error(`Failed running test ${testId}:`, err);
      setTestCases((prev) =>
        prev.map((tc) => (tc.id === testId ? { ...tc, status: 'failed', actualResponse: 'Network Failure' } : tc))
      );
    }
  };

  const runAllTests = async () => {
    if (isRunningAll) return;
    setIsRunningAll(true);

    for (let i = 0; i < testCases.length; i++) {
      setRunningIndex(i);
      await runSingleTest(testCases[i].id);
      // Brief breathing gap between API requests
      await new Promise((r) => setTimeout(r, 400));
    }

    setIsRunningAll(false);
    setRunningIndex(-1);
  };

  const handleResetAllTests = () => {
    setTestCases((prev) =>
      prev.map((tc) => ({
        ...tc,
        status: 'idle',
        actualResponse: undefined,
        latencyMs: undefined,
        matchedSources: undefined,
        improvementNote: undefined
      }))
    );
  };

  const exportReportJSON = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      platform: 'Maa AI Chat — AI_03 Track 3',
      metrics: {
        total: testCases.length,
        passed: testCases.filter((t) => t.status === 'passed').length,
        failed: testCases.filter((t) => t.status === 'failed').length,
        idle: testCases.filter((t) => t.status === 'idle').length,
        accuracyScore: `${Math.round(
          (testCases.filter((t) => t.status === 'passed').length / (testCases.length || 1)) * 100
        )}%`
      },
      testCases
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Maa_AI_Chat_Test_Report_${Date.now()}.json`;
    a.click();
  };

  const passedCount = testCases.filter((t) => t.status === 'passed').length;
  const failedCount = testCases.filter((t) => t.status === 'failed').length;
  const idleCount = testCases.filter((t) => t.status === 'idle').length;

  const categories = [
    'all',
    'Normal Query',
    'Complex Query',
    'Incomplete Query',
    'Incorrect / Misconception',
    'Unrelated / Out of Scope',
    'Repeated / Contextual',
    'Out-of-Scope Fallback',
    'Invalid Input',
    'Long Query',
    'Multiple Questions'
  ];

  const filteredTests = testCases.filter((tc) => {
    const matchCat = filterCategory === 'all' || tc.category === filterCategory;
    const matchStatus = filterStatus === 'all' || tc.status === filterStatus;
    return matchCat && matchStatus;
  });

  return (
    <div id="test-suite-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chatbot Automated Test Suite</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              30 Standard Test Cases
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Automated verification covering 10 requirement categories: normal, complex, incomplete, misconceptions, out-of-scope, invalid, and multi-question scenarios.
          </p>
        </div>

        {/* Global Test Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runAllTests}
            disabled={isRunningAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Play className={`w-4 h-4 ${isRunningAll ? 'animate-spin' : ''}`} />
            <span>{isRunningAll ? `Running (${runningIndex + 1}/${testCases.length})...` : 'Run All 30 Test Cases'}</span>
          </button>

          <button
            onClick={handleResetAllTests}
            disabled={isRunningAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={exportReportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (JSON)</span>
          </button>
        </div>
      </div>

      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tests</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{testCases.length}</p>
        </div>

        <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Passed
          </span>
          <p className="text-2xl font-black text-emerald-800 mt-1">{passedCount}</p>
        </div>

        <div className="p-4 bg-red-50/70 rounded-xl border border-red-200 shadow-2xs">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-600" /> Failed
          </span>
          <p className="text-2xl font-black text-red-800 mt-1">{failedCount}</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Pending / Idle
          </span>
          <p className="text-2xl font-black text-slate-700 mt-1">{idleCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All 10 Categories' : c}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="passed">Passed Only</option>
            <option value="failed">Failed Only</option>
            <option value="idle">Idle Only</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong>{filteredTests.length}</strong> of {testCases.length} test cases
        </span>
      </div>

      {/* Main Grid: Test Cases List & Active Inspection Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Test Cases List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
          {filteredTests.map((tc) => (
            <div
              key={tc.id}
              onClick={() => setSelectedTestCase(tc)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedTestCase?.id === tc.id
                  ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {tc.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    {tc.category}
                  </span>
                  {tc.status === 'passed' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> PASS
                    </span>
                  )}
                  {tc.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                      <XCircle className="w-3 h-3" /> FAIL
                    </span>
                  )}
                  {tc.status === 'running' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded animate-pulse">
                      <Clock className="w-3 h-3 animate-spin" /> RUNNING
                    </span>
                  )}
                  {tc.status === 'idle' && (
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      IDLE
                    </span>
                  )}
                </div>
              </div>

              <p className="font-semibold text-slate-900 text-xs mt-2 line-clamp-2">{tc.query}</p>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{tc.latencyMs ? `${tc.latencyMs}ms` : 'Not run yet'}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    runSingleTest(tc.id);
                  }}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                >
                  <Play className="w-3 h-3" /> Run
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detailed Inspection Card */}
        <div className="lg:col-span-7">
          {selectedTestCase ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between min-h-[550px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {selectedTestCase.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{selectedTestCase.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => runSingleTest(selectedTestCase.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Execute Test Case</span>
                    </button>
                  </div>
                </div>

                {/* Query */}
                <div className="mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">User Query</span>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 mt-1">
                    "{selectedTestCase.query}"
                  </div>
                </div>

                {/* Expected Criteria */}
                <div className="mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expected Response Criteria</span>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                    {selectedTestCase.expectedResponseCriteria}
                  </p>
                </div>

                {/* Actual Generated Response */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Actual Model Response</span>
                    {selectedTestCase.latencyMs && (
                      <span className="text-[11px] text-slate-400">Response Latency: {selectedTestCase.latencyMs}ms</span>
                    )}
                  </div>
                  {selectedTestCase.actualResponse ? (
                    <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap">
                      {selectedTestCase.actualResponse}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
                      Click "Execute Test Case" to generate response and evaluate against criteria.
                    </div>
                  )}
                </div>

                {/* Matched Sources */}
                {selectedTestCase.matchedSources && selectedTestCase.matchedSources.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grounded Knowledge Sources</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedTestCase.matchedSources.map((src, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-700 font-medium">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Footer & Improvement Note */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Evaluation:</span>
                  {selectedTestCase.status === 'passed' && (
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> PASSED (Meets All Verification Standards)
                    </span>
                  )}
                  {selectedTestCase.status === 'failed' && (
                    <span className="font-bold text-red-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> FAILED
                    </span>
                  )}
                  {selectedTestCase.status === 'idle' && (
                    <span className="text-slate-400 font-medium">Awaiting Execution</span>
                  )}
                </div>

                {selectedTestCase.improvementNote && (
                  <span className="text-slate-500 italic max-w-xs truncate text-[11px]">
                    Note: {selectedTestCase.improvementNote}
                  </span>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <FlaskConical className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-sm">Select a test case from the list to view parameters and output logs.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
