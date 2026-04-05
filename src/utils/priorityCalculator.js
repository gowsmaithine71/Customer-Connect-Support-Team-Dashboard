export function calculatePriority(emotionWeight, waitingTimeScore, businessPriority, weights = null) {
  const w = weights || { alpha: 0.4, beta: 0.35, gamma: 0.25 };
  
  const score = 
    (emotionWeight * w.alpha) +
    (waitingTimeScore * w.beta) +
    (businessPriority * w.gamma);
  
  return Math.round(Math.min(100, score));
}

export function getPriorityLevel(priority) {
  if (priority > 80) return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' };
  if (priority > 60) return { level: 'High', color: 'text-amber-400', bg: 'bg-amber-500/20' };
  if (priority > 40) return { level: 'Medium', color: 'text-blue-400', bg: 'bg-blue-500/20' };
  return { level: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
}

export function getSlaStatus(predictedTTR, slaLimit) {
  const ratio = predictedTTR / slaLimit;
  if (ratio > 1) return { status: 'Breached', color: 'text-red-400', bg: 'bg-red-500/20' };
  if (ratio > 0.75) return { status: 'At Risk', color: 'text-amber-400', bg: 'bg-amber-500/20' };
  if (ratio > 0.5) return { status: 'Warning', color: 'text-blue-400', bg: 'bg-blue-500/20' };
  return { status: 'Healthy', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
}

export function getEmotionColor(emotion) {
  const colors = {
    'Frustrated': 'text-red-400',
    'Angry': 'text-red-500',
    'Confused': 'text-amber-400',
    'Worried': 'text-orange-400',
    'Neutral': 'text-slate-400',
    'Satisfied': 'text-blue-400',
    'Happy': 'text-emerald-400'
  };
  return colors[emotion] || 'text-slate-400';
}

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function formatCountdown(hours) {
  if (hours <= 0) return '0h 0m';
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h}h ${m}m`;
}
