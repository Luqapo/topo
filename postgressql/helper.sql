-- count all
SELECT (SELECT COUNT(*) FROM catalog.route) as routes,
	(SELECT COUNT(*) FROM catalog.crag) as crags,
	(SELECT COUNT(*) FROM catalog.sector) as sectors,
	(SELECT COUNT(*) FROM catalog.area) as areas,
	(SELECT COUNT(*) FROM catalog.region) as regions;


-- select routes from crag
SELECT *
FROM catalog.route cr
LEFT JOIN catalog.crag cc ON cc.id = cr.crag_id
LEFT JOIN catalog.sector cs ON cs.id = cc.sector_id
WHERE cs.name = 'Zastudnie' AND cc.name = 'Baba';

-- select crags with same name
SELECT cc.name as crag, nn.count, cs.name as sector FROM catalog.crag cc
LEFT JOIN catalog.sector cs ON cs.id = cc.sector_id
LEFT JOIN (
	SELECT name, COUNT(*)::int as count FROM catalog.crag GROUP BY name
) nn ON cc.name = nn.name
WHERE nn.count > 1
ORDER BY cc.name