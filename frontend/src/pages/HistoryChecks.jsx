import React, { useState } from 'react';
import BackButton from '../components/automarket/BackButton';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/automarket/Navbar';
import Footer from '../components/automarket/Footer';
import PullToRefresh from '../components/automarket/PullToRefresh';
import { queryClientInstance } from '@/lib/query-client';

export default function HistoryChecks() {
  const [historyChecks, setHistoryChecks] = useState([
    {
      id: 1,
      vehicleTitle: '2019 BMW 3 Series',
      registrationNumber: 'BMW1234',
      checkDate: '2026-05-10',
      status: 'Completed',
      mileage: '89,234 km',
      owner: 'John Motors',
    },
    {
      id: 2,
      vehicleTitle: '2021 Tesla Model 3',
      registrationNumber: 'TEL5678',
      checkDate: '2026-05-08',
      status: 'Completed',
      mileage: '23,456 km',
      owner: 'Electric Dreams',
    },
    {
      id: 3,
      vehicleTitle: '2018 Audi A4',
      registrationNumber: 'AUD9012',
      checkDate: '2026-05-05',
      status: 'Completed',
      mileage: '156,789 km',
      owner: 'Premium Cars Ltd',
    },
    {
      id: 4,
      vehicleTitle: '2020 Honda Civic',
      registrationNumber: 'HON3456',
      checkDate: '2026-05-01',
      status: 'Completed',
      mileage: '45,123 km',
      owner: 'Honda Specialist',
    },
  ]);

  const handleDownload = (id) => {
    const check = historyChecks.find(c => c.id === id);
    alert(`Downloading report for ${check.vehicleTitle}...`);
  };

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <PullToRefresh onRefresh={async () => { await queryClientInstance.invalidateQueries(); }}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <BackButton />
          <span>›</span>
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground font-medium">History Checks</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">History Checks</h1>

        {historyChecks.length === 0 ? (
          <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">No history checks</p>
            <p className="text-sm text-muted-foreground">Your vehicle history checks will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-card rounded-xl border border-border shadow-sm">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="bg-secondary/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Vehicle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Registration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Mileage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {historyChecks.map((check) => (
                  <tr key={check.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{check.vehicleTitle}</p>
                      <p className="text-xs text-muted-foreground">{check.owner}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{check.registrationNumber}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{check.checkDate}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{check.mileage}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {check.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDownload(check.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded transition-colors min-h-[44px]">
                        <Download className="w-4 h-4" />
                        Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </PullToRefresh>
      <Footer />
    </div>
  );
}