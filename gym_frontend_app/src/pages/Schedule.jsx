import React from 'react';
import Card from '../components/Card';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { weeklySchedule } from '../data/demoContent';

// PUBLIC_INTERFACE
export default function SchedulePublic() {
  return (
    <div className="grid">
      <SectionHeader
        title="Beginner Weekly Schedule"
        description="A simple, sustainable plan to build momentum. Adjust timings to your preference."
      />
      <div className="grid cols-3">
        {weeklySchedule.map((d) => (
          <Card key={d.day} title={d.day}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{d.focus}</div>
            <div className="helper">{d.details}</div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="helper">
          This schedule is read-only for all visitors. Sign in to personalize your plan and track sessions.
        </div>
      </Card>
    </div>
  );
}
