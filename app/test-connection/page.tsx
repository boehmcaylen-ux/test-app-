'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestConnection() {
  const [status, setStatus] = useState<string>('Testing connection...')
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    async function testConnection() {
      try {
        // Try to fetch from businesses table (should be empty but accessible)
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .limit(1)

        if (error) {
          setStatus(`Error: ${error.message}`)
        } else {
          setStatus('✅ Connected successfully!')

          // Get list of tables
          const tableNames = [
            'businesses',
            'profiles',
            'jobs',
            'job_assignments',
            'check_ins',
            'job_photos',
            'issue_flags'
          ]
          setTables(tableNames)
        }
      } catch (err) {
        setStatus(`Error: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

        <div className="mb-6">
          <p className="text-lg font-semibold mb-2">Connection Status:</p>
          <p className={`text-lg ${status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        </div>

        {tables.length > 0 && (
          <div>
            <p className="text-lg font-semibold mb-2">Database Tables:</p>
            <ul className="list-disc list-inside space-y-1">
              {tables.map(table => (
                <li key={table} className="text-gray-700">{table}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600">
            <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Key loaded:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Yes' : '❌ No'}
          </p>
        </div>
      </div>
    </div>
  )
}
