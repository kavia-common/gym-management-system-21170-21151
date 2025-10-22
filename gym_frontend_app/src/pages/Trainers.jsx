import React from 'react';
import Card from '../components/Card';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { trainers } from '../data/demoContent';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function TrainersPublic() {
  const nav = useNavigate();
  const onBook = () => nav('/signin');

  return (
    <div className="grid">
      <SectionHeader
        title="Our Trainers"
        description="Meet a few of our seasoned coaches—ready to help you get stronger, move better, and stay consistent."
      />
      <div className="grid cols-3">
        {trainers.map((t) => (
          <Card
            key={t.id}
            title={t.name}
            actions={<Button variant="primary" onClick={onBook}>Sign in to book</Button>}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              <img
                src={t.photo}
                alt={`${t.name} photo`}
                style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12 }}
              />
              <div>
                <div className="helper" style={{ marginBottom: 6 }}>
                  {t.gender} • {t.yearsOfExperience} yrs experience
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span className="badge">Specialties</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {t.specialties.map((s, i) => (
                    <span key={i} className="badge">{s}</span>
                  ))}
                </div>
                <div>{t.bio}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
