BEGIN;

-- Create table for Arduino devices
CREATE TABLE IF NOT EXISTS arduinos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    location TEXT NOT NULL,
    device_id TEXT NOT NULL,
    UNIQUE(location, device_id)
);

-- Create table for temperature readings
CREATE TABLE IF NOT EXISTS temp (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    arduino_id INTEGER NOT NULL REFERENCES arduinos(id)
);

-- Create table for humidity readings
CREATE TABLE IF NOT EXISTS humidity (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    arduino_id INTEGER NOT NULL REFERENCES arduinos(id)
);

-- Create table for noise readings
CREATE TABLE IF NOT EXISTS noise (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    arduino_id INTEGER NOT NULL REFERENCES arduinos(id)
);

-- Create table for light readings
CREATE TABLE IF NOT EXISTS light (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    arduino_id INTEGER NOT NULL REFERENCES arduinos(id)
);

COMMIT;
