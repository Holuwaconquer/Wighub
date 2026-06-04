import React from 'react'

const DashboardTopBar = ({ title, subtitle, userName, userRole }) => {
  const formattedRole = userRole ? userRole.replace(/\b\w/g, (c) => c.toUpperCase()) : 'User'
  return (
    <div className="sticky top-6 z-30 mb-6 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            {subtitle || 'Dashboard'}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            {title || 'Overview'}
          </h1>
        </div>

        <div className="flex items-center gap-4 rounded-3xl bg-[#f7f5f9] p-4">
          <div className="rounded-2xl bg-[#9b83a3] px-4 py-2 text-sm font-semibold text-white shadow-sm">
            {formattedRole}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{userName || 'Welcome back'}</p>
            <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardTopBar
