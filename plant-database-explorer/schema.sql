-- ==========================================
-- Database Schema for Plant Recommendation V2
-- ==========================================

-- 1. ตารางเก็บแคตตาล็อกพันธุ์พืช 
CREATE TABLE plants (
    plant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,      
    care_level VARCHAR(50) NOT NULL,    
    sunlight_req VARCHAR(50) NOT NULL, 
    water_req VARCHAR(50) NOT NULL,    
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ตารางเก็บประวัติการค้นหา (เก็บ Log ละเอียดขึ้น)
CREATE TABLE search_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    search_category VARCHAR(50),
    search_care_level VARCHAR(50),
    search_sunlight VARCHAR(50),
    search_water VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);