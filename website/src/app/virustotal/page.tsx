"use client";
import React, { useState } from 'react';

// Shared types
interface ScanStats {
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
  timeout: number;
}

interface ScanResult {
  engine_name: string;
  category: string;
  result: string | null;
  method: string;
  engine_update: string;
}

// Response interfaces for different scan types
interface FileResponse {
  data: {
    attributes: {
      last_analysis_results: Record<string, ScanResult>;
      last_analysis_stats: ScanStats;
      meaningful_name: string;
      md5: string;
      sha1: string;
      sha256: string;
    };
  };
}

interface UrlResponse {
  data: {
    attributes: {
      last_analysis_results: Record<string, ScanResult>;
      last_analysis_stats: ScanStats;
      url: string;
      last_final_url: string;
      title: string;
      last_http_response_code: number;
      last_http_response_content_length: number;
      last_analysis_date: number;
    };
  };
}

interface DomainResponse {
  data: {
    attributes: {
      last_analysis_results: Record<string, ScanResult>;
      last_analysis_stats: ScanStats;
      last_dns_records: Record<string, any>[];
      creation_date: number;
      last_update_date: number;
      registrar: string;
      reputation: number;
      last_analysis_date: number;
    };
  };
}

type ScanType = 'file' | 'url' | 'domain';
type ScanResponse = FileResponse | UrlResponse | DomainResponse;

export default function VirusTotalScanner() {
  const [input, setInput] = useState<string>('');
  const [results, setResults] = useState<ScanResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scanType, setScanType] = useState<ScanType>('file');

  const isValidHash = (value: string): boolean => {
    // Check if the input is a valid MD5, SHA-1, or SHA-256 hash
    const md5Regex = /^[a-fA-F0-9]{32}$/;
    const sha1Regex = /^[a-fA-F0-9]{40}$/;
    const sha256Regex = /^[a-fA-F0-9]{64}$/;
    
    return md5Regex.test(value) || sha1Regex.test(value) || sha256Regex.test(value);
  };

  const isValidUrl = (value: string): boolean => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValidDomain = (value: string): boolean => {
    // Basic domain validation
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(value);
  };

  const validateInput = (): boolean => {
    if (!input.trim()) {
      setError('Input is required');
      return false;
    }

    switch (scanType) {
      case 'file':
        if (!isValidHash(input)) {
          setError('Please enter a valid MD5, SHA-1, or SHA-256 hash');
          return false;
        }
        break;
      case 'url':
        if (!isValidUrl(input)) {
          setError('Please enter a valid URL (including http:// or https://)');
          return false;
        }
        break;
      case 'domain':
        if (!isValidDomain(input)) {
          setError('Please enter a valid domain name');
          return false;
        }
        break;
    }

    return true;
  };

  const fetchVirusTotalData = async (): Promise<void> => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/virustotal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get',
          target: input,
          scanType: scanType
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data from VirusTotal');
    } finally {
      setLoading(false);
    }
  };

  // Submit new URL to VirusTotal
  const submitUrl = async (): Promise<void> => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitResponse = await fetch('/api/virustotal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'submit',
          target: input,
          scanType: 'url'
        })
      });

      if (!submitResponse.ok) {
        throw new Error(`Error submitting URL: ${submitResponse.status}`);
      }

      const submitData = await submitResponse.json();
      const analysisId = submitData.data.id;

      // Poll the analysis endpoint until it's complete
      let analysisComplete = false;
      let attempts = 0;

      while (!analysisComplete && attempts < 10) {
        const analysisResponse = await fetch('/api/virustotal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'analysis',
            target: analysisId
          })
        });

        if (!analysisResponse.ok) {
          throw new Error(`Error checking analysis: ${analysisResponse.status}`);
        }

        const analysisData = await analysisResponse.json();
        if (analysisData.data.attributes.status === 'completed') {
          analysisComplete = true;
        } else {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!analysisComplete) {
        throw new Error('Analysis timed out. Please try retrieving the results later.');
      }

      await fetchVirusTotalData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze URL');
    } finally {
      setLoading(false);
    }
  };

  const renderPlaceholderText = (): string => {
    switch (scanType) {
      case 'file':
        return 'Enter a file hash (MD5, SHA-1, or SHA-256)';
      case 'url':
        return 'Enter a URL to scan (include http:// or https://)';
      case 'domain':
        return 'Enter a domain name (e.g., example.com)';
      default:
        return 'Enter value to scan';
    }
  };

  const getDetectionRatio = (): string => {
    if (!results) return '0/0';
    
    const stats = 'data' in results && 'attributes' in results.data && 'last_analysis_stats' in results.data.attributes 
      ? results.data.attributes.last_analysis_stats 
      : { malicious: 0, harmless: 0, suspicious: 0, undetected: 0, timeout: 0 };
    
    return `${stats.malicious}/${stats.malicious + stats.suspicious + stats.harmless + stats.undetected + stats.timeout}`;
  };

  const getDetectionColor = (): string => {
    if (!results) return 'bg-gray-200';
    
    const stats = 'data' in results && 'attributes' in results.data && 'last_analysis_stats' in results.data.attributes 
      ? results.data.attributes.last_analysis_stats 
      : { malicious: 0 };
    
    const malicious = stats.malicious;
    const total = 'data' in results && 'attributes' in results.data && 'last_analysis_results' in results.data.attributes 
      ? Object.keys(results.data.attributes.last_analysis_results).length 
      : 1;
    
    const ratio = malicious / total;
    
    if (ratio === 0) return 'bg-green-500';
    if (ratio < 0.1) return 'bg-yellow-500';
    if (ratio < 0.3) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const renderFileResults = (data: FileResponse) => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-500">MD5</div>
            <div className="font-mono text-sm">{data.data.attributes.md5}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-500">SHA-1</div>
            <div className="font-mono text-sm">{data.data.attributes.sha1}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-500">SHA-256</div>
            <div className="font-mono text-sm">{data.data.attributes.sha256}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-500">Detection Ratio</div>
            <div className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full mr-2 ${getDetectionColor()}`}></span>
              <span className="font-medium">
                {getDetectionRatio()} (
                {data.data.attributes.last_analysis_stats.malicious} malicious)
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderUrlResults = (data: UrlResponse) => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded border border-gray-200 md:col-span-2">
            <div className="text-sm text-gray-500">URL</div>
            <div className="font-mono text-sm break-all">{data.data.attributes.url}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-500">Final URL</div>
            <div className="font-mono text-sm break-all">{data.data.attributes.last_final_url}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-500">HTTP Response</div>
            <div className="font-mono text-sm">{data.data.attributes.last_http_response_code}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-500">Title</div>
            <div className="font-mono text-sm">{data.data.attributes.title || 'N/A'}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-500">Detection Ratio</div>
            <div className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full mr-2 ${getDetectionColor()}`}></span>
              <span className="font-medium">
                {getDetectionRatio()} (
                {data.data.attributes.last_analysis_stats.malicious} malicious)
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderDomainResults = (data: DomainResponse) => {
    const attributes = data.data?.attributes || {};

    return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="text-sm text-gray-500">Registrar</div>
              <div className="font-mono text-sm">{attributes.registrar || 'N/A'}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="text-sm text-gray-500">Creation Date</div>
              <div className="font-mono text-sm">
                {attributes.creation_date ?
                    new Date(attributes.creation_date * 1000).toLocaleDateString() :
                    'N/A'}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="text-sm text-gray-500">Last Update</div>
              <div className="font-mono text-sm">
                {attributes.last_update_date ?
                    new Date(attributes.last_update_date * 1000).toLocaleDateString() :
                    'N/A'}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="text-sm text-gray-500">Detection Ratio</div>
              <div className="flex items-center">
                <span className={`inline-block w-4 h-4 rounded-full mr-2 ${getDetectionColor()}`}></span>
                <span className="font-medium">
              {getDetectionRatio()} (
                  {attributes.last_analysis_stats?.malicious || 0} malicious)
            </span>
              </div>
            </div>
          </div>

          {attributes.last_dns_records && attributes.last_dns_records.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3">DNS Records</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {attributes.last_dns_records.map((record, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{record.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{record.value}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}
        </>
    );
  };

  const renderResultsContent = () => {
    if (!results) return null;

    let resultTitle = 'Analysis Results';
    let resultContent = null;

    if ('data' in results && 'attributes' in results.data) {
      if (scanType === 'file' && 'md5' in results.data.attributes) {
        resultTitle = results.data.attributes.meaningful_name || 'File Analysis Results';
        resultContent = renderFileResults(results as FileResponse);
      } else if (scanType === 'url' && 'url' in results.data.attributes) {
        resultTitle = 'URL Analysis Results';
        resultContent = renderUrlResults(results as UrlResponse);
      } else if (scanType === 'domain') {
        resultTitle = `Domain Analysis: ${input}`;
        resultContent = renderDomainResults(results as DomainResponse);
      }
    }

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{resultTitle}</h2>
        </div>

        <div className="p-4">
          {resultContent}

          {/* Common scan results table */}
          {'data' in results && 'attributes' in results.data && 'last_analysis_results' in results.data.attributes && (
            <>
              <h3 className="text-lg font-medium mb-3">Detailed Scan Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Engine
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(results.data.attributes.last_analysis_results)
                      .sort((a, b) => {
                        // Sort by malicious first, then by engine name
                        if (a[1].category === 'malicious' && b[1].category !== 'malicious') return -1;
                        if (a[1].category !== 'malicious' && b[1].category === 'malicious') return 1;
                        return a[0].localeCompare(b[0]);
                      })
                      .map(([engine, scanResult]) => (
                        <tr key={engine}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {engine}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {scanResult.result || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${scanResult.category === 'malicious' ? 'bg-red-100 text-red-800' : 
                                scanResult.category === 'suspicious' ? 'bg-yellow-100 text-yellow-800' : 
                                scanResult.category === 'harmless' ? 'bg-green-100 text-green-800' : 
                                'bg-gray-100 text-gray-800'}`}
                            >
                              {scanResult.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {scanResult.method}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='w-full h-svh flex align-center'>
    <div className="p-6 max-w-4xl flex-1 m-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Virus Scanner</h1>
    
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => {
              setScanType('file');
              setInput('');
              setResults(null);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 ${
              scanType === 'file' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            File Hash
          </button>
          <button
            onClick={() => {
              setScanType('url');
              setInput('');
              setResults(null);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 ${
              scanType === 'url' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => {
              setScanType('domain');
              setInput('');
              setResults(null);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 ${
              scanType === 'domain' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Domain
          </button>
        </div>
        
        <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
          {scanType === 'file' ? 'File Hash' : scanType === 'url' ? 'URL' : 'Domain Name'}
        </label>
        <div className="flex">
          <input
            type="text"
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l focus:ring-amber-600 focus:border-amber-600"
            placeholder={renderPlaceholderText()}
          />
          <button
            onClick={scanType === 'url' ? submitUrl : fetchVirusTotalData}
            disabled={loading}
            className="px-4 py-2 bg-amber-500 text-white rounded-r hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Scanning...' : scanType === 'url' ? 'Submit & Scan' : 'Scan'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {renderResultsContent()}
     
    </div>
    </div>
  );
};

// Shared types
interface ScanStats {
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
  timeout: number;
}

interface ScanResult {
  engine_name: string;
  category: string;
  result: string | null;
  method: string;
  engine_update: string;
}

// Response interfaces for different scan types
interface FileResponse {
  data: {
    attributes: {
      last_analysis_results: Record<string, ScanResult>;
      last_analysis_stats: ScanStats;
      meaningful_name: string;
      md5: string;
      sha1: string;
      sha256: string;
    };
  };
}

interface UrlResponse {
  data: {
    attributes: {
      last_analysis_results: Record<string, ScanResult>;
      last_analysis_stats: ScanStats;
      url: string;
      last_final_url: string;
      title: string;
      last_http_response_code: number;
      last_http_response_content_length: number;
      last_analysis_date: number;
    };
  };
}

interface DomainResponse {
  data: {
    attributes: {
      last_analysis_results: Record<string, ScanResult>;
      last_analysis_stats: ScanStats;
      last_dns_records: Record<string, any>[];
      creation_date: number;
      last_update_date: number;
      registrar: string;
      reputation: number;
      last_analysis_date: number;
    };
  };
}

