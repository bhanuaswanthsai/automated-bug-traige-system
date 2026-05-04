export const triageBug = (title, description) => {
  const content = `${title} ${description}`.toLowerCase();
  
  let severity = 'Low';
  let priority = 'P4';
  let category = 'Other';
  let confidenceScore = 50;

  // Keyword sets
  const criticalKeywords = ['crash', 'fails', 'not working', 'data loss', 'fatal'];
  const highKeywords = ['slow', 'lag', 'memory leak', 'timeout'];
  const mediumKeywords = ['bug', 'error', 'incorrect', 'issue'];
  
  const uiKeywords = ['ui', 'alignment', 'button', 'color', 'layout', 'responsive', 'css'];
  const backendKeywords = ['api', 'database', 'query', 'server', 'endpoint', '500'];
  const performanceKeywords = ['slow', 'lag', 'timeout', 'loading'];
  const securityKeywords = ['auth', 'unauthorized', 'token', 'xss', 'injection', 'security'];

  // Categorization
  if (securityKeywords.some(kw => content.includes(kw))) {
    category = 'Security';
    severity = 'Critical';
    priority = 'P1';
    confidenceScore += 30;
  } else if (backendKeywords.some(kw => content.includes(kw))) {
    category = 'Backend';
    confidenceScore += 20;
  } else if (performanceKeywords.some(kw => content.includes(kw))) {
    category = 'Performance';
    confidenceScore += 20;
  } else if (uiKeywords.some(kw => content.includes(kw))) {
    category = 'UI';
    confidenceScore += 20;
  }

  // Severity and Priority (if not already set by Security)
  if (category !== 'Security') {
    if (criticalKeywords.some(kw => content.includes(kw))) {
      severity = 'Critical';
      priority = 'P1';
      confidenceScore += 20;
    } else if (highKeywords.some(kw => content.includes(kw))) {
      severity = 'High';
      priority = 'P2';
      confidenceScore += 15;
    } else if (mediumKeywords.some(kw => content.includes(kw))) {
      severity = 'Medium';
      priority = 'P3';
      confidenceScore += 10;
    }
  }

  // Cap confidence score
  confidenceScore = Math.min(confidenceScore, 98);

  return {
    severity,
    priority,
    category,
    confidenceScore
  };
};
