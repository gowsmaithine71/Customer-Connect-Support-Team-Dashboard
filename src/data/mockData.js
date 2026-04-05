const emotionTypes = ['Frustrated', 'Angry', 'Confused', 'Worried', 'Neutral', 'Satisfied', 'Happy'];
const statuses = ['New', 'Assigned', 'In Progress', 'Escalated', 'Resolved'];
const categories = ['Billing', 'Technical', 'Account', 'General Inquiry', 'Feature Request'];

const customerNames = [
  'John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'James Wilson',
  'Emily Taylor', 'David Anderson', 'Jessica Martinez', 'Daniel Thomas', 'Ashley Jackson',
  'Christopher White', 'Amanda Harris', 'Matthew Martin', 'Stephanie Lee', 'Andrew Thompson'
];

const agentNames = [
  'Alex Thompson', 'Sarah Chen', 'Michael Roberts', 'Jessica Lee', 'David Kim',
  'Emily Watson', 'Chris Taylor', 'Amanda Brown', 'Ryan Davis', 'Nicole Wilson'
];

function generateRandomId() {
  return `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWaitingTimeScore(waitingHours) {
  // Score increases exponentially with waiting time
  return Math.min(100, Math.round(waitingHours * 10 * (1 + waitingHours / 24)));
}

function generateEmotionWeight(emotion) {
  const weights = {
    'Frustrated': 95,
    'Angry': 100,
    'Confused': 70,
    'Worried': 60,
    'Neutral': 30,
    'Satisfied': 15,
    'Happy': 5
  };
  return weights[emotion] || 30;
}

function generateBusinessPriority(category) {
  const priorities = {
    'Billing': getRandomInt(60, 90),
    'Technical': getRandomInt(50, 85),
    'Account': getRandomInt(40, 80),
    'General Inquiry': getRandomInt(20, 50),
    'Feature Request': getRandomInt(10, 40)
  };
  return priorities[category] || 40;
}

function calculateFinalPriority(emotionWeight, waitingTimeScore, businessPriority, weights = { alpha: 0.4, beta: 0.35, gamma: 0.25 }) {
  return Math.round(
    (emotionWeight * weights.alpha) +
    (waitingTimeScore * weights.beta) +
    (businessPriority * weights.gamma)
  );
}

export function generateTickets(count = 50) {
  const tickets = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const waitingHours = getRandomInt(1, 48);
    const createdAt = new Date(now.getTime() - waitingHours * 60 * 60 * 1000);
    const emotion = getRandomElement(emotionTypes);
    const category = getRandomElement(categories);
    const emotionWeight = generateEmotionWeight(emotion);
    const waitingTimeScore = generateWaitingTimeScore(waitingHours);
    const businessPriority = generateBusinessPriority(category);
    const finalPriority = calculateFinalPriority(emotionWeight, waitingTimeScore, businessPriority);
    
    // SLA limit in hours based on priority
    const slaLimit = finalPriority > 80 ? 2 : finalPriority > 60 ? 4 : finalPriority > 40 ? 8 : 24;
    const predictedTTR = getRandomInt(1, slaLimit + 2);
    const slaRisk = predictedTTR > slaLimit;
    
    tickets.push({
      id: generateRandomId(),
      customer: getRandomElement(customerNames),
      email: `customer${i}@example.com`,
      emotion,
      emotionWeight,
      waitingHours,
      waitingTimeScore,
      category,
      businessPriority,
      predictedTTR,
      slaLimit,
      slaRisk,
      finalPriority,
      status: getRandomElement(statuses),
      assignedAgent: Math.random() > 0.2 ? getRandomElement(agentNames) : null,
      createdAt: createdAt.toISOString(),
      updatedAt: new Date(now.getTime() - getRandomInt(0, waitingHours) * 60 * 60 * 1000).toISOString(),
      resolvedAt: null,
      satisfactionRating: null,
      notes: []
    });
  }
  
  return tickets;
}

export function generateAgents() {
  return agentNames.map((name, index) => ({
    id: index + 1,
    name,
    role: index < 2 ? 'Lead' : 'Agent',
    workload: getRandomInt(5, 20),
    resolvedToday: getRandomInt(2, 15),
    avgResolutionTime: getRandomInt(15, 60),
    satisfactionScore: getRandomInt(80, 99)
  }));
}

export function generatePriorityWeights() {
  return {
    alpha: 0.4,  // Emotion weight
    beta: 0.35,  // Waiting time score
    gamma: 0.25  // Business priority
  };
}

export function getEmotionDistribution(tickets) {
  const distribution = {};
  emotionTypes.forEach(emotion => {
    distribution[emotion] = 0;
  });
  tickets.forEach(ticket => {
    distribution[ticket.emotion] = (distribution[ticket.emotion] || 0) + 1;
  });
  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

export function getPriorityDistribution(tickets) {
  const distribution = {
    'Critical (>80)': 0,
    'High (60-80)': 0,
    'Medium (40-60)': 0,
    'Low (<40)': 0
  };
  tickets.forEach(ticket => {
    if (ticket.finalPriority > 80) distribution['Critical (>80)']++;
    else if (ticket.finalPriority > 60) distribution['High (60-80)']++;
    else if (ticket.finalPriority > 40) distribution['Medium (40-60)']++;
    else distribution['Low (<40)']++;
  });
  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

export function getSlaBreachTrend() {
  const trend = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    trend.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      breaches: getRandomInt(3, 15),
      resolved: getRandomInt(10, 30)
    });
  }
  return trend;
}

export function getAgentPerformance() {
  return agentNames.map(name => ({
    name: name.split(' ')[0],
    resolutionTime: getRandomInt(15, 60),
    ticketsResolved: getRandomInt(10, 40),
    satisfaction: getRandomInt(80, 99)
  }));
}
