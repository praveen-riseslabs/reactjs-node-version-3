CREATE DATABASE RisesLabs;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE gender_enum AS ENUM ('male', 'female', 'preferNotToSay');

-- user table
CREATE TABLE
    users (
        id UUID NOT NULL PRIMARY KEY,
        fullname VARCHAR(50) NOT NULL,
        username VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        phone_number VARCHAR(13) NOT NULL,
        password TEXT NOT NULL,
        gender gender_enum DEFAULT 'preferNotToSay'
    );

-- otp table
CREATE TABLE
    otps (
        id UUID NOT NULL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ,
        otp TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL
    );