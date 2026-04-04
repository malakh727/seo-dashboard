const calculateScore = (data) => {
  const hasTitle     = !!data.title;
  const goodTitleLen = hasTitle && data.title.length >= 30 && data.title.length <= 60;
  const hasMeta      = !!data.metaDescription;
  const goodMetaLen  = hasMeta && data.metaDescription.length >= 120 && data.metaDescription.length <= 160;
  const hasH1        = data.h1?.length > 0;
  const singleH1     = data.h1?.length === 1;
  const hasH2        = data.h2?.length > 0;

  const checks = [
    { label: 'Page title present',                      pts: 10, pass: hasTitle },
    { label: 'Title length (30–60 chars)',               pts: 15, pass: goodTitleLen },
    { label: 'Meta description present',                pts: 10, pass: hasMeta },
    { label: 'Meta description length (120–160 chars)', pts: 15, pass: goodMetaLen },
    { label: 'H1 heading present',                      pts: 15, pass: hasH1 },
    { label: 'Single H1 tag (best practice)',           pts: 15, pass: singleH1 },
    { label: 'H2 headings present',                     pts: 20, pass: hasH2 },
  ];

  let score = 0;
  const scoreBreakdown = checks.map((c) => {
    if (c.pass) score += c.pts;
    return { label: c.label, points: c.pass ? c.pts : 0, maxPoints: c.pts, passed: c.pass };
  });

  return { score, scoreBreakdown };
};

module.exports = { calculateScore };
