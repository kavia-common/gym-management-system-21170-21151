import React from 'react';
import Card from '../components/Card';
import Button from '../components/ui/Button.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useSupabaseAuth } from '../context/AuthContext';
import { pricingPlans } from '../data/demoContent';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * MemberHome: Member details page. Intended to be wrapped by ProtectedRoute.
 * If rendered while unauthenticated (defensive), shows a small sign-in prompt.
 */
export default function MemberHome() {
  const { isAuthenticated, user, profile } = useSupabaseAuth();
  const nav = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="card">
        <SectionHeader
          title="Member Home"
          description="Please sign in to view your member details."
          actions={<Button onClick={() => nav('/signin')}>Sign in</Button>}
        />
      </div>
    );
  }

  const signedInProfile = {
    name: profile?.name || user?.email || "Member",
    age: profile?.age ?? "—",
    gender: profile?.gender ?? "—",
    membership: profile?.membership_name ?? "—",
    expiry: profile?.membership_end ?? "—",
  };

  return (
    <div className="grid">
      <SectionHeader
        title="Member Home"
        description="Welcome back! Here's a quick summary of your profile."
      />
      <div className="grid cols-3">
        <Card title="Profile">
          <div><b>Name:</b> {signedInProfile.name}</div>
          <div><b>Age:</b> {signedInProfile.age}</div>
          <div><b>Gender:</b> {signedInProfile.gender}</div>
        </Card>
        <Card title="Membership">
          <div><b>Plan:</b> {signedInProfile.membership}</div>
          <div><b>Expiry:</b> {signedInProfile.expiry}</div>
        </Card>
        <Card title="Recommended">
          <div className="helper" style={{ marginBottom: 8 }}>
            Try a time-bound plan to build consistency. Popular choice:
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {pricingPlans.slice(1, 2).map((p) => (
              <span key={p.id} className="badge">{p.name} - ${p.priceUSD}</span>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Next steps">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a className="btn" href="/dashboard/member">Open Member Dashboard</a>
          <a className="btn ghost" href="/dashboard/member/schedule">View Schedule</a>
        </div>
      </Card>
    </div>
  );
}
