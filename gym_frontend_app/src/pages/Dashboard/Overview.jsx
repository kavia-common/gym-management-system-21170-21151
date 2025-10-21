import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import StatWidget from '../../components/ui/StatWidget';
import SectionHeader from '../../components/ui/SectionHeader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import api from '../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * Overview: Redesigned dashboard with modern UI featuring:
 * - Key stat widgets (Active Members, Today's Classes, Upcoming Bookings, Revenue MTD)
 * - Quick actions for common tasks
 * - Schedule preview with next classes
 * - Recent activity feed
 * - Alerts for payment issues or important notices
 */
export default function Overview() {
  const [membership, setMembership] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeMembers: 0,
    todaysClasses: 0,
    upcomingBookings: 0,
    revenueMTD: 0,
  });

  useEffect(() => {
    const run = async () => {
      let membershipData = null;
      try {
        const mem = await api.get('/memberships/current');
        setMembership(mem);
        membershipData = mem;
      } catch {}
      try {
        const sess = await api.get('/classes/sessions');
        setSessions(sess?.slice?.(0, 5) || []);
        
        // Mock stats calculation (in production, these would come from backend)
        const today = new Date();
        const todaySessions = (sess || []).filter(s => {
          const startDate = new Date(s.start_time);
          return startDate.toDateString() === today.toDateString();
        });
        
        setStats({
          activeMembers: membershipData ? 1 : 0,
          todaysClasses: todaySessions.length,
          upcomingBookings: (sess || []).length,
          revenueMTD: membershipData?.status === 'active' ? 1250 : 0, // Mock value
        });
      } catch {}
      setLoading(false);
    };
    run();
  }, []);

  const upcomingSessions = sessions.slice(0, 3);
  const recentActivity = [
    { type: 'signup', user: 'You', action: 'Joined the gym', time: '2 days ago' },
    ...(membership?.status === 'active' ? [{ type: 'membership', user: 'You', action: 'Activated membership', time: '2 days ago' }] : []),
  ];

  const alerts = [];
  if (membership?.status === 'pending' || membership?.status === 'suspended') {
    alerts.push({
      type: 'warning',
      title: 'Membership Issue',
      message: `Your membership is ${membership.status}. Please update your payment information.`,
    });
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <SectionHeader
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening today."
      />

      {/* Key Stats */}
      <div className="grid cols-4" style={{ marginBottom: '32px' }}>
        <StatWidget
          label="Active Members"
          value={loading ? '—' : stats.activeMembers}
          icon="👥"
          delta="+12%"
          deltaType="positive"
          bgColor="rgba(30, 58, 138, 0.08)"
        />
        <StatWidget
          label="Today's Classes"
          value={loading ? '—' : stats.todaysClasses}
          icon="🏋️"
          delta="+3"
          deltaType="positive"
          bgColor="rgba(245, 158, 11, 0.08)"
        />
        <StatWidget
          label="Upcoming Bookings"
          value={loading ? '—' : stats.upcomingBookings}
          icon="📅"
          delta="-2"
          deltaType="negative"
          bgColor="rgba(5, 150, 105, 0.08)"
        />
        <StatWidget
          label="Revenue MTD"
          value={loading ? '—' : `$${stats.revenueMTD}`}
          icon="💰"
          delta="+8%"
          deltaType="positive"
          bgColor="rgba(220, 38, 38, 0.08)"
        />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          {alerts.map((alert, idx) => (
            <Card
              key={idx}
              style={{
                background: 'rgba(245, 158, 11, 0.05)',
                borderLeft: '4px solid var(--secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>
                    {alert.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
                    {alert.message}
                  </p>
                </div>
                <Link to="/dashboard/memberships">
                  <Button variant="secondary" size="sm">Resolve</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link to="/dashboard/memberships">
            <Button variant="primary">💳 Manage Membership</Button>
          </Link>
          <Link to="/dashboard/classes">
            <Button variant="ghost">🏋️ Browse Classes</Button>
          </Link>
          <Link to="/dashboard/trainers">
            <Button variant="ghost">👤 Book Trainer</Button>
          </Link>
          <Link to="/dashboard/bookings">
            <Button variant="ghost">📅 View Bookings</Button>
          </Link>
        </div>
      </Card>

      <div className="grid cols-2">
        {/* Schedule Preview */}
        <Card
          title="Schedule Preview"
          actions={
            <Link to="/dashboard/classes">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          }
        >
          {loading ? (
            <div className="helper">Loading schedule...</div>
          ) : upcomingSessions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    padding: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(245, 158, 11, 0.02) 100%)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
                        Class #{session.class_id}
                      </h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                        {new Date(session.start_time).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={session.spots_remaining > 5 ? 'success' : 'error'} size="sm">
                      {session.spots_remaining} spots
                    </Badge>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Ends: {new Date(session.end_time).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📅"
              title="No upcoming sessions"
              description="Browse available classes to book your next workout"
              action={
                <Link to="/dashboard/classes">
                  <Button variant="primary" size="sm">Browse Classes</Button>
                </Link>
              }
            />
          )}
        </Card>

        {/* Recent Activity */}
        <Card
          title="Recent Activity"
          actions={
            <Button variant="ghost" size="sm">View All</Button>
          }
        >
          {recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--hover)',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>
                    {activity.type === 'signup' ? '✨' : activity.type === 'membership' ? '💳' : '📋'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>
                      <strong>{activity.user}</strong> {activity.action}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📋"
              title="No recent activity"
              description="Your activity will appear here"
            />
          )}
        </Card>
      </div>

      {/* Membership Status */}
      <Card title="Membership Status" style={{ marginTop: '32px' }} gradient>
        {loading ? (
          <div className="helper">Loading membership information...</div>
        ) : membership ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge variant={membership.status === 'active' ? 'success' : 'error'}>
                  {membership.status}
                </Badge>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Plan ID</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{membership.plan_id}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Start Date</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{membership.start_date || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>End Date</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{membership.end_date || '—'}</div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon="💳"
            title="No active membership"
            description="Subscribe to a membership plan to access all gym features"
            action={
              <Link to="/dashboard/memberships">
                <Button variant="primary">View Plans</Button>
              </Link>
            }
          />
        )}
      </Card>
    </div>
  );
}
