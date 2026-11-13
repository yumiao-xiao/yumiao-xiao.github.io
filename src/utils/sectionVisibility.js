export function isDailyPapersVisible(config) {
  const daily = config.daily;
  const hasCurated = Array.isArray(daily?.papers) && daily.papers.length > 0;
  const hasKeywords = Array.isArray(daily?.keywords) && daily.keywords.length > 0;
  return config.enabled === true && daily?.enabled === true && (hasCurated || hasKeywords);
}
