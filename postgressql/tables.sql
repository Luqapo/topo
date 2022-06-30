CREATE SCHEMA catalog;

CREATE TABLE catalog.region (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  long FLOAT,
  lat FLOAT
);

SELECT AddGeometryColumn ('catalog','region','geom',2180,'POINT',2);

-- VALUES(2, ST_GeomFromText('POINT(50.45427771 19.55495313)', 2180));
-- VALUES(2, ST_GeomFromText('POINT(long lat)', 2180));

CREATE TABLE catalog.area (
  id SERIAL PRIMARY KEY,
  region_id integer REFERENCES catalog.region(id),
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE catalog.sector (
  id SERIAL PRIMARY KEY,
  area_id integer REFERENCES catalog.area(id),
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE catalog.crag (
  id SERIAL PRIMARY KEY,
  sector_id integer REFERENCES catalog.sector(id),
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  long FLOAT,
  lat FLOAT
);

CREATE TYPE grades AS ENUM (
  '',
  'I',
  'II',
  'III',
  'III+',
  'IV',
  'IV+',
  'V-',
  'V',
  'V+',
  'V+/VI',
  'VI-',
  'VI',
  'VI+',
  'VI+/1',
  'VI.1',
  'VI.1/1+',
  'VI.1+',
  'VI.1+/2',
  'VI.2',
  'VI.2/2+',
  'VI.2+',
  'VI.2+/3',
  'VI.3',
  'VI.3/3+',
  'VI.3+',
  'VI.3+/4',
  'VI.4',
  'VI.4/4+',
  'VI.4+',
  'VI.4+/5',
  'VI.5',
  'VI.5/5+',
  'VI.5+',
  'VI.5+/6',
  'VI.6',
  'VI.6/6+',
  'VI.6+',
  'VI.6+/7',
  'VI.7',
  'VI.7/7+',
  'VI.7+',
  'VI.7+/8',
  'VI.8',
  'VI.8/8+',
  'VI.8+'
);

CREATE TABLE catalog.route (
  id SERIAL PRIMARY KEY,
  crag_id integer REFERENCES catalog.crag(id),
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  grade GRADES NOT NULL,
  protection  VARCHAR,
  author VARCHAR,
  year SMALLINT,
  length SMALLINT
);

SELECT AddGeometryColumn ('catalog','crag','geom',2180,'POINT',2);
CREATE INDEX route_geometry ON catalog.crag USING GIST (geom);


SELECT cs.name as skala, ca.name as rejon, cc.name as skala, crg.name as region
FROM catalog.route cr
LEFT JOIN catalog.sector cs ON cs.id = cr.crag_id
LEFT JOIN catalog.area ca ON ca.id = cs.area_id
LEFT JOIN catalog.crag cc ON cc.sector_id = cs.id
LEFT JOIN catalog.region crg ON crg.id = ca.region_id
-- SELECT * FROM catalog.crag 
