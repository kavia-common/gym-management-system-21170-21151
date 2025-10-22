import React from 'react';
import Card from '../components/Card';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { pricingPlans } from '../data/demoContent';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function MembershipsPublic() {
  const nav = useNavigate();

  const onPurchase = () => {
    nav('/signin');
  };

  return (
    <div className="grid">
      <SectionHeader
        title="Memberships"
        description="Transparent pricing. Choose a plan that fits your training rhythm."
      />
      <div className="grid cols-4">
        {pricingPlans.map((p) => (
          <Card key={p.id} title={p.name} actions={
            <Button onClick={onPurchase}>Sign in to purchase</Button>
          }>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>${p.priceUSD}</div>
            <div className="helper" style={{ marginBottom: 8 }}>
              {p.interval[0].toUpperCase() + p.interval.slice(1)} billing
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Access to class schedule</li>
              <li>Trainer browsing</li>
              <li>Progress tracking</li>
            </ul>
          </Card>
        ))}
      </div>
      <Card>
        <div className="helper">
          Prices are demo values in USD. Sign in to complete checkout flows in protected mode.
        </div>
      </Card>
    </div>
  );
}
