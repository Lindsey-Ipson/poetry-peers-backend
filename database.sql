\echo 'Delete and recreate poetry_peers db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE poetry_peers;
CREATE DATABASE poetry_peers;
\connect poetry_peers

\i schema.sql
\i seed.sql

\echo 'Delete and recreate poetry_peers_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE poetry_peers_test;
CREATE DATABASE poetry_peers_test;
\connect poetry_peers_test

\i schema.sql
