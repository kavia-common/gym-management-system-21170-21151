import React from 'react';
import Card from '../components/Card';
import { overviewContent } from '../data/demoContent';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Overview() {
  const nav = useNavigate();

  const cta = (
    <Button onClick={() => nav('/signin')} variant="primary">
      Sign in to get started
    </Button>
  );

  return (
    <div className="grid">
      <SectionHeader
        title={overviewContent.title}
        description="Build strength, consistency, and confidence with a simple, effective workflow."
        actions={cta}
      />
      <Card>
        <p style={{ marginTop: 0 }}>{overviewContent.intro}</p>
      </Card>

      <div className="grid cols-3">
        <Card title="Benefits">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {overviewContent.benefits.map((b, i) => <li key={i} style={{ marginBottom: 8 }}>{b}</li>)}
          </ul>
        </Card>
        <Card title="How it works">
          <ol style={{ margin: 0, paddingLeft: 18 }}>
            {overviewContent.howItWorks.map((b, i) => <li key={i} style={{ marginBottom: 8 }}>{b}</li>)}
          </ol>
        </Card>
        <Card title="Next step">
          <div className="helper" style={{ marginBottom: 8 }}>
            Create an account to unlock bookings, checkouts, and personalized tracking.
          </div>
          {cta}
        </Card>
      </div>
    </div>
  );
}
