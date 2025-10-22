import React from 'react';
import Card from '../components/Card';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { weeklySchedule } from '../data/demoContent';
import { useSupabaseAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Schedule() {
  const { isAuthenticated } = useSupabaseAuth();
  const nav = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="card">
        <SectionHeader
          title="Schedule"
          description="Please sign in to view and manage your schedule."
          actions={<Button onClick={() => nav('/signin')}>Sign in</Button>}
        />
      </div>
    );
  }

  return (
    <div className="grid">
      <SectionHeader
        title="Your Weekly Schedule"
        description="Personalize your plan and track sessions."
      />
      <div className="grid cols-3">
        {weeklySchedule.map((d) => (
          <Card key={d.day} title={d.day}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{d.focus}</div>
            <div className="helper">{d.details}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
