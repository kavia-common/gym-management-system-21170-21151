import React from 'react';
import Card from '../components/Card';
import Button from '../components/ui/Button.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useSupabaseAuth } from '../context/AuthContext';
import { pricingPlans } from '../data/demoContent';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function MemberHomePublic() {
  const { isAuthenticated, user, profile } = useSupabaseAuth?.() || { isAuthenticated: false };
  const nav = useNavigate();

  const demoProfile = {
    name: "Taylor Demo",
    age: 28,
    gender: "Female",
    membership: "3 Months",
    expiry: "2025-03-31",
  };

  const signedInProfile = {
    name: profile?.name || user?.email || "Member",
    age: profile?.age ?? "—",
    gender: profile?.gender ?? "—",
    membership: profile?.membership_name ?? "—",
    expiry: profile?.membership_end ?? "—",
  };

  const display = isAuthenticated ? signedInProfile : demoProfile;

  return (
    <div className="grid">
      <SectionHeader
        title="Member Home"
        description={isAuthenticated ? "Welcome back! Here's a quick summary of your profile." : "Explore a sample member profile. Sign in to view your own details."}
        actions={!isAuthenticated ? <Button onClick={() => nav('/signin')}>Sign in</Button> : null}
      />
      <div className="grid cols-3">
        <Card title="Profile">
          <div><b>Name:</b> {display.name}</div>
          <div><b>Age:</b> {display.age}</div>
          <div><b>Gender:</b> {display.gender}</div>
        </Card>
        <Card title="Membership">
          <div><b>Plan:</b> {display.membership}</div>
          <div><b>Expiry:</b> {display.expiry}</div>
          {!isAuthenticated && (
            <div style={{ marginTop: 10 }}>
              <Button onClick={() => nav('/signin')}>Choose a plan</Button>
            </div>
          )}
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
        <div className="helper" style={{ marginBottom: 8 }}>
          Sign in to enroll in classes, book trainers, and track your progress.
        </div>
        {!isAuthenticated ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button onClick={() => nav('/signin')}>Sign in</Button>
            <Button variant="ghost" onClick={() => nav('/signup')}>Create account</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a className="btn" href="/dashboard/member">Open Member Dashboard</a>
            <a className="btn ghost" href="/dashboard/member/schedule">View Schedule</a>
          </div>
        )}
      </Card>
    </div>
  );
}
